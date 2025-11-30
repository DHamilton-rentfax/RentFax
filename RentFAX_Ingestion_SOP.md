# 📘 RentFAX – Renter Ingestion SOP

---

## 🎯 Purpose

To standardize how team members upload new renter data into RentFAX, ensuring **accuracy, compliance, and auditability**.

---

## 📂 File Preparation (CSV)

1. Open Google Sheets or Excel.

2. Create a **CSV file** with the following **required headers** (case sensitive):

   * `firstName`
   * `lastName`
   * `email`
   * `phone`
   * `licenseNumber`
   * `address`

   ✅ Example:

   ```csv
   firstName,lastName,email,phone,licenseNumber,address
   John,Doe,john.doe@gmail.com,5551234567,D1234567,123 Main St
   Maria,Smith,maria.smith@gmail.com,5559876543,S7654321,45 Oak Ave
   ```

3. Save/export as **CSV (UTF-8)** format.

4. Confirm the file does not contain extra headers or merged cells.

---

## 💻 Uploading into RentFAX

1. Log in as an **Admin** at [https://app.rentfax.ai/dashboard/renters](https://app.rentfax.ai/dashboard/renters).

2. Click **Bulk Upload** (takes you to `/admin/upload`).

3. **Drag & drop** your CSV file into the uploader.

4. Preview will appear:

   * Each row shows **name, email, risk score (pending)**.
   * Errors (e.g., missing email) will be highlighted red.

5. Click **Validate Data**.

   * System checks for duplicate license numbers, emails, or SSN hashes.
   * Warnings will be shown for potential fraud risks.

6. If all rows are correct → click **Confirm Import**.

   * Renters are batch-created in Firestore under `/orgs/{orgId}/renters/{renterId}`.
   * Each record is tagged with:

     * `uploadedBy: {uid}`
     * `uploadBatchId: {auto-generated}`

---

## 🔄 Undo / Rollback

* Go to **Audit Log** (`/dashboard/audit`).
* Find the latest event → `BulkUpload:{batchId}`.
* Click **Undo Upload** → this deletes all renters from that batch in Firestore.

---

## 🔐 Compliance Notes

* All sensitive data (license numbers, emails) is encrypted at rest with `PII_ENCRYPTION_KEY`.
* Every ingestion action is written into **tamper-proof audit logs**.
* CSV files should be deleted from local machines once uploaded.

---

## ✅ Checklist for Staff

Before finalizing an upload, ensure:

* [ ] File headers match template (no typos).
* [ ] Data validated (no duplicates flagged).
* [ ] Correct org selected (uploads are tied to your company).
* [ ] Audit log shows `BulkUpload:{batchId}` after import.
* [ ] CSV removed from your desktop/downloads folder.

---

## 🚨 Common Mistakes to Avoid

* ❌ Using Excel “Save As” → sometimes produces `.xls` not `.csv`.
* ❌ Missing headers → system will reject upload.
* ❌ Special characters (e.g., smart quotes, tabs) → always use UTF-8 export.
* ❌ Forgetting to validate before confirming → double-check preview!

---

This SOP can live in **Dropbox + Notion** alongside the onboarding doc.
