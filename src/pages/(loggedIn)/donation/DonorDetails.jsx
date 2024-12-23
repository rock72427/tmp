import React from "react";
import "./DonorDetails.scss";

const DonorDetails = () => {
  return (
    <div className="donor-details">
      <div className="donor-details__header">
        <h2>Donor Details</h2>
        <span className="language-switch">CS</span>
      </div>

      <form className="donor-details__form">
        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Name of Donor <span className="required">*</span>
            </label>
            <div className="donor-details__name-input">
              <select className="donor-select">
                <option>Sri</option>
                {/* Add other title options */}
              </select>
              <input
                className="donor-input"
                type="text"
                placeholder="Enter donor name"
              />
            </div>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Phone No. <span className="required">*</span>
            </label>
            <input className="donor-input" type="tel" />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Initiation / Mantra Diksha from
            </label>
            <select className="donor-select">
              <option>Select Deeksha</option>
              {/* Add other options */}
            </select>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Guest House Room No.</label>
            <input className="donor-input" type="text" />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Email</label>
            <input
              className="donor-input"
              type="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Identity Proof <span className="required">*</span>
            </label>
            <div className="donor-details__identity-input">
              <select className="donor-select">
                <option>Aadhaar</option>
                {/* Add other ID types */}
              </select>
              <input
                className="donor-input"
                type="text"
                placeholder="Enter Aadhaar number"
              />
            </div>
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Pincode <span className="required">*</span>
            </label>
            <input className="donor-input" type="text" />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              State <span className="required">*</span>
            </label>
            <input className="donor-input" type="text" />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              District <span className="required">*</span>
            </label>
            <input className="donor-input" type="text" />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Flat / House / Apartment No</label>
            <input className="donor-input" type="text" />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Street Name / Landmark</label>
            <input className="donor-input" type="text" />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Post Office</label>
            <input className="donor-input" type="text" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonorDetails;
