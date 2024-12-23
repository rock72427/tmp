import React from "react";
import "./TransactionDetails.scss";

const TransactionDetails = () => {
  return (
    <div className="donation-form">
      <h2 className="donation-form__title">Transaction details</h2>

      <form className="donation-form__container" style={{ marginTop: "10px" }}>
        <div className="donation-form__group">
          <label className="donation-form__label">
            Transaction Date
            <span className="donation-form__required">*</span>
          </label>
          <input
            type="date"
            className="donation-form__input"
            placeholder="dd-mm-yyyy"
          />
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">Transaction ID</label>
          <input type="text" className="donation-form__input" />
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">
            Bank Name
            <span className="donation-form__required">*</span>
          </label>
          <input type="text" className="donation-form__input" />
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">Branch Name</label>
          <input type="text" className="donation-form__input" />
        </div>
      </form>
    </div>
  );
};

export default TransactionDetails;
