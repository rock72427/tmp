import React, { useState, useEffect } from "react";
import "./DonationHeader.scss";

const DonationHeader = () => {
  const [activeTab, setActiveTab] = useState("Math");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [donorTabs, setDonorTabs] = useState([{ id: 1, label: "New Donor 1" }]);
  const [activeDonorTab, setActiveDonorTab] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleAddDonation = () => {
    const newId = donorTabs.length + 1;
    setDonorTabs([...donorTabs, { id: newId, label: `New Donor ${newId}` }]);
    setActiveDonorTab(newId);
  };

  return (
    <div className="atth-donation-wrapper">
      <div className="atth-donation-header">
        <div className="atth-header-left">
          <h2 className="atth-header-title">New Donation</h2>
          <div className="atth-header-actions">
            <div
              className="atth-donor-tabs"
              style={{ flexWrap: "wrap", maxHeight: "80px", overflowY: "auto" }}
            >
              {donorTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`atth-btn-donor ${
                    activeDonorTab === tab.id ? "active" : ""
                  }`}
                  style={{
                    fontSize: "0.95rem",
                    margin: "4px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setActiveDonorTab(tab.id)}
                >
                  {tab.label} ×
                </button>
              ))}
            </div>
            <button
              className="atth-btn-add"
              style={{
                fontSize: "0.95rem",
                marginLeft: "12px",
                alignSelf: "flex-start",
              }}
              onClick={handleAddDonation}
            >
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
            <span className="atth-value">
              {formatDateTime(currentDateTime)}
            </span>
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
