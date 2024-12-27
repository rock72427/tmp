import React from "react";

const ReceiptPreviewModal = ({
  isOpen,
  onClose,
  receiptData,
  onConfirmPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "900px",
          height: "60vh",
          paddingTop: "30px",
          paddingLeft: "30px",
          paddingRight: "30px",
          paddingBottom: "0px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 400 }}>
            Receipt Preview
          </h2>
          <button
            style={{
              border: "none",
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div style={{ margin: "0 auto", width: "80%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span>
              Receipt No:{" "}
              <span style={{ fontWeight: 500 }}>
                {receiptData.receiptNumber}
              </span>
            </span>
            <span>Date: {receiptData.date}</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#696969" }}>
                Received With Thanks From
              </span>
              <span style={{ fontWeight: 500, color: "#666" }}>
                {receiptData.donorName}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  margin: "5px 0 0 228px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                {receiptData.address?.flatNo}
              </p>
              <p
                style={{
                  margin: "5px 0 0 228px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                PO: {receiptData.address?.postOffice}, Dist:{" "}
                {receiptData.address?.district}
              </p>
              <p
                style={{
                  margin: "5px 0 0 228px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                State: {receiptData.address?.state}, Pin:{" "}
                {receiptData.address?.pincode}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: "#696969",
                }}
              >
                By Transaction Type:
              </span>
              <span style={{ color: "#666", fontWeight: 500 }}>
                {receiptData.transactionType}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#696969" }}>
                The Sum of Rupees:
              </span>
              <span style={{ color: "#666", fontWeight: 500 }}>
                {receiptData.amount}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#696969" }}>
                As Donation for:
              </span>
              <span style={{ color: "#666", fontWeight: 500 }}>
                {receiptData.purpose}
              </span>
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "500",
                textAlign: "left",
                marginTop: "20px",
              }}
            >
              <span>₹ {receiptData.amount}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#f4811e",
                color: "white",
                cursor: "pointer",
              }}
              onClick={onConfirmPrint}
            >
              Confirm Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;
