// ============================================================
// Campaign Website — Form Submission Handler
// Google Apps Script (paste into Extensions → Apps Script)
// ============================================================
//
// SETUP (one per candidate — each campaign gets its own Sheet):
// 1. Create a Google Sheet with these column headers in Row 1:
//    Timestamp | First Name | Last Name | Email | Phone | Source
//
// 2. Open Extensions → Apps Script
// 3. Paste this entire file into Code.gs (replace any default code)
// 4. Set NOTIFICATION_EMAIL below to the campaign's inbox
// 5. Click Deploy → New deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the Web App URL and add it as the VITE_FORM_ENDPOINT
//    repo secret (and in .env for local testing)
//
// ============================================================

const NOTIFICATION_EMAIL = "REPLACE_ME@example.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const timestamp = new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
    });

    // Prefix values starting with =, +, -, @ to prevent formula injection
    var safe = function (v) {
      return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
    };

    // Append row to sheet
    sheet.appendRow([
      timestamp,
      safe(data.firstName || ""),
      safe(data.lastName || ""),
      safe(data.email || ""),
      safe(data.phone || ""),
      safe(data.source || "unknown"),
    ]);

    // Send email notification
    const subject = "New Campaign Signup — " + (data.firstName || "") + " " + (data.lastName || "");
    const body = [
      "New form submission on the campaign website",
      "",
      "Name: " + (data.firstName || "") + " " + (data.lastName || ""),
      "Email: " + (data.email || ""),
      "Phone: " + (data.phone || "N/A"),
      "Source: " + (data.source || "unknown"),
      "Time: " + timestamp,
    ].join("\n");

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });

    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight (browser sends OPTIONS before POST)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Campaign form endpoint is live." }),
  ).setMimeType(ContentService.MimeType.JSON);
}
