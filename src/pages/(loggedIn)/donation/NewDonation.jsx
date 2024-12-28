import React, { useEffect, useState } from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";
import DonationAction from "./DonationAction";
import DonationHistory from "./DonationHistory";
import TransactionDetails from "./TransactionDetails";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { BiBorderAll } from "react-icons/bi";

const NewDonation = () => {
  const donationStore = useDonationStore();
  const { activeTabId, setActiveSection } = donationStore;
  console.log("Full Donation Store State:", donationStore);
  console.log("Active Tab ID:", activeTabId);
  console.log("Donor Tabs:", donationStore.donorTabs);

  const [activeTab, setActiveTab] = useState("Math");
  const [transactionType, setTransactionType] = useState("Cash");
  const [isMobile, setIsMobile] = useState(false);

  // Listen for screen size changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1400px)");
    const handleMediaChange = () => setIsMobile(mediaQuery.matches);

    // Initial check
    handleMediaChange();

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",

    gap: "20px",

    margin: isMobile ? "10px" : "0",
  };

  const leftSectionStyle = {
    width: isMobile ? "100%" : "70%",
  };

  const rightSectionStyle = {
    width: isMobile ? "100%" : "30%",
  };

  return (
    <div>
      <DonationHeader onTabChange={setActiveTab} />
      <div className="container" style={containerStyle}>
        <div style={leftSectionStyle}>
          <DonorDetails activeTab={activeTab} />
          <DonationAction
            activeTab={activeTab}
            transactionType={transactionType}
          />
        </div>
        <div style={rightSectionStyle}>
          <Details
            activeTab={activeTab}
            onTransactionTypeChange={setTransactionType}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          marginTop: "15px",
        }}
      >
        <div style={leftSectionStyle}>
          <DonationHistory />
        </div>
        <div
          style={{
            ...rightSectionStyle,
            alignItems: "center",
          }}
        >
          {(transactionType === "Cheque" ||
            transactionType === "Bank Transfer" ||
            transactionType === "DD") && (
            <TransactionDetails activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDonation;
