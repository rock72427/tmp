import React, { useState } from "react";
import "./DonationHeader.scss";

const DonationHeader = () => {
  const [activeTab, setActiveTab] = useState("Math");

  return (
    <div className="atth-donation-wrapper">
      <div className="atth-donation-header">
        <div className="atth-header-left">
          <h2 className="atth-header-title">New Donation</h2>
          <div className="atth-header-actions">
            <button className="atth-btn-donor" style={{ fontSize: "1.1rem" }}>
              New Donor ×
            </button>
            <button className="atth-btn-add" style={{ fontSize: "1.1rem" }}>
              + Add Donation
            </button>
          </div>
        </div>

        <div className="atth-header-right">
          <div className="atth-info-group">
            <span className="atth-label">COUNTER NO.</span>
            <span className="atth-value">admin</span>
          </div>
          <div className="atth-info-group">
            <span className="atth-label">USER</span>
            <span className="atth-value">sagarmajhi</span>
          </div>
          <div className="atth-info-group">
            <span className="atth-label">DATE & TIME</span>
            <span className="atth-value">24/12/2024 1:17:29 AM</span>
          </div>
        </div>
      </div>

      <div className="atth-donation-subheader">
        <div className="atth-subheader-left">
          <div className="atth-tab-group">
            <button
              className={`atth-tab ${
                activeTab === "Math" ? "atth-active" : ""
              }`}
              onClick={() => setActiveTab("Math")}
              data-tab="math"
            >
              Math
            </button>
            <button
              className={`atth-tab ${
                activeTab === "Mission" ? "atth-active" : ""
              }`}
              onClick={() => setActiveTab("Mission")}
              data-tab="mission"
            >
              Mission
            </button>
          </div>
          <div className="atth-receipt-info">
            <span>Receipt Number: </span>
            <span className="atth-receipt-number">MT5</span>
          </div>
        </div>
        <button className="atth-btn-reset">↻ Reset</button>
      </div>
    </div>
  );
};

export default DonationHeader;
