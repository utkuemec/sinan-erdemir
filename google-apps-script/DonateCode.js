/**
 * RETIRED: the website now sends every form to the shared CodeV2.js deployment
 * through VITE_FORM_ENDPOINT. Keep this file for reference only; do not deploy it.
 *
 * Google Apps Script — Campaign E-Transfer Donation Logging
 *
 * Deployment steps (one per candidate — each campaign gets its own Sheet):
 * 1. Create a Google Sheet with Row 1 headers:
 *    Timestamp | Full Name | Email | Phone | Residential Address | Source
 * 2. Open Extensions → Apps Script and paste this file into Code.gs.
 * 3. Set NOTIFICATION_EMAIL below to the campaign's inbox.
 * 4. Deploy → New deployment → Web app →
 *    Execute as: Me, Who has access: Anyone.
 * 5. Copy the Web App URL.
 * 6. Add it as VITE_DONATE_ENDPOINT in GitHub repo secrets and .env.
 */

var NOTIFICATION_EMAIL = "REPLACE_ME@example.com";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var timestamp = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" });

    var safe = function (v) {
      return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
    };

    sheet.appendRow([
      timestamp,
      safe(data.fullName || ""),
      safe(data.email || ""),
      safe(data.phone || ""),
      safe(data.address || ""),
      safe(data.source || "donate-etransfer"),
    ]);

    var subject = "New E-Transfer Donation Intent — " + (data.fullName || "");
    var body = [
      "Someone indicated they will send an e-transfer donation via the campaign website",
      "",
      "Name: " + (data.fullName || ""),
      "Email: " + (data.email || ""),
      "Phone: " + (data.phone || "N/A"),
      "Address: " + (data.address || "N/A"),
      "Source: " + (data.source || "donate-etransfer"),
      "Time: " + timestamp,
    ].join("\n");

    MailApp.sendEmail({ to: NOTIFICATION_EMAIL, subject: subject, body: body });

    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Campaign donation endpoint is live." }),
  ).setMimeType(ContentService.MimeType.JSON);
}
