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

  const {
    donorTabs,
    activeTabId,
    updateDonorDetails,
    copyDonorDetails,
    updateDonationDetails,
    fieldErrors,
    setFieldErrors,
  } = useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonorDetails =
    donorTabs[activeTabId][currentSection].donorDetails;

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [identityError, setIdentityError] = useState("");

  const updateAndSyncDonorDetails = (details) => {
    updateDonorDetails(activeTabId, currentSection, details);
    const otherSection = currentSection === "math" ? "mission" : "math";
    copyDonorDetails(activeTabId, currentSection, otherSection);
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors({
      ...fieldErrors,
      donor: {
        ...fieldErrors.donor,
        [fieldName]: undefined,
      },
    });
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    updateAndSyncDonorDetails({ pincode });
    clearFieldError("pincode");

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
    clearFieldError(name);
  };

  const handleTitleChange = (e) => {
    updateAndSyncDonorDetails({ title: e.target.value });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, spaces, and dots
    if (/^[A-Za-z\s.]*$/.test(value)) {
      updateAndSyncDonorDetails({ name: value });
    }
  };

  const handleDeekshaChange = (e) => {
    const value = e.target.value;
    updateAndSyncDonorDetails({ deeksha: value });
    clearFieldError("deeksha");
  };

  const handleOtherDeekshaChange = (e) => {
    updateAndSyncDonorDetails({ otherDeeksha: e.target.value });
  };

  const validateIdentityNumber = (type, value) => {
    switch (type) {
      case "Aadhaar":
        // 12 digits only
        if (!/^\d*$/.test(value))
          return "Aadhaar number should only contain digits";
        if (value.length > 0 && value.length < 12)
          return "Aadhaar number must be 12 digits";
        return "";

      case "PAN Card":
        // 10 characters, first 5 letters, next 4 numbers, last letter
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (value.length > 0 && !panRegex.test(value))
          return "Invalid PAN format (e.g., ABCDE1234F)";
        return "";

      case "Voter ID":
        // Typically 10 characters, alphanumeric
        const voterRegex = /^[A-Z]{3}[0-9]{7}$/;
        if (value.length > 0 && !voterRegex.test(value))
          return "Invalid Voter ID format (e.g., ABC1234567)";
        return "";

      case "Passport":
        // 8 characters, letter followed by 7 numbers
        const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
        if (value.length > 0 && !passportRegex.test(value))
          return "Invalid Passport format (e.g., A1234567)";
        return "";

      case "Driving License":
        // 15 characters, alphanumeric
        const dlRegex = /^[A-Z]{2}[0-9]{13}$/;
        if (value.length > 0 && !dlRegex.test(value))
          return "Invalid Driving License format (e.g., DL0420160000000)";
        return "";

      default:
        return "";
    }
  };

  const handleIdentityInputChange = (e) => {
    const value = e.target.value;
    updateAndSyncDonorDetails({ identityNumber: value });
    clearFieldError("identityNumber");
  };

  const handleIdentityTypeChange = (e) => {
    const newIdentityType = e.target.value;
    updateAndSyncDonorDetails({
      identityType: newIdentityType,
      identityNumber: "", // Reset the number when type changes
    });

    // If changing from PAN Card, clear PAN number from other sections
    if (currentDonorDetails.identityType === "PAN Card") {
      const otherSection = currentSection === "math" ? "mission" : "math";
      updateDonationDetails(activeTabId, otherSection, {
        panNumber: "",
      });
      updateDonationDetails(activeTabId, currentSection, {
        panNumber: "",
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      // Update the value even if less than 10 digits
      updateAndSyncDonorDetails({ phone: value });
      clearFieldError("phone");

      // Show error only if user has entered something and it's not 10 digits
      if (value.length > 0 && value.length !== 10) {
        setPhoneError("Phone number must be 10 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  return (
    <div
      className={`donor-details ${
        donorTabs[activeTabId].activeSection === "mission" ? "mission-bg" : ""
      }`}
    >
      <div className="donor-details__header">
        <h2>Donor Details</h2>
        <span className="language-switch">
          {donorTabs[activeTabId].uniqueNo}
        </span>
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
                pattern="[A-Za-z\s.]+"
                title="Please enter only letters, spaces, and dots"
              />
            </div>
            {fieldErrors.donor.name && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.name}
              </span>
            )}
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
              onChange={handlePhoneChange}
              maxLength={10}
            />
            {(phoneError || fieldErrors.donor?.phone) && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {phoneError || fieldErrors.donor.phone}
              </span>
            )}
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
            {fieldErrors.donor.deeksha && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.deeksha}
              </span>
            )}
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
            {emailError && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {emailError}
              </span>
            )}
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Identity Proof <span className="required">*</span>
            </label>
            <div className="donor-details__identity-input">
              <select
                className="identity-select"
                value={currentDonorDetails.identityType}
                onChange={handleIdentityTypeChange}
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
                value={currentDonorDetails.identityNumber}
                onChange={handleIdentityInputChange}
              />
            </div>
            {fieldErrors.donor.identityNumber && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.identityNumber}
              </span>
            )}
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
            {fieldErrors.donor.pincode && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.pincode}
              </span>
            )}
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
