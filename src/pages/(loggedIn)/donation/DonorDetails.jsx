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

    // Special handling for phone number
    if (name === "phone") {
      // Only allow numbers and limit to 10 digits
      if (/^\d*$/.test(value) && value.length <= 10) {
        updateAndSyncDonorDetails({ [name]: value });

        // Show error if number is less than 10 digits and not empty
        if (value.length > 0 && value.length < 10) {
          setPhoneError("Phone number must be 10 digits");
        } else {
          setPhoneError("");
        }
      }
      return;
    }

    // Special handling for email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      updateAndSyncDonorDetails({ [name]: value });

      // Only show error if there's a value and it's invalid
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
      return;
    }

    // Handle other inputs normally
    updateAndSyncDonorDetails({ [name]: value });
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
    updateAndSyncDonorDetails({
      deeksha: value,
      otherDeeksha: value !== "Others" ? "" : currentDonorDetails.otherDeeksha,
    });
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
    const identityType = currentDonorDetails.identityType;

    // Convert to uppercase for PAN, Voter ID, Passport
    const formattedValue = [
      "PAN Card",
      "Voter ID",
      "Passport",
      "Driving License",
    ].includes(identityType)
      ? value.toUpperCase()
      : value;

    // Validate based on identity type
    let isValid = true;

    switch (identityType) {
      case "Aadhaar":
        isValid = /^\d*$/.test(formattedValue) && formattedValue.length <= 12;
        break;
      case "PAN Card":
        isValid =
          /^[A-Z0-9]*$/.test(formattedValue) && formattedValue.length <= 10;
        break;
      case "Voter ID":
        isValid =
          /^[A-Z0-9]*$/.test(formattedValue) && formattedValue.length <= 10;
        break;
      case "Passport":
        isValid =
          /^[A-Z0-9]*$/.test(formattedValue) && formattedValue.length <= 8;
        break;
      case "Driving License":
        isValid =
          /^[A-Z0-9]*$/.test(formattedValue) && formattedValue.length <= 15;
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      updateAndSyncDonorDetails({
        identityNumber: formattedValue,
      });

      // Set error message based on validation
      setIdentityError(validateIdentityNumber(identityType, formattedValue));

      // Update PAN number in donation details if identity type is PAN Card
      if (identityType === "PAN Card") {
        updateDonationDetails(activeTabId, currentSection, {
          panNumber: formattedValue,
        });
        const otherSection = currentSection === "math" ? "mission" : "math";
        updateDonationDetails(activeTabId, otherSection, {
          panNumber: formattedValue,
        });
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
              pattern="[0-9]{10}"
              maxLength={10}
              title="Please enter a valid 10-digit phone number"
            />
            {phoneError && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {phoneError}
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
            {currentDonorDetails.deeksha === "Others" && (
              <input
                className="donor-input"
                type="text"
                placeholder="Specify Mantra Diksha"
                value={currentDonorDetails.otherDeeksha || ""}
                onChange={handleOtherDeekshaChange}
                style={{ marginTop: "10px" }}
              />
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
                onChange={(e) => {
                  const newIdentityType = e.target.value;
                  updateAndSyncDonorDetails({
                    identityType: newIdentityType,
                    identityNumber: "",
                  });
                  setIdentityError("");

                  if (currentDonorDetails.identityType === "PAN Card") {
                    updateDonationDetails(activeTabId, "math", {
                      panNumber: "",
                    });
                    updateDonationDetails(activeTabId, "mission", {
                      panNumber: "",
                    });
                  }
                }}
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
                placeholder={`Enter ${currentDonorDetails.identityType} number`}
                value={currentDonorDetails.identityNumber}
                onChange={handleIdentityInputChange}
                maxLength={
                  currentDonorDetails.identityType === "Aadhaar"
                    ? 12
                    : currentDonorDetails.identityType === "PAN Card"
                    ? 10
                    : currentDonorDetails.identityType === "Voter ID"
                    ? 10
                    : currentDonorDetails.identityType === "Passport"
                    ? 8
                    : currentDonorDetails.identityType === "Driving License"
                    ? 15
                    : undefined
                }
              />
            </div>
            {identityError && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {identityError}
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
