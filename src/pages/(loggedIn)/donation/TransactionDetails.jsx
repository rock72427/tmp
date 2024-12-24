import React from "react";
import "./TransactionDetails.scss";
import useDonationStore from "../../../../donationStore";

const TransactionDetails = ({ activeTab }) => {
  const { donorTabs, activeTabId, updateTransactionDetails } =
    useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonationDetails =
    donorTabs[activeTabId][currentSection].donationDetails;
  const currentTransactionDetails =
    donorTabs[activeTabId][currentSection].transactionDetails;

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
    updateTransactionDetails(activeTabId, currentSection, {
      transactionId: e.target.value,
    });
  };

  const handleBankNameChange = (e) => {
    updateTransactionDetails(activeTabId, currentSection, {
      bankName: e.target.value,
    });
  };

  const handleBranchNameChange = (e) => {
    updateTransactionDetails(activeTabId, currentSection, {
      branchName: e.target.value,
    });
  };

  return (
    <div
      className="transaction-container"
      style={{
        backgroundColor: activeTab === "Mission" ? "#99fb98" : "#ffb888",
      }}
    >
      <h2 className="transaction-title">Transaction details</h2>

      <div className="transaction-form">
        <div className="form-group">
          <label>
            {dateLabel}
            <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            placeholder="dd-mm-yyyy"
            value={currentTransactionDetails.date}
            onChange={handleDateChange}
          />
        </div>

        <div className="form-group">
          <label>{idLabel}</label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.transactionId}
            onChange={handleTransactionIdChange}
          />
        </div>

        <div className="form-group">
          <label>
            Bank Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.bankName}
            onChange={handleBankNameChange}
          />
        </div>

        <div className="form-group">
          <label>Branch Name</label>
          <input
            type="text"
            className="form-input"
            value={currentTransactionDetails.branchName}
            onChange={handleBranchNameChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
