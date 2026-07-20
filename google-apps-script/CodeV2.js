// ============================================================
// Campaign Website — Form Submission Handler v2
// Google Apps Script (paste into Extensions → Apps Script)
// ============================================================
//
// One deployment handles EVERY site form, routed by `formType` into
// separate tabs of the same spreadsheet:
//   signup           -> "Signups"
//   contact          -> "Contact"
//   supporter        -> "Supporters"
//   donate-etransfer -> "ETransferIntents"
//   ride-request     -> "RideRequests"
//
// SETUP (one per candidate):
// 1. Create (or reuse) a campaign-owned Google Sheet.
//    Tabs and header rows are created automatically on first submission.
// 2. Extensions → Apps Script, paste this entire file into Code.gs.
// 3. Set NOTIFICATION_EMAIL below to the campaign inbox.
// 4. Deploy → New deployment → Web app
//      Execute as: Me | Who has access: Anyone
// 5. Copy the Web App URL into the repo secret VITE_FORM_ENDPOINT
//    (and .env for local testing). The old v1 VITE_DONATE_ENDPOINT
//    secret is retired — all forms use this one endpoint.
//
// COMPATIBILITY: payloads without `formType` (from the previously
// deployed v1 site) are inferred, so this script can be deployed and
// pointed at BEFORE the new frontend ships.
//
// MONTHLY HEALTH CHECK (do this on the 1st of each month):
//   1. GET the endpoint URL in a browser → {"success":true,"status":"ok",...}
//   2. POST {"formType":"contact","dryRun":true,"fullName":"Health Check",
//      "email":"hc@example.com","message":"test","token":"hc-<date>"}
//      → {"success":true,"submissionId":"dry-run"} and NO row in the sheet.
//
// PRIVACY: only the formType and submissionId are ever logged.
// Field values are never written to Apps Script logs.
// ============================================================

var NOTIFICATION_EMAIL = "info@votesinan.com";

var CONFIG = {
  maxPayloadBytes: 8192,
  tokenCacheSeconds: 21600, // 6h duplicate-submission window
  tabs: {
    signup: "Signups",
    contact: "Contact",
    supporter: "Supporters",
    "donate-etransfer": "ETransferIntents",
    "ride-request": "RideRequests",
  },
};

