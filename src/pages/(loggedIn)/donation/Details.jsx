import React from "react";
import "./Details.scss";
import useDonationStore from "../../../../donationStore";

const Details = ({ activeTab, onTransactionTypeChange }) => {
  const mathOptions = [
    "Thakur Seva",
    "Sadhu Seva",
    "Nara Narayan Seva",
    "General Fund for Various Activities",
    "Welfare Fund",
    "Thakur's Tithi Puja Celebrations",
    "Holy Mother's Tithi Puja Celebrations",
    "Swamiji Tithi Puja Celebrations",
    "Other",
  ];

  const missionOptions = [
    "Helping Poor Students",
    "Rural Development Fund",
    "Welfare Fund",
    "General Fund for Various Activities",
    "All Round Child Development Project",
    "Charitable Dispensary & Eye (Day) Care Centre",
    "Other",
  ];

  const {
    donorTabs,
    activeTabId,
    updateDonationDetails,
    updateAndSyncDonorDetails,
    fieldErrors,
    setFieldErrors,
  } = useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonationDetails =
    donorTabs[activeTabId][currentSection].donationDetails;

  const clearFieldError = (fieldName) => {
    setFieldErrors({
      ...fieldErrors,
      donation: {
        ...fieldErrors.donation,
        [fieldName]: undefined,
      },
    });
  };

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { purpose: value });
    clearFieldError("purpose");
  };

  const handleSpecifiedPurposeChange = (e) => {
    updateDonationDetails(activeTabId, currentSection, {
      specifiedPurpose: e.target.value,
    });
  };

  const handleDonationTypeChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { donationType: value });
    clearFieldError("donationType");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { amount: value });
    clearFieldError("amount");
  };

  const handlePanNumberChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, {
      panNumber: value,
    });

    if (
      donorTabs[activeTabId][currentSection].donorDetails.identityType ===
      "PAN Card"
    ) {
      updateAndSyncDonorDetails({
        identityNumber: value,
      });
    }
  };

  const handleTransactionTypeChange = (e) => {
    const transactionType = e.target.value;
    updateDonationDetails(activeTabId, currentSection, {
      transactionType,
    });
    onTransactionTypeChange(transactionType);
  };

  const handleInMemoryOfChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { inMemoryOf: value });
    clearFieldError("inMemoryOf");
  };

  return (
    <div
      className={`donation-form ${
        donorTabs[activeTabId].activeSection === "mission" ? "mission-bg" : ""
      }`}
    >
      <h2 className="donation-form__title">Donations Details</h2>
      <form className="donation-form__container" style={{ marginTop: "10px" }}>
        <div className="donation-form__group">
          <label className="donation-form__label">
            Purpose <span className="required">*</span>
          </label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.purpose}
            onChange={handlePurposeChange}
          >
            <option value="" disabled>
              Select Purpose
            </option>
            {(activeTab === "Math" ? mathOptions : missionOptions).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
          {fieldErrors.donation.purpose && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.purpose}
            </span>
          )}
        </div>

        {currentDonationDetails.purpose === "Other" && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              Specify Purpose <span className="donation-form__required">*</span>
            </label>
            <input
              className="donation-form__input"
              type="text"
              placeholder="Please specify the purpose"
              value={currentDonationDetails.specifiedPurpose}
              onChange={handleSpecifiedPurposeChange}
            />
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Type <span className="required">*</span>
          </label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.donationType}
            onChange={handleDonationTypeChange}
          >
            <option value="Others (Revenue)">Others (Revenue)</option>
            <option value="CORPUS">CORPUS</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Amount <span className="required">*</span>
          </label>
          <input
            className="donation-form__input"
            type="number"
            placeholder=""
            value={currentDonationDetails.amount}
            onChange={handleAmountChange}
          />
          {fieldErrors.donation.amount && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.amount}
            </span>
          )}
        </div>

        {Number(currentDonationDetails.amount) > 9999 && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              PAN Number <span className="donation-form__required">*</span>
            </label>
            <input
              className="donation-form__input"
              type="text"
              placeholder="Enter PAN Number"
              value={currentDonationDetails.panNumber}
              onChange={handlePanNumberChange}
            />
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">Transaction Type</label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.transactionType}
            onChange={handleTransactionTypeChange}
          >
            <option value="Cash">Cash</option>
            <option value="M.O">M.O</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="DD">DD</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">In Memory of</label>
          <input
            className="donation-form__input"
            type="text"
            placeholder=""
            value={currentDonationDetails.inMemoryOf}
            onChange={handleInMemoryOfChange}
          />
          {fieldErrors.donation.inMemoryOf && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.inMemoryOf}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Details;
