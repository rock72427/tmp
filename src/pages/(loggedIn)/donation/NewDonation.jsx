import React, { useState } from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";

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
        <div style={{ width: "75%" }}>
          <DonorDetails activeTab={activeTab} />
        </div>
        <div style={{ width: "30%" }}>
          <Details activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default NewDonation;
