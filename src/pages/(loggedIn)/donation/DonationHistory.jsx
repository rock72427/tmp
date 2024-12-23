import "./DonationHistory.scss";

const DonationHistory = () => {
  return (
    <div className="donation-container">
      <h2>Donation History</h2>

      <div className="table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Donation for</th>
              <th>Transaction Mode</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="empty-message">
                No donation history available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationHistory;
