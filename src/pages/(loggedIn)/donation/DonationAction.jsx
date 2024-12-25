import "./DonationAction.scss";
import useDonationStore from "../../../../donationStore";

const DonationAction = ({ totalAmount = 0, activeTab, transactionType }) => {
  const { donorTabs, activeTabId, setFieldErrors } = useDonationStore();
  const currentSection = activeTab.toLowerCase();

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

  const handlePrintReceipt = () => {
    validateFields();
  };

  const handlePending = () => {
    validateFields();
  };

  return (
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
  );
};

export default DonationAction;
