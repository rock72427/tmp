import React from "react";

const ReceiptTemplate = ({
  uniqueDonorId,
  receiptNumber,
  formattedDate,
  donorDetails,
  currentReceipt,
  numberToWords,
  user,
}) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Ramakrishna Math Letterhead</title>
            <style>
              body {
                margin: 0
                background-color: #fff;
                font-family: Arial, sans-serif;
                height: 100%;
                border: 1px solid transparent;
              }

              .letterhead {
                width: 77%;
                height: 100%;
                margin-top: 5.3%;
                margin-left: 7%;
                border: 1px solid transparent;
              }

              .header {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 40px;
              }

              .logo {
                width: 100px;
                height: auto;
              }

              .title-section {
                flex: 1;
              }

              h1 {
                margin: 0;
                color: #4b3968;
                font-size: 28px;
                text-align: center;
              }

              .subtitle {
                margin: 5px 0;
                font-size: 16px;
                text-align: center;
                color: #4b3968;
              }

              .address {
                margin: 5px 0;
                font-size: 16px;
                text-align: center;
                color: #4b3968;
              }

              .contact {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                color: #4b3968;
              }

              .signature-section {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                margin-bottom: 20px;
                position: relative;
              }

              .received {
                margin: 0 0 5px 0;
                color: #4b3968;
                font-size: 16px;
              }

              .adhyaksha {
                position: absolute;
                right: 0;
                margin: 0;
                padding-top: 5px;
                min-width: 150px;
                text-align: center;
                color: #4b3968;
                font-size: 16px;
              }

              .donation-text {
                font-size: 16px;
                color: #4b3968;
                line-height: 1.6;
                margin: 20px 0 0 0;
                padding: 5px 0 0 0;
                font-weight: 600;
                letter-spacing: 0.2px;
                border-top: 1px solid #4b3968;
              }

              .receipt-details {
                margin: 70px 0px;
                line-height: 2;
                font-size: 18px;
              }

              .receipt-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 18px;
              }

              .donor-details p {
                margin: 0;
                font-size: 18px;
                line-height: 1.5;
              }

              .donor-details p:not(:first-child) {
                margin-left: 40px;
              }

              .payment-details p {
                margin: 0;
                font-size: 18px;
              }

              .amount {
                font-size: 20px;
                font-weight: bold;
              }

              b {
                font-size: 20px;
              }
              .stamp-container {
                position: relative;
                width: 100%;
                margin-bottom: -35px;
              }

              .it-stamp {
                position: absolute;
                right: -80px;
                top: -115px;
                transform: translateY(-50%);
                border: 2px solid #000;
                padding: 2px;
                font-size: 14px;
                font-weight: 600;
                line-height: 1.2;
                max-width: 400px;
                text-align: center;
                background-color: transparent;
              }
            .footer {
                width: 39%;
                float: right;
                right: 0;
                padding-top: 8px;
            }
            .footer p {
                text-align: left;
            }
            </style>
          </head>
          <body>
            <div class="letterhead">
              <div class="receipt-details">
                <div class="receipt-row">
                  <span>Receipt <b>No: ${uniqueDonorId} / ${receiptNumber}</b></span>
                  <span class="date">Date: <b>${new Date(formattedDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, "-")}</b></span>
                </div>
                <div class="donor-details">
                  <p style="margin: 0;">
                    Received with thanks from
                    <b>${donorDetails.title} ${donorDetails.name}</b>
                  </p>
                  <div style="margin-left: 215px; font-weight: bold;">
                    <p style="margin: 0;">
                      ${donorDetails.houseNumber || ""}${
    donorDetails.streetName ? `, ${donorDetails.streetName}` : ""
  }
                    </p>
                    <p style="margin: 0;">
                      ${
                        donorDetails.postOffice
                          ? `PO: ${donorDetails.postOffice}, `
                          : ""
                      }${
    donorDetails.district ? `Dist: ${donorDetails.district}` : ""
  }
                    </p>
                    <p style="margin: 0;">
                      ${
                        donorDetails.state
                          ? `State: ${donorDetails.state}, `
                          : ""
                      }${
    donorDetails.pincode ? `Pin: ${donorDetails.pincode}` : ""
  }
                    ${
                      donorDetails.identityNumber
                        ? `
                    <p style="margin: 0;">
                      ${
                        donorDetails.identityType === "PAN"
                          ? `PAN: ${donorDetails.identityNumber}`
                          : `Aadhaar: ${donorDetails.identityNumber}`
                      }
                      </p>
                  `
                        : ""
                    }
                  </div>
                </div>
<div class="payment-details">
  <p style="margin: 10px 0 0 0">
    The sum of Rupees
    <b
      >${numberToWords(
        parseFloat(currentReceipt?.donationDetails?.amount || 0)
      )} Only</b
    >
  </p>

  <div style="display: flex; align-items: center; flex-wrap: wrap;">
    <p style="margin: 0;">
      By ${currentReceipt?.donationDetails?.transactionType || "Cash"}
      ${
        currentReceipt?.donationDetails?.transactionDetails?.transactionId
          ? `No. ${currentReceipt?.donationDetails?.transactionDetails?.transactionId}`
          : ""
      }
      ${
        currentReceipt?.donationDetails?.transactionDetails?.ddDate
          ? ` Dt. ${new Date(
              currentReceipt?.donationDetails?.transactionDetails?.ddDate
            )
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .split("/")
              .join("-")}`
          : ""
      }
    </p>
    ${
      currentReceipt?.donationDetails?.transactionType?.toLowerCase() !== "cash"
        ? `
    <p style="margin: 0; width: 100%;">
      On ${
        currentReceipt?.donationDetails?.transactionDetails?.bankName || ""
      }${
            currentReceipt?.donationDetails?.transactionDetails?.branchName
              ? `, ${currentReceipt?.donationDetails?.transactionDetails?.branchName}`
              : ""
          }
    </p>
    `
        : ""
    }
  </div>

  <p>
    As Donation for ${currentReceipt?.donationDetails?.donationType} for ${
    currentReceipt?.donationDetails?.purpose === "Other"
      ? currentReceipt?.donationDetails?.otherPurpose
      : currentReceipt?.donationDetails?.purpose
  }${
    currentReceipt?.donationDetails?.inMemoryOf
      ? ` in memory of ${currentReceipt?.donationDetails?.inMemoryOf}`
      : ""
  }
  </p>
  <p class="amount">
    <b
      >Rs. ${parseFloat(
        currentReceipt?.donationDetails?.amount || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</b
    >
  </p>
   ${
     ["Bank Transfer", "Cheque", "DD", "Electronic Modes"].includes(
       currentReceipt?.donationDetails?.transactionType
     )
       ? `<div class="stamp-container">
                <div class="it-stamp">
                  Donations are exempt under Clause (i) of first proviso to<br>
                  sub-section (5) of Section 80G of Income Tax Act 1961,<br>
                  vide Provisional Approval No. AAATR3497PF2021A<br>
                  dated 28-05-2021 valid from AY 2022-23 to AY 2026-27
                </div>
              </div>`
       : ""
   }
</div>

              </div>
              <div class="footer">
                <p>${user?.username}</p>
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
  `;
};

export default ReceiptTemplate;
