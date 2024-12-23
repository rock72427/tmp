import React from "react";
import "./Details.scss";

const Details = ({ activeTab }) => {
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

  const [selectedPurpose, setSelectedPurpose] = React.useState("");
  const [donationAmount, setDonationAmount] = React.useState("");

  return (
    <div
      className={`donation-form ${activeTab === "Mission" ? "mission-bg" : ""}`}
    >
      <h2 className="donation-form__title">Donations Details</h2>
      <form className="donation-form__container" style={{ marginTop: "10px" }}>
        <div className="donation-form__group">
          <label className="donation-form__label">
            Purpose <span className="donation-form__required">*</span>
          </label>
          <select
            className="donation-form__select"
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
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
        </div>

        {selectedPurpose === "Other" && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              Specify Purpose <span className="donation-form__required">*</span>
            </label>
            <input
              className="donation-form__input"
              type="text"
              placeholder="Please specify the purpose"
            />
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">Donations Type</label>
          <select
            className="donation-form__select"
            defaultValue="Others (Revenue)"
          >
            <option value="Others (Revenue)">Others (Revenue)</option>
            <option value="CORPUS">CORPUS</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Amount <span className="donation-form__required">*</span>
          </label>
          <input
            className="donation-form__input"
            type="number"
            placeholder=""
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
        </div>

        {Number(donationAmount) > 9999 && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              PAN Number <span className="donation-form__required">*</span>
            </label>
            <input
              className="donation-form__input"
              type="text"
              placeholder="Enter PAN Number"
            />
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">Transaction Type</label>
          <select className="donation-form__select" defaultValue="Cash">
            <option value="Cash">Cash</option>
            <option value="M.O">M.O</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="DD">DD</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">In Memory of</label>
          <input className="donation-form__input" type="text" placeholder="" />
        </div>
      </form>
    </div>
  );
};

export default Details;
