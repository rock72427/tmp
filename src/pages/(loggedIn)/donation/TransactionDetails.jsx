import React, { useState } from "react";
import "./TransactionDetails.scss";
import useDonationStore from "../../../../donationStore";

const TransactionDetails = ({ activeTab }) => {
  const { donorTabs, activeTabId, updateTransactionDetails, fieldErrors } =
    useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonationDetails =
    donorTabs[activeTabId][currentSection].donationDetails;
  const currentTransactionDetails =
    donorTabs[activeTabId][currentSection].transactionDetails;

  const [transactionIdError, setTransactionIdError] = useState("");
  const [bankNameError, setBankNameError] = useState("");
  const [branchNameError, setBranchNameError] = useState("");

  const getLabels = () => {
    const transactionType = currentDonationDetails.transactionType;
    if (transactionType === "DD") {
      return {
        dateLabel: "DD Date",
        idLabel: "DD Number",
      };
    }
    if (transactionType === "Cheque") {
      return {
        dateLabel: "CH Date",
        idLabel: "CH Number",
      };
    }
    return {
      dateLabel: "Transaction Date",
      idLabel: "Transaction ID",
    };
  };

  const { dateLabel, idLabel } = getLabels();

  const handleDateChange = (e) => {
    updateTransactionDetails(activeTabId, currentSection, {
      date: e.target.value,
    });
  };

  const handleTransactionIdChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      updateTransactionDetails(activeTabId, currentSection, {
        transactionId: value,
      });
      setTransactionIdError("");
    } else {
      setTransactionIdError("Only numbers are allowed");
    }
  };

  const handleBankNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters, spaces, and basic punctuation
    if (/^[A-Za-z\s.&-]*$/.test(value)) {
      updateTransactionDetails(activeTabId, currentSection, {
        bankName: value,
      });
      setBankNameError("");
    } else {
      setBankNameError("Only letters and basic punctuation allowed");
    }
  };

  const handleBranchNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters, spaces, and basic punctuation
    if (/^[A-Za-z\s.&-]*$/.test(value)) {
      updateTransactionDetails(activeTabId, currentSection, {
        branchName: value,
      });
      setBranchNameError("");
    } else {
      setBranchNameError("Only letters and basic punctuation allowed");
    }
  };

  return (
    <div
      className="transaction-container"
      style={{
        backgroundColor:
          donorTabs[activeTabId].activeSection === "mission"
            ? "#99fb98"
            : "#ffb888",
      }}
    >
      <h2 className="transaction-title" style={{ fontWeight: "bold" }}>
        Transaction details
      </h2>

      <div className="transaction-form">
        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>
            {dateLabel} <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            placeholder="dd-mm-yyyy"
            value={currentTransactionDetails.date}
            onChange={handleDateChange}
          />
          {fieldErrors.transaction?.date && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.transaction.date}
            </span>
          )}
        </div>

        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>
            {idLabel} <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.transactionId}
            onChange={handleTransactionIdChange}
            placeholder="Enter numbers only"
          />
          {(transactionIdError || fieldErrors.transaction?.transactionId) && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {transactionIdError || fieldErrors.transaction.transactionId}
            </span>
          )}
        </div>

        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>
            Bank Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.bankName}
            onChange={handleBankNameChange}
            placeholder="Enter bank name"
          />
          {(bankNameError || fieldErrors.transaction?.bankName) && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {bankNameError || fieldErrors.transaction.bankName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>
            Branch Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.branchName}
            onChange={handleBranchNameChange}
            placeholder="Enter branch name"
          />
          {(branchNameError || fieldErrors.transaction?.branchName) && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {branchNameError || fieldErrors.transaction.branchName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
