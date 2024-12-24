import React, { useState, useEffect } from "react";
import "./DonationHeader.scss";
import useDonationStore from "../../../../donationStore";

const DonationHeader = ({ onTabChange }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const {
    donorTabs,
    activeTabId,
    addNewDonorTab,
    setActiveTab,
    setActiveSection,
    removeDonorTab,
  } = useDonationStore();

  // Convert donorTabs object to array for rendering
  const donorTabsArray = Object.keys(donorTabs).map((id) => ({
    id: Number(id),
    label: `New Donor ${id}`,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (section) => {
    setActiveSection(activeTabId, section.toLowerCase());
    onTabChange(section);
  };

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
    addNewDonorTab();
  };

  const handleRemoveDonor = (id) => {
    if (Object.keys(donorTabs).length > 1) {
      // Prevent removing last tab
      removeDonorTab(id);
    }
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
              {donorTabsArray.map((tab) => (
                <button
                  key={tab.id}
                  className={`atth-btn-donor ${
                    activeTabId === tab.id ? "active" : ""
                  }`}
                  style={{
                    fontSize: "0.95rem",
                    margin: "4px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDonor(tab.id);
                    }}
                    style={{ marginLeft: "8px" }}
                  >
                    ×
                  </span>
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
                donorTabs[activeTabId].activeSection === "math"
                  ? "atth-active"
                  : ""
              }`}
              onClick={() => handleTabChange("Math")}
              data-tab="math"
            >
              Math
            </button>
            <button
              className={`atth-tab ${
                donorTabs[activeTabId].activeSection === "mission"
                  ? "atth-active"
                  : ""
              }`}
              onClick={() => handleTabChange("Mission")}
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
