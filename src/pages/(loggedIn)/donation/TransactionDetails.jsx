import React from "react";
import "./TransactionDetails.scss";

const TransactionDetails = ({ transactionType }) => {
  const getLabels = () => {
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

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transaction details</h2>

      <div className="transaction-form">
        <div className="form-group">
          <label>
            {dateLabel}
            <span className="required">*</span>
          </label>
          <input type="date" className="form-input" placeholder="dd-mm-yyyy" />
        </div>

        <div className="form-group">
          <label>{idLabel}</label>
          <input type="text" className="form-input" />
        </div>

        <div className="form-group">
          <label>
            Bank Name
            <span className="required">*</span>
          </label>
          <input type="text" className="form-input" />
        </div>

        <div className="form-group">
          <label>Branch Name</label>
          <input type="text" className="form-input" />
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
