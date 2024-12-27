import "./DonationAction.scss";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { createNewDonation } from "../../../../services/src/services/donationsService";
import { useEffect, useState } from "react";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

const DonationAction = ({ totalAmount = 0, activeTab, transactionType }) => {
  const { donorTabs, activeTabId, setFieldErrors } = useDonationStore();
  const { user } = useAuthStore();
  const currentSection = activeTab.toLowerCase();
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [uniqueNumbers, setUniqueNumbers] = useState([]);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const validateFields = () => {
    const currentTab = donorTabs[activeTabId][currentSection];
    const donorDetails = currentTab.donorDetails;
    const donationDetails = currentTab.donationDetails;
    const transactionDetails = currentTab.transactionDetails;

    const missingFields = [];
    const errors = {
      donor: {},
      donation: {},
      transaction: {},
    };

    // Donor Details validation
    if (!donorDetails.name) {
      missingFields.push("Name of Donor");
      errors.donor.name = "Name is required";
    }
    if (!donorDetails.phone) {
      missingFields.push("Phone Number");
      errors.donor.phone = "Phone number is required";
    }
    if (!donorDetails.identityNumber) {
      missingFields.push("Identity Proof");
      errors.donor.identityNumber = "Identity proof is required";
    }
    if (!donorDetails.pincode) {
      missingFields.push("Pincode");
      errors.donor.pincode = "Pincode is required";
    }
    if (!donorDetails.deeksha || donorDetails.deeksha === "") {
      missingFields.push("Mantra Diksha");
      errors.donor.deeksha = "Mantra Diksha is required";
    }
    if (donorDetails.deeksha === "Others" && !donorDetails.otherDeeksha) {
      missingFields.push("Other Mantra Diksha Details");
      errors.donor.otherDeeksha = "Please specify Mantra Diksha";
    }

    // Donation Details validation
    if (!donationDetails.purpose) {
      missingFields.push("Purpose");
      errors.donation.purpose = "Purpose is required";
    }
    if (!donationDetails.donationType) {
      missingFields.push("Donation Type");
      errors.donation.donationType = "Donation type is required";
    }
    if (!donationDetails.amount) {
      missingFields.push("Donation Amount");
      errors.donation.amount = "Amount is required";
    }
    if (!donationDetails.inMemoryOf) {
      missingFields.push("In Memory Of");
      errors.donation.inMemoryOf = "In Memory Of is required";
    }

    // Transaction Details validation if applicable
    if (["Cheque", "Bank Transfer", "DD"].includes(transactionType)) {
      if (!transactionDetails.date) {
        missingFields.push("Transaction Date");
        errors.transaction.date = "Date is required";
      }
      if (!transactionDetails.transactionId) {
        missingFields.push("Transaction Number");
        errors.transaction.transactionId = "Transaction number is required";
      }
      if (!transactionDetails.bankName) {
        missingFields.push("Bank Name");
        errors.transaction.bankName = "Bank name is required";
      }
      if (!transactionDetails.branchName) {
        missingFields.push("Branch Name");
        errors.transaction.branchName = "Branch name is required";
      }
    }

    const hasErrors = missingFields.length > 0;

    if (hasErrors) {
      // First show the alert
      alert(
        `Please fill in the following required fields:\n${missingFields.join(
          "\n"
        )}`
      );

      // Then scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Finally set all errors at once in the store
      setFieldErrors(errors);

      return false;
    }

    // Clear all errors if validation passes
    setFieldErrors({ donor: {}, donation: {}, transaction: {} });
    return true;
  };

  const createReceipt = async (status) => {
    if (!validateFields()) return;

    const currentTab = donorTabs[activeTabId];
    const currentDonorDetails = currentTab[currentSection].donorDetails;
    const currentDonationDetails = currentTab[currentSection].donationDetails;
    const currentTransactionDetails =
      currentTab[currentSection].transactionDetails;

    try {
      // Create receipt first
      const receiptResponse = await createNewReceiptDetail({
        Receipt_number: currentTab.receiptNumbers[currentSection],
        donation_date: new Date().toISOString().split("T")[0],
        createdby: user?.id,
        unique_no: currentTab.uniqueNo,
        counter: user?.counter,
        status: status,
      });

      // Only create guest details if no guestId exists
      let guestId = currentDonorDetails.guestId;

      if (!guestId) {
        const guestResponse = await createNewGuestDetails({
          name: `${currentDonorDetails.title} ${currentDonorDetails.name}`,
          phone_number: currentDonorDetails.phone,
          deeksha:
            currentDonorDetails.deeksha === "Others"
              ? currentDonorDetails.otherDeeksha
              : currentDonorDetails.deeksha,
          email: currentDonorDetails.email,
          identity_proof: currentDonorDetails.identityType,
          identity_number: currentDonorDetails.identityNumber,
          address: [
            currentDonorDetails.flatNo,
            currentDonorDetails.streetName,
            currentDonorDetails.postOffice,
            currentDonorDetails.district,
            currentDonorDetails.state,
            currentDonorDetails.pincode,
          ]
            .filter(Boolean)
            .join(", "),
        });
        guestId = guestResponse.data.id;
      }

      // Map the currentSection to accepted donationFor values
      const donationForMapping = {
        math: "Math",
        mission: "Mission",
      };

      // Create donation with the appropriate guestId
      const donationData = {
        data: {
          guest: guestId,
          receipt_detail: receiptResponse.data.id,
          donationAmount: currentDonationDetails.amount,
          transactionType: transactionType,
          donationFor: donationForMapping[currentSection],
          InMemoryOf: currentDonationDetails.inMemoryOf,
          status: status,
          purpose: currentDonationDetails.purpose,
          type: currentDonationDetails.donationType,
        },
      };

      // Add bank-related fields only for Cheque, Bank Transfer, or DD
      if (["Cheque", "Bank Transfer", "DD"].includes(transactionType)) {
        donationData.data = {
          ...donationData.data,
          bankName: currentTransactionDetails?.bankName || "",
          ddch_date: currentTransactionDetails?.date || "",
          ddch_number: currentTransactionDetails?.transactionId || "",
        };
      }

      console.log("Donation data with IDs:", donationData);
      await createNewDonation(donationData);

      // alert(
      //   `Receipt ${
      //     status === "pending" ? "saved as pending" : "created"
      //   } successfully!`
      // );
      return receiptResponse;
    } catch (error) {
      console.error(
        "Error creating receipt, guest details, or donation:",
        error
      );
      alert("Failed to create receipt. Please try again.");
      throw error;
    }
  };

  const handlePrintReceipt = () => {
    if (!validateFields()) return;

    // Prepare receipt data for preview
    const currentTab = donorTabs[activeTabId];
    const currentDonorDetails = currentTab[currentSection].donorDetails;
    const currentDonationDetails = currentTab[currentSection].donationDetails;

    setReceiptData({
      receiptNumber: currentTab.receiptNumbers[currentSection],
      date: new Date().toLocaleDateString(),
      donorName: `${currentDonorDetails.title} ${currentDonorDetails.name}`,
      address: {
        flatNo: currentDonorDetails.flatNo,
        postOffice: currentDonorDetails.postOffice,
        district: currentDonorDetails.district,
        state: currentDonorDetails.state,
        pincode: currentDonorDetails.pincode,
      },
      transactionType: transactionType,
      amount: totalAmount.toFixed(2),
      purpose: currentDonationDetails.purpose,
    });

    setShowReceiptPreview(true);
  };

  const handleConfirmPrint = async () => {
    try {
      // Create receipt, guest, and donation here
      await createReceipt("completed");
      window.print();
      setShowReceiptPreview(false);
    } catch (error) {
      // Error handling is done in createReceipt
    }
  };

  const handlePending = () => {
    createReceipt("pending");
  };

  return (
    <>
      <div className="donation-action-bar">
        <div className="donation-total-amount">
          <span>Total Donation Amount</span>
          <span>₹ {totalAmount.toFixed(2)}</span>
        </div>

        <div className="donation-actions">
          <button
            className="donation-action-btn consent-letter"
            style={{ border: "1px solid #ccc" }}
          >
            <i className="far fa-file-alt"></i>
            Consent Letter
          </button>

          <button
            className="donation-action-btn thank-letter"
            style={{ border: "1px solid #ccc" }}
          >
            <i className="far fa-envelope"></i>
            Thank Letter
          </button>

          <button
            className="donation-action-btn pending"
            style={{ border: "1px solid #ccc" }}
            onClick={handlePending}
          >
            <i className="far fa-clock"></i>
            Pending
          </button>

          <button
            className="donation-action-btn print-receipt"
            style={{ border: "1px solid #ccc" }}
            onClick={handlePrintReceipt}
          >
            <i className="fas fa-print"></i>
            Print Receipt
          </button>
        </div>
      </div>

      <ReceiptPreviewModal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        receiptData={receiptData}
        onConfirmPrint={handleConfirmPrint}
      />
    </>
  );
};

export default DonationAction;
