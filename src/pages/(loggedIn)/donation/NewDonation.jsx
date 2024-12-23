import React from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";

const NewDonation = () => {
  return (
    <div>
      <DonationHeader />
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ width: "75%" }}>
          <DonorDetails />
        </div>
        <div style={{ width: "30%" }}>
          <Details />
        </div>
      </div>
    </div>
  );
};

export default NewDonation;
