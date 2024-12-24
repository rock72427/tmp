import React, { useState } from "react";
import "./DonorDetails.scss";
import useDonationStore from "../../../../donationStore";

const DonorDetails = ({ activeTab }) => {
  const deekshaOptions = [
    "Srimat Swami Atmasthanandaji Maharaj",
    "Srimat Swami Bhuteshanandaji Maharaj",
    "Srimat Swami Divyanandaji Maharaj",
    "Srimat Swami Gahananandaji Maharaj",
    "Srimat Swami Gambhiranandaji Maharaj",
    "Srimat Swami Gautamanandaji Maharaj",
    "Srimat Swami Girishanandaji Maharaj",
    "Srimat Swami Gitanandaji Maharaj",
    "Srimat Swami Kailashanandaji Maharaj",
    "Srimat Swami Madhavanandaji Maharaj",
    "Srimat Swami Nirvananandaji Maharaj",
    "Srimat Swami Omkaranandaji Maharaj",
    "Srimat Swami Prabhanandaji Maharaj",
    "Srimat Swami Prameyanandaji Maharaj",
    "Srimat Swami Ranganathanandaji Maharaj",
    "Srimat Swami Shivamayanandaji Maharaj",
    "Srimat Swami Smarananandaji Maharaj",
    "Srimat Swami Suhitanandaji Maharaj",
    "Srimat Swami Tapasyanandaji Maharaj",
    "Srimat Swami Vagishanandaji Maharaj",
    "Srimat Swami Vimalatmanandaji Maharaj",
    "Srimat Swami Vireshwaranandaji Maharaj",
    "Srimat Swami Yatiswaranandaji Maharaj",
    "Others",
    "none",
  ];

  const { donorTabs, activeTabId, updateDonorDetails, copyDonorDetails } =
    useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonorDetails =
    donorTabs[activeTabId][currentSection].donorDetails;

  const [loading, setLoading] = useState(false);

  const updateAndSyncDonorDetails = (details) => {
    updateDonorDetails(activeTabId, currentSection, details);
    const otherSection = currentSection === "math" ? "mission" : "math";
    copyDonorDetails(activeTabId, currentSection, otherSection);
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    updateAndSyncDonorDetails({ pincode });

    if (pincode.length === 6) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const [data] = await response.json();

        if (data.Status === "Success") {
          const postOfficeData = data.PostOffice[0];
          updateAndSyncDonorDetails({
            state: postOfficeData.State,
            district: postOfficeData.District,
            postOffice: postOfficeData.Name,
          });
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAndSyncDonorDetails({ [name]: value });
  };

  const handleTitleChange = (e) => {
    updateAndSyncDonorDetails({ title: e.target.value });
  };

  const handleNameChange = (e) => {
    updateAndSyncDonorDetails({ name: e.target.value });
  };

  const handleDeekshaChange = (e) => {
    updateAndSyncDonorDetails({ deeksha: e.target.value });
  };

  return (
    <div
      className={`donor-details ${activeTab === "Mission" ? "mission-bg" : ""}`}
    >
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
              <select
                className="donor-select"
                value={currentDonorDetails.title}
                onChange={handleTitleChange}
              >
                <option>Sri</option>
                <option>Smt</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
                <option>Prof</option>
              </select>
              <input
                className="donor-input"
                type="text"
                value={currentDonorDetails.name}
                onChange={handleNameChange}
              />
            </div>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Phone No. <span className="required">*</span>
            </label>
            <input
              className="donor-input"
              type="tel"
              name="phone"
              value={currentDonorDetails.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Initiation / Mantra Diksha from
            </label>
            <select
              className="donor-select"
              value={currentDonorDetails.deeksha}
              onChange={handleDeekshaChange}
            >
              <option value="">Select Deeksha</option>
              {deekshaOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Guest House Room No.</label>
            <input
              className="donor-input"
              type="text"
              name="roomNo"
              value={currentDonorDetails.roomNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Email</label>
            <input
              className="donor-input"
              type="email"
              name="email"
              value={currentDonorDetails.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Identity Proof <span className="required">*</span>
            </label>
            <div className="donor-details__identity-input">
              <select
                className="identity-select"
                value={currentDonorDetails.identityType}
                onChange={(e) =>
                  updateAndSyncDonorDetails({
                    identityType: e.target.value,
                  })
                }
              >
                <option>Aadhaar</option>
                <option>PAN Card</option>
                <option>Voter ID</option>
                <option>Passport</option>
                <option>Driving License</option>
              </select>
              <input
                className="identity-input"
                type="text"
                placeholder="Enter Aadhaar number"
                value={currentDonorDetails.identityNumber}
                onChange={(e) =>
                  updateAndSyncDonorDetails({
                    identityNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Pincode <span className="required">*</span>
            </label>
            <div className="pincode-input-wrapper">
              <input
                className="donor-input"
                type="text"
                value={currentDonorDetails.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
              />
              {loading && <span className="loading-spinner">🔄</span>}
            </div>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              State <span className="required">*</span>
            </label>
            <input
              className="donor-input"
              type="text"
              name="state"
              value={currentDonorDetails.state}
              onChange={handleInputChange}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              District <span className="required">*</span>
            </label>
            <input
              className="donor-input"
              type="text"
              name="district"
              value={currentDonorDetails.district}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Flat / House / Apartment No</label>
            <input
              className="donor-input"
              type="text"
              name="flatNo"
              value={currentDonorDetails.flatNo}
              onChange={handleInputChange}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Street Name / Landmark</label>
            <input
              className="donor-input"
              type="text"
              name="streetName"
              value={currentDonorDetails.streetName}
              onChange={handleInputChange}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Post Office</label>
            <input
              className="donor-input"
              type="text"
              name="postOffice"
              value={currentDonorDetails.postOffice}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonorDetails;
