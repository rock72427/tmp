import React, { useState, useEffect } from "react";
import "./DonorDetails.scss";
import useDonationStore from "../../../../donationStore";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { fetchReceiptDetails } from "../../../../services/src/services/receiptDetailsService";

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
    updateUniqueNo,
  } = useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonorDetails =
    donorTabs[activeTabId][currentSection].donorDetails;

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [identityError, setIdentityError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [guestList, setGuestList] = useState([]);

  const isCompleted =
    donorTabs[activeTabId][currentSection].donationDetails.status ===
    "completed";

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

      // Filter suggestions based on input
      if (value.length > 0) {
        const filtered = guestList.filter((guest) =>
          guest.attributes.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
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

  const handleFetchGuests = async () => {
    try {
      const guests = await fetchGuestDetails();
      console.log("Guests:", guests);

      // Fetch and log receipt details
      const receipts = await fetchReceiptDetails();
      console.log("All Receipts:", receipts);

      setGuestList(guests.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSuggestionClick = (guest) => {
    console.log("Selected Guest Data:", guest);

    const {
      name,
      phone_number,
      email,
      deeksha,
      identity_proof,
      identity_number,
      address,
      donations,
    } = guest.attributes;

    // Check if there's a unique_no in the receipt details
    const uniqueNo =
      donations?.data[0]?.attributes?.receipt_detail?.data?.attributes
        ?.unique_no;

    // Extract address components
    const rawAddressParts = address.split(", ");
    const flatNo =
      rawAddressParts[0] && rawAddressParts[0].trim() !== ""
        ? rawAddressParts[0]
        : "";
    const streetName =
      rawAddressParts[1] && rawAddressParts[1].trim() !== ""
        ? rawAddressParts[1]
        : "";

    // Update donor details with guest ID
    updateAndSyncDonorDetails({
      guestId: guest.id,
      name: name.replace(/^(Sri|Smt|Mr|Mrs|Ms|Dr|Prof)\s+/, ""),
      phone: phone_number.replace("+91", ""),
      email,
      deeksha,
      identityType: identity_proof,
      identityNumber: identity_number,
      pincode: rawAddressParts[rawAddressParts.length - 1] || "",
      state: rawAddressParts[rawAddressParts.length - 2] || "",
      district: rawAddressParts[rawAddressParts.length - 3] || "",
      postOffice: rawAddressParts[rawAddressParts.length - 4] || "",
      flatNo,
      streetName,
    });

    // If unique_no exists, update it in the store
    if (uniqueNo) {
      // You'll need to add a new action in your store to update the uniqueNo
      updateUniqueNo(activeTabId, uniqueNo);
    }

    // Extract and set title if present
    const titleMatch = name.match(/^(Sri|Smt|Mr|Mrs|Ms|Dr|Prof)/);
    if (titleMatch) {
      updateAndSyncDonorDetails({ title: titleMatch[0] });
    }

    setShowSuggestions(false);
  };

  useEffect(() => {
    // Add event listener for refresh
    const handleRefresh = () => {
      handleFetchGuests();
    };
    window.addEventListener("refreshDonorDetails", handleRefresh);

    // Initial fetch
    handleFetchGuests();

    // Cleanup
    return () => {
      window.removeEventListener("refreshDonorDetails", handleRefresh);
    };
  }, []);

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
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
              >
                <option>Sri</option>
                <option>Smt</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
                <option>Dr</option>
                <option>Prof</option>
              </select>
              <div
                className="autocomplete-container"
                style={{ position: "relative", flex: 1 }}
              >
                <input
                  className="donor-input"
                  type="text"
                  value={currentDonorDetails.name}
                  onChange={handleNameChange}
                  pattern="[A-Za-z\s.]+"
                  title="Please enter only letters, spaces, and dots"
                  disabled={isCompleted}
                  style={{
                    backgroundColor: isCompleted ? "#f5f5f5" : "white",
                    opacity: isCompleted ? 0.7 : 1,
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className="suggestions-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {suggestions.map((guest) => (
                      <li
                        key={guest.id}
                        onClick={() => handleSuggestionClick(guest)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "white")
                        }
                      >
                        {guest.attributes.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              Initiation / Mantra Diksha from{" "}
              <span className="required">*</span>
            </label>
            <select
              className="donor-select"
              value={currentDonorDetails.deeksha}
              onChange={handleDeekshaChange}
              disabled={isCompleted}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
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
                value={currentDonorDetails.identityNumber}
                onChange={handleIdentityInputChange}
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
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
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
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
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonorDetails;
