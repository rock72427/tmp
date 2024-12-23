import React, { useState } from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";
import DonationAction from "./DonationAction";
import DonationHistory from "./DonationHistory";
import TransactionDetails from "./TransactionDetails";

const NewDonation = () => {
  const [activeTab, setActiveTab] = useState("Math");
  const [transactionType, setTransactionType] = useState("Cash");

  return (
    <div>
      <DonationHeader onTabChange={setActiveTab} />
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ width: "70%" }}>
          <DonorDetails activeTab={activeTab} />
          <DonationAction />
        </div>
        <div style={{ width: "30%" }}>
          <Details
            activeTab={activeTab}
            onTransactionTypeChange={setTransactionType}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        <div style={{ width: "70%" }}>
          <DonationHistory />
        </div>
        <div style={{ width: "30%" }}>
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
