import "./DonationAction.scss";

const DonationAction = ({ totalAmount = 0 }) => {
  return (
    <div className="donation-action-bar">
      <div className="donation-total-amount">
        <span>Total Donation Amount</span>
        <span>₹ {totalAmount.toFixed(2)}</span>
      </div>

      <div className="donation-actions">
        <button
          className="donation-action-btn consent-letter"
          style={{ border: "1px solid #ccc" }}
        >
          <i className="far fa-file-alt"></i>
          Consent Letter
        </button>

        <button
          className="donation-action-btn thank-letter"
          style={{ border: "1px solid #ccc" }}
        >
          <i className="far fa-envelope"></i>
          Thank Letter
        </button>

        <button
          className="donation-action-btn pending"
          style={{ border: "1px solid #ccc" }}
        >
          <i className="far fa-clock"></i>
          Pending
        </button>

        <button
          className="donation-action-btn print-receipt"
          style={{ border: "1px solid #ccc" }}
        >
          <i className="fas fa-print"></i>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default DonationAction;