// Per-form field schema: order defines sheet columns (after Timestamp +
// Submission ID). kind: "string" | "boolean" | "stringArray" | "number".
var SCHEMAS = {
  signup: {
    columns: ["First Name", "Last Name", "Email", "Phone", "Source"],
    fields: [
      { key: "firstName", label: "First Name", kind: "string", required: true, maxLen: 100 },
      { key: "lastName", label: "Last Name", kind: "string", required: true, maxLen: 100 },
      { key: "email", label: "Email", kind: "string", required: true, maxLen: 254 },
      { key: "phone", label: "Phone", kind: "string", maxLen: 30 },
      { key: "source", label: "Source", kind: "string", maxLen: 60 },
    ],
  },
  contact: {
    columns: [
      "Full Name",
      "Email",
      "Phone",
      "Postal Code",
      "Topic",
      "Message",
      "Preferred Response",
      "Source",
    ],
    fields: [
      { key: "fullName", label: "Full Name", kind: "string", required: true, maxLen: 100 },
      { key: "email", label: "Email", kind: "string", required: true, maxLen: 254 },
      { key: "phone", label: "Phone", kind: "string", maxLen: 30 },
      { key: "postalCode", label: "Postal Code", kind: "string", maxLen: 10 },
      {
        key: "topic",
        label: "Topic",
        kind: "string",
        required: true,
        maxLen: 30,
        enums: ["neighbourhood", "policy", "media", "volunteer", "event", "other"],
      },
      { key: "message", label: "Message", kind: "string", required: true, maxLen: 2000 },
      {
        key: "preferredResponse",
        label: "Preferred Response",
        kind: "string",
        maxLen: 10,
        enums: ["email", "phone"],
      },
      { key: "source", label: "Source", kind: "string", maxLen: 60 },
    ],
  },
  supporter: {
    columns: [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Postal Code",
      "Language",
      "Intents",
      "Volunteer Roles",
      "Volunteer Other",
      "Availability",
      "Accessibility Notes",
      "Sign Address",
      "Property Type",
      "Permission Confirmed",
      "Sign Timing",
      "Quantity",
      "Retrieval OK",
      "Pledged",
      "Reminder OK",
      "Email Consent",
      "Source",
    ],
    fields: [
      { key: "firstName", label: "First Name", kind: "string", required: true, maxLen: 100 },
      { key: "lastName", label: "Last Name", kind: "string", required: true, maxLen: 100 },
      { key: "email", label: "Email", kind: "string", required: true, maxLen: 254 },
      { key: "phone", label: "Phone", kind: "string", maxLen: 30 },
      { key: "postalCode", label: "Postal Code", kind: "string", maxLen: 10 },
      { key: "language", label: "Language", kind: "string", maxLen: 20 },
      { key: "intents", label: "Intents", kind: "stringArray", required: true, maxLen: 60 },
      { key: "volunteerRoles", label: "Volunteer Roles", kind: "stringArray", maxLen: 200 },
      { key: "volunteerOther", label: "Volunteer Other", kind: "string", maxLen: 200 },
      { key: "availability", label: "Availability", kind: "stringArray", maxLen: 100 },
      { key: "accessibilityNotes", label: "Accessibility Notes", kind: "string", maxLen: 500 },
      { key: "signAddress", label: "Sign Address", kind: "string", maxLen: 300 },
      { key: "propertyType", label: "Property Type", kind: "string", maxLen: 30 },
      { key: "permissionConfirmed", label: "Permission Confirmed", kind: "boolean" },
      { key: "signTiming", label: "Sign Timing", kind: "string", maxLen: 30 },
      { key: "quantity", label: "Quantity", kind: "number" },
      { key: "retrievalOk", label: "Retrieval OK", kind: "boolean" },
      { key: "pledged", label: "Pledged", kind: "boolean" },
      { key: "reminderOk", label: "Reminder OK", kind: "boolean" },
      { key: "emailConsent", label: "Email Consent", kind: "boolean" },
      { key: "source", label: "Source", kind: "string", maxLen: 60 },
    ],
  },
  "donate-etransfer": {
    columns: [
      "Full Name",
      "Email",
      "Phone",
      "Residential Address",
      "Eligibility Confirmed",
      "Own Funds Confirmed",
      "Not On Behalf Confirmed",
      "Source",
      "Amount",
    ],
    fields: [
      { key: "fullName", label: "Full Name", kind: "string", required: true, maxLen: 100 },
      { key: "email", label: "Email", kind: "string", required: true, maxLen: 254 },
      { key: "phone", label: "Phone", kind: "string", maxLen: 30 },
      { key: "address", label: "Residential Address", kind: "string", required: true, maxLen: 300 },
      {
        key: "eligibilityConfirmed",
        label: "Eligibility Confirmed",
        kind: "boolean",
        required: true,
      },
      {
        key: "ownFundsConfirmed",
        label: "Own Funds Confirmed",
        kind: "boolean",
        required: true,
      },
      {
        key: "notOnBehalfConfirmed",
        label: "Not On Behalf Confirmed",
        kind: "boolean",
        required: true,
      },
      { key: "source", label: "Source", kind: "string", maxLen: 60 },
      { key: "amount", label: "Amount", kind: "number", min: 1, max: 1200, decimals: 2 },
    ],
  },
  "ride-request": {
    columns: [
      "Full Name",
      "Email",
      "Phone",
      "Pickup Address",
      "Requested Voting Day",
      "Notes",
      "Source",
    ],
    fields: [
      { key: "fullName", label: "Full Name", kind: "string", required: true, maxLen: 100 },
      { key: "email", label: "Email", kind: "string", required: true, maxLen: 254 },
      { key: "phone", label: "Phone", kind: "string", required: true, maxLen: 30 },
      {
        key: "pickupAddress",
        label: "Pickup Address",
        kind: "string",
        required: true,
        maxLen: 300,
      },
      {
        key: "requestedDate",
        label: "Requested Voting Day",
        kind: "string",
        required: true,
        maxLen: 10,
        enums: [
          "2026-10-06",
          "2026-10-07",
          "2026-10-08",
          "2026-10-09",
          "2026-10-10",
          "2026-10-11",
          "2026-10-26",
        ],
      },
      { key: "notes", label: "Notes", kind: "string", maxLen: 500 },
      { key: "source", label: "Source", kind: "string", maxLen: 60 },
    ],
  },
};

