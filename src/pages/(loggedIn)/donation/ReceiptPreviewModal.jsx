import React from "react";
import "./ReceiptPreviewModal.scss";

const ReceiptPreviewModal = ({
  isOpen,
  onClose,
  receiptData,
  onConfirmPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="receipt-preview-modal">
      <div className="receipt-preview-content">
        <div className="receipt-preview-header">
          <h2>Receipt Preview</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="receipt-preview-body">
          <div className="receipt-header">
            <div>Receipt No: {receiptData.receiptNumber}</div>
            <div>Date: {receiptData.date}</div>
          </div>

          <div className="receipt-details">
            <p>Received With Thanks From: {receiptData.donorName}</p>
            <p>{receiptData.address?.flatNo}</p>
            <p>
              PO: {receiptData.address?.postOffice}, Dist:{" "}
              {receiptData.address?.district}
            </p>
            <p>
              State: {receiptData.address?.state}, Pin:{" "}
              {receiptData.address?.pincode}
            </p>

            <p>By Transaction Type: {receiptData.transactionType}</p>
            <p>The Sum of Rupees: {receiptData.amount}</p>
            <p>As Donation for: {receiptData.purpose}</p>
            <p>₹ {receiptData.amount}</p>
          </div>

          <div className="receipt-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="confirm-print-button" onClick={onConfirmPrint}>
              Confirm Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;
