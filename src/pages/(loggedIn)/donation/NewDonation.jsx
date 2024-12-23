import React, { useState } from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";
import DonationAction from "./DonationAction";

const NewDonation = () => {
  const [activeTab, setActiveTab] = useState("Math");

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
        </div>
        <div style={{ width: "30%" }}>
          <Details activeTab={activeTab} />
        </div>
      </div>
      <div style={{ width: "70%" }}>
        <DonationAction />
      </div>
    </div>
  );
};

export default NewDonation;
