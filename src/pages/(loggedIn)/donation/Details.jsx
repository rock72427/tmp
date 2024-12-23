import React from "react";
import "./Details.scss";

const Details = () => {
  return (
    <div className="donation-form">
      <h2 className="donation-form__title">Donations Details</h2>
      <form className="donation-form__container">
        <div className="donation-form__group">
          <label className="donation-form__label">
            Purpose <span className="donation-form__required">*</span>
          </label>
          <select className="donation-form__select" defaultValue="">
            <option value="" disabled>
              Select Purpose
            </option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">Donations Type</label>
          <select
            className="donation-form__select"
            defaultValue="Others (Revenue)"
          >
            <option>Others (Revenue)</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Amount <span className="donation-form__required">*</span>
          </label>
          <input
            className="donation-form__input"
            type="number"
            placeholder="Enter amount"
          />
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">Transaction Type</label>
          <select className="donation-form__select" defaultValue="Cash">
            <option>Cash</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">In Memory of</label>
          <input
            className="donation-form__input"
            type="text"
            placeholder="Enter name"
          />
        </div>
      </form>
    </div>
  );
};

export default Details;
