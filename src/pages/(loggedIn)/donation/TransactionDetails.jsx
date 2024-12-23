import React from "react";
import "./TransactionDetails.scss";

const TransactionDetails = () => {
  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transaction details</h2>

      <div className="transaction-form">
        <div className="form-group">
          <label>
            Transaction Date
            <span className="required">*</span>
          </label>
          <input type="date" className="form-input" placeholder="dd-mm-yyyy" />
        </div>

        <div className="form-group">
          <label>Transaction ID</label>
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