// Prefix values starting with =, +, -, @ to prevent formula injection.
function safe(v) {
  return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function inferFormType(data) {
  if (typeof data.formType === "string") return data.formType;
  // v1 payload shapes (previously deployed frontend)
  if (data.firstName !== undefined && data.lastName !== undefined) return "signup";
  if (data.fullName !== undefined && data.address !== undefined) return "donate-etransfer";
  return null;
}

function coerce(field, value) {
  if (field.kind === "boolean") return value === true ? "Yes" : "No";
  if (field.kind === "number") {
    var n = Number(value);
    if (!isFinite(n)) return "";
    var min = typeof field.min === "number" ? field.min : 0;
    var max = typeof field.max === "number" ? field.max : 99;
    var decimals = typeof field.decimals === "number" ? field.decimals : 0;
    var factor = Math.pow(10, decimals);
    return Math.round(Math.max(min, Math.min(max, n)) * factor) / factor;
  }
  if (field.kind === "stringArray") {
    if (!Array.isArray(value)) return "";
    return value
      .filter(function (x) {
        return typeof x === "string";
      })
      .map(function (x) {
        return x.slice(0, 40);
      })
      .slice(0, 20)
      .join(", ")
      .slice(0, field.maxLen || 200);
  }
  if (typeof value !== "string") return "";
  // strip control characters, cap length
  var cleaned = "";
  for (var ci = 0; ci < value.length; ci++) {
    var code = value.charCodeAt(ci);
    if (code >= 32 && code !== 127) cleaned += value.charAt(ci);
  }
  return cleaned.trim().slice(0, field.maxLen || 200);
}

function validate(formType, data) {
  var schema = SCHEMAS[formType];
  var row = [];
  for (var i = 0; i < schema.fields.length; i++) {
    var f = schema.fields[i];
    var raw = data[f.key];
    var isEmpty =
      raw === undefined || raw === null || raw === "" || (Array.isArray(raw) && raw.length === 0);
    if (f.required && isEmpty) {
      return { error: "validation: missing " + f.key };
    }
    if (f.kind === "boolean" && f.required && raw !== true) {
      return { error: "validation: bad " + f.key };
    }
    if (f.kind === "number" && !isEmpty) {
      var numeric = Number(raw);
      var min = typeof f.min === "number" ? f.min : 0;
      var max = typeof f.max === "number" ? f.max : 99;
      var decimals = typeof f.decimals === "number" ? f.decimals : 0;
      var factor = Math.pow(10, decimals);
      if (
        !isFinite(numeric) ||
        numeric < min ||
        numeric > max ||
        Math.abs(Math.round(numeric * factor) / factor - numeric) > 0.0000001
      ) {
        return { error: "validation: bad " + f.key };
      }
    }
    var v = isEmpty ? "" : coerce(f, raw);
    if (f.enums && v !== "" && f.enums.indexOf(v) === -1) {
      return { error: "validation: bad " + f.key };
    }
    row.push(safe(v));
  }
  return { row: row };
}

function getTab(ss, formType) {
  var name = CONFIG.tabs[formType];
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var header = ["Timestamp", "Submission ID"].concat(SCHEMAS[formType].columns, ["Token"]);
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  } else if (formType === "donate-etransfer") {
    // One-time v2 migration: preserve existing rows by inserting Amount
    // immediately before the trailing Token column.
    var lastColumn = sheet.getLastColumn();
    var headers = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
    if (headers.indexOf("Amount") === -1) {
      var tokenIndex = headers.indexOf("Token");
      var insertAt = tokenIndex >= 0 ? tokenIndex + 1 : lastColumn + 1;
      sheet.insertColumnBefore(insertAt);
      sheet.getRange(1, insertAt).setValue("Amount");
    }
  }
  return sheet;
}

function notify(formType, submissionId, timestamp) {
  try {
    var subjects = {
      signup: "New campaign signup",
      contact: "New contact message",
      supporter: "New supporter action",
      "donate-etransfer": "New e-transfer donation intent",
      "ride-request": "New election-day ride request",
    };
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subjects[formType] + " — " + submissionId,
      body:
        "A new submission arrived on the campaign website.\n\n" +
        "Type: " +
        formType +
        "\nReference: " +
        submissionId +
        "\nTime: " +
        timestamp +
        "\n\nOpen the campaign spreadsheet (tab: " +
        CONFIG.tabs[formType] +
        ") for details.",
    });
  } catch (mailErr) {
    // Email failure must never fail a submission that was already written.
    console.log("notify-failed " + formType + " " + submissionId);
  }
}

function doPost(e) {
  try {
    if (!e.postData || e.postData.contents.length > CONFIG.maxPayloadBytes) {
      return json({ success: false, error: "payload-too-large" });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json({ success: false, error: "bad-json" });
    }

    // Honeypot: silently accept without writing (don't tip off bots).
    if (typeof data.website === "string" && data.website !== "") {
      return json({ success: true, submissionId: "ok" });
    }

    var formType = inferFormType(data);
    if (!formType || !SCHEMAS[formType]) {
      return json({ success: false, error: "unknown-form-type" });
    }

    var result = validate(formType, data);
    if (result.error) {
      return json({ success: false, error: result.error });
    }

    // Health-check dry run: full validation, no write, no email.
    if (data.dryRun === true) {
      return json({ success: true, submissionId: "dry-run" });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var cache = CacheService.getScriptCache();
      var token = typeof data.token === "string" ? data.token.slice(0, 64) : "";
      if (token) {
        var seen = cache.get("tok:" + token);
        if (seen) {
          // Idempotent retry — return the original submissionId, write nothing.
          return json({ success: true, submissionId: seen });
        }
      }

      var submissionId =
        formType.charAt(0).toUpperCase() +
        "-" +
        Date.now().toString(36) +
        "-" +
        Utilities.getUuid().slice(0, 4);
      var timestamp = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" });

      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = getTab(ss, formType);
      sheet.appendRow([timestamp, submissionId].concat(result.row, [safe(token)]));

      if (token) {
        cache.put("tok:" + token, submissionId, CONFIG.tokenCacheSeconds);
      }

      console.log(formType + " " + submissionId); // never log field values
      notify(formType, submissionId, timestamp);

      return json({ success: true, submissionId: submissionId });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.log("doPost-failed");
    return json({ success: false, error: "server" });
  }
}

// Liveness / health check.
function doGet(e) {
  return json({ success: true, status: "ok", version: 2, time: new Date().toISOString() });
}
