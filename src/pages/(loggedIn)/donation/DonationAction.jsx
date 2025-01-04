import "./DonationAction.scss";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewGuestDetails } from "../../../../services/src/services/guestDetailsService";
import {
  createNewDonation,
  updateDonationById,
} from "../../../../services/src/services/donationsService";
import { useEffect, useState } from "react";
import ReceiptPreviewModal from "./ReceiptPreviewModal";
import { loginUser } from "../../../../services/auth";
import ConsentLetterTemplate from "./ConsentLetterTemplate";
import ThankLetterTemplate from "./ThankLetterTemplate";

const DonationAction = ({
  totalAmount = 0,
  activeTab,
  transactionType,
  onDonationSuccess,
}) => {
  const { donorTabs, activeTabId, setFieldErrors, updateDonationDetails } =
    useDonationStore();
  const { user } = useAuthStore();
  const currentSection = activeTab.toLowerCase();
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [uniqueNumbers, setUniqueNumbers] = useState([]);
  const [showPendingConfirmation, setShowPendingConfirmation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    // if (!donationDetails.inMemoryOf) {
    //   missingFields.push("In Memory Of");
    //   errors.donation.inMemoryOf = "In Memory Of is required";
    // }

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
      // if (!transactionDetails.branchName) {
      //   missingFields.push("Branch Name");
      //   errors.transaction.branchName = "Branch name is required";
      // }
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
        counter: user?.counter,
        status: status,
      });

      // Track if a new guest was created
      let isNewGuest = false;
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
          unique_no: currentTab.uniqueNo,
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
        isNewGuest = true;
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
          branchName: currentTransactionDetails?.branchName || "",
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

      // If this was a new guest, trigger a refresh of the donor details
      if (isNewGuest) {
        // You can either emit an event or call a refresh function directly
        const event = new CustomEvent("refreshDonorDetails");
        window.dispatchEvent(event);
      }

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

    // Convert amount to number before using toFixed
    const amount = parseFloat(currentDonationDetails.amount) || 0;

    setReceiptData({
      receiptNumber: currentTab.receiptNumbers[currentSection],
      uniqueNo: currentTab.uniqueNo,
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
      amount: amount.toFixed(2),
      purpose: currentDonationDetails.purpose,
    });

    setShowReceiptPreview(true);
  };

  const handleConfirmPrint = async () => {
    try {
      // Get current tab and donation details
      const currentTab = donorTabs[activeTabId];
      const currentDonationId =
        currentTab[currentSection]?.donationDetails?.donationId;
      const currentStatus = currentTab[currentSection]?.donationDetails?.status;

      console.log("Current donation details:", {
        donationId: currentDonationId,
        status: currentStatus,
        section: currentSection,
        tab: currentTab,
      });

      if (currentStatus === "pending" && currentDonationId) {
        console.log(
          "Attempting to update pending donation:",
          currentDonationId
        );

        // Update donation status in the database
        const updateResponse = await updateDonationById(currentDonationId, {
          data: {
            status: "completed",
            // Include any other required fields that might be needed
            updatedAt: new Date().toISOString(),
          },
        });

        console.log("Update response:", updateResponse);

        if (!updateResponse || !updateResponse.data) {
          throw new Error("Failed to get response from update operation");
        }

        // Update status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "completed",
        });

        console.log("Store updated successfully");
      } else {
        console.log("Creating new receipt as donation is not pending");
        await createReceipt("completed");
      }

      setShowReceiptPreview(false);

      // Call the success callback
      onDonationSuccess?.();

      // Fetch new receipt numbers
      const { fetchLatestReceiptNumbers } = useDonationStore.getState();
      await fetchLatestReceiptNumbers();

      // Remove the current tab after successful printing
      const { removeDonorTab } = useDonationStore.getState();
      removeDonorTab(activeTabId);
    } catch (error) {
      console.error("Error in handleConfirmPrint:", error);
      alert(`Failed to process donation: ${error.message}`);
    }
  };

  const handlePending = () => {
    setShowPendingConfirmation(true);
  };

  const handleConfirmPending = async () => {
    try {
      setShowPendingConfirmation(false);

      // Get current tab and donation details
      const currentTab = donorTabs[activeTabId];
      const currentDonationId =
        currentTab[currentSection]?.donationDetails?.donationId;

      console.log("Setting donation to pending:", {
        donationId: currentDonationId,
        section: currentSection,
        tab: currentTab,
      });

      if (currentDonationId) {
        // Update existing donation status to pending
        const updateResponse = await updateDonationById(currentDonationId, {
          data: {
            status: "pending",
            updatedAt: new Date().toISOString(),
          },
        });

        console.log("Update response:", updateResponse);

        if (!updateResponse || !updateResponse.data) {
          throw new Error("Failed to update donation status");
        }

        // Update the donation status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "pending",
        });
      } else {
        // Create new donation with pending status if no donation ID exists
        console.log(
          "No existing donation found, creating new pending donation"
        );
        const receiptResponse = await createReceipt("pending");
        console.log("New pending receipt created:", receiptResponse);

        // Update store with new donation details
        updateDonationDetails(activeTabId, currentSection, {
          status: "pending",
          donationId: receiptResponse?.data?.id,
        });
      }

      // Call the success callback
      onDonationSuccess?.();

      // Fetch new receipt numbers
      const { fetchLatestReceiptNumbers } = useDonationStore.getState();
      await fetchLatestReceiptNumbers();

      // Remove the current tab after successful operation
      const { removeDonorTab } = useDonationStore.getState();
      removeDonorTab(activeTabId);
    } catch (error) {
      console.error("Error handling pending donation:", error);
      alert(`Failed to process pending donation: ${error.message}`);
    }
  };

  const handleCancelClick = () => {
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  const handleCancelDonation = async () => {
    try {
      // Get the current donation ID from the store
      const currentTab = donorTabs[activeTabId];
      const donationId =
        currentTab[currentSection]?.donationDetails?.donationId;

      console.log("Cancelling donation with ID:", donationId);

      // Verify password using stored username
      await loginUser({
        identifier: user.username,
        password: password,
      });

      // If password verification succeeds, proceed with cancellation
      if (donationId) {
        await updateDonationById(donationId, {
          data: {
            status: "cancelled",
          },
        });

        // Update the donation status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "cancelled",
        });

        // Close modal and reset states
        setShowPasswordModal(false);
        setPassword("");
        setPasswordError("");

        // Remove the tab from the store
        const { removeDonorTab } = useDonationStore.getState();
        removeDonorTab(activeTabId);
      } else {
        console.error("No donation ID found");
        setPasswordError("Unable to cancel donation: No donation ID found");
      }
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("Invalid password or unable to cancel donation");
    }
  };

  const renderPasswordModal = () => {
    return (
      <div
        className="modal-overlay"
        style={{
          display: showPasswordModal ? "flex" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
          }}
        >
          <h3>Enter Password to Confirm</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassword("");
                setPasswordError("");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#gray",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCancelDonation}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ea7704",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleConsentLetter = () => {
    // Add number to words conversion function
    const numberToWords = (num) => {
      const single = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ];
      const double = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const formatTens = (num) => {
        if (num < 10) return single[num];
        if (num < 20) return double[num - 10];
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + single[num % 10] : "")
        );
      };

      if (num === 0) return "Zero";

      const convert = (num) => {
        if (num < 100) return formatTens(num);
        if (num < 1000)
          return (
            single[Math.floor(num / 100)] +
            " Hundred" +
            (num % 100 ? " and " + formatTens(num % 100) : "")
          );
        if (num < 100000)
          return (
            convert(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 ? " " + convert(num % 1000) : "")
          );
        if (num < 10000000)
          return (
            convert(Math.floor(num / 100000)) +
            " Lakh" +
            (num % 100000 ? " " + convert(num % 100000) : "")
          );
        return (
          convert(Math.floor(num / 10000000)) +
          " Crore" +
          (num % 10000000 ? " " + convert(num % 10000000) : "")
        );
      };

      return convert(Math.floor(num)) + " Rupees Only";
    };

    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const amount =
      parseFloat(
        donorTabs[activeTabId][currentSection].donationDetails.amount
      ) || 0;

    // Create the HTML content without the automatic print trigger
    const htmlContent = ConsentLetterTemplate({
      donationData: {
        donationDate: new Date().toISOString(),
        uniqueDonorId: donorTabs[activeTabId].uniqueNo,
        amount: amount,
        transactionType,
        donationType:
          donorTabs[activeTabId][currentSection].donationDetails.donationType,
        purpose: donorTabs[activeTabId][currentSection].donationDetails.purpose,
        title: donorTabs[activeTabId][currentSection].donorDetails.title,
        name: donorTabs[activeTabId][currentSection].donorDetails.name,
        houseNumber: donorTabs[activeTabId][currentSection].donorDetails.flatNo,
        streetName:
          donorTabs[activeTabId][currentSection].donorDetails.streetName,
        postOffice:
          donorTabs[activeTabId][currentSection].donorDetails.postOffice,
        district: donorTabs[activeTabId][currentSection].donorDetails.district,
        state: donorTabs[activeTabId][currentSection].donorDetails.state,
        pincode: donorTabs[activeTabId][currentSection].donorDetails.pincode,
        phone: donorTabs[activeTabId][currentSection].donorDetails.phone,
        inMemoryOf:
          donorTabs[activeTabId][currentSection].donationDetails.inMemoryOf,
        receiptNumber: donorTabs[activeTabId].receiptNumbers[currentSection],
      },
      formatDate: (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN"),
      numberToWords: numberToWords,
    });

    // Remove any existing print script from the content
    const contentWithoutPrintScript = htmlContent.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

    // Write the content to the iframe
    printFrame.contentDocument.write(contentWithoutPrintScript);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  const handleThankLetter = () => {
    // Add number to words conversion function
    const numberToWords = (num) => {
      const single = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ];
      const double = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const formatTens = (num) => {
        if (num < 10) return single[num];
        if (num < 20) return double[num - 10];
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + single[num % 10] : "")
        );
      };

      if (num === 0) return "Zero";

      const convert = (num) => {
        if (num < 100) return formatTens(num);
        if (num < 1000)
          return (
            single[Math.floor(num / 100)] +
            " Hundred" +
            (num % 100 ? " and " + formatTens(num % 100) : "")
          );
        if (num < 100000)
          return (
            convert(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 ? " " + convert(num % 1000) : "")
          );
        if (num < 10000000)
          return (
            convert(Math.floor(num / 100000)) +
            " Lakh" +
            (num % 100000 ? " " + convert(num % 100000) : "")
          );
        return (
          convert(Math.floor(num / 10000000)) +
          " Crore" +
          (num % 10000000 ? " " + convert(num % 10000000) : "")
        );
      };

      return convert(Math.floor(num)) + " Rupees Only";
    };

    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const amount =
      parseFloat(
        donorTabs[activeTabId][currentSection].donationDetails.amount
      ) || 0;

    // Create the HTML content without the automatic print trigger
    const htmlContent = ThankLetterTemplate({
      donationData: {
        donationDate: new Date().toISOString(),
        uniqueDonorId: donorTabs[activeTabId].uniqueNo,
        amount: amount,
        transactionType,
        donationType:
          donorTabs[activeTabId][currentSection].donationDetails.donationType,
        purpose: donorTabs[activeTabId][currentSection].donationDetails.purpose,
        title: donorTabs[activeTabId][currentSection].donorDetails.title,
        name: donorTabs[activeTabId][currentSection].donorDetails.name,
        houseNumber: donorTabs[activeTabId][currentSection].donorDetails.flatNo,
        streetName:
          donorTabs[activeTabId][currentSection].donorDetails.streetName,
        postOffice:
          donorTabs[activeTabId][currentSection].donorDetails.postOffice,
        district: donorTabs[activeTabId][currentSection].donorDetails.district,
        state: donorTabs[activeTabId][currentSection].donorDetails.state,
        pincode: donorTabs[activeTabId][currentSection].donorDetails.pincode,
        phone: donorTabs[activeTabId][currentSection].donorDetails.phone,
        inMemoryOf:
          donorTabs[activeTabId][currentSection].donationDetails.inMemoryOf,
        receiptNumber: donorTabs[activeTabId].receiptNumbers[currentSection],
      },
      formatDate: (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN"),
      numberToWords: numberToWords,
    });

    // Remove any existing print script from the content
    const contentWithoutPrintScript = htmlContent.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

    // Write the content to the iframe
    printFrame.contentDocument.write(contentWithoutPrintScript);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  // Add check for completed status
  const isCompleted =
    donorTabs[activeTabId][currentSection]?.donationDetails?.status ===
    "completed";

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
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 1 : 0.7,
              cursor: isCompleted ? "pointer" : "not-allowed",
            }}
            disabled={!isCompleted}
            onClick={handleConsentLetter}
          >
            <i className="far fa-file-alt"></i>
            Consent Letter
          </button>

          <button
            className="donation-action-btn thank-letter"
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 1 : 0.7,
              cursor: isCompleted ? "pointer" : "not-allowed",
            }}
            disabled={!isCompleted}
            onClick={handleThankLetter}
          >
            <i className="far fa-envelope"></i>
            Thank Letter
          </button>

          <button
            className="donation-action-btn pending"
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 0.7 : 1,
              cursor: isCompleted ? "not-allowed" : "pointer",
            }}
            onClick={handlePending}
            disabled={isCompleted}
          >
            <i className="far fa-clock"></i>
            Pending
          </button>

          <button
            className="donation-action-btn print-receipt"
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isCompleted ? "#fc5275" : "#8b5cf6",
              backgroundColor: isCompleted ? "#ffbdcb" : "#8b5cf6",
              color: isCompleted ? "#fc5275" : "#fff",
            }}
            onClick={isCompleted ? handleCancelClick : handlePrintReceipt}
          >
            <i className={isCompleted ? "fas fa-times" : "fas fa-print"}></i>
            {isCompleted ? "Cancel" : "Print Receipt"}
          </button>
        </div>
      </div>

      <ReceiptPreviewModal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        receiptData={receiptData}
        onConfirmPrint={handleConfirmPrint}
      />

      {/* Add Pending Confirmation Modal */}
      {showPendingConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="warning-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V14"
                  stroke="#FFB020"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17.5V18"
                  stroke="#FFB020"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#FFB020"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h2 style={{ fontWeight: 500, fontSize: "1.2rem" }}>
              Are you sure you want to keep this Donation in pending?
            </h2>
            <p>
              Once confirmed, the action will be final and cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPendingConfirmation(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirmPending}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {renderPasswordModal()}
    </>
  );
};

export default DonationAction;
