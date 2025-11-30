# Master Deployment Checklist

This checklist provides a comprehensive guide for launching RentFAX, covering environment variables, Firebase setup, CRON jobs, secrets management, and configurations for both staging and production environments.

---

## 1. Environment Variables (.env.local)

Ensure these variables are set in your deployment environment. Use a secrets management service for sensitive keys.

```env
# App URLs
NEXT_PUBLIC_APP_URL=https://app.rentfax.ai
NEXT_PUBLIC_APP_URL_STAGING=https://staging.rentfax.ai

# Firebase projects
FIREBASE_PROJECT_ID=rentfax-prod
FIREBASE_PROJECT_ID_STAGING=rentfax-staging

# API Keys & Secrets
RENTFAX_API_KEY=your_super_secret_api_key
ENCRYPTION_KEY=a_strong_32_byte_encryption_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
POSTMARK_API_KEY=your_postmark_api_key
CRM_API_KEY=your_crm_api_key

# Service Account (for Firebase Admin SDK)
# Store the contents of your Firebase service account JSON file in this variable
GOOGLE_APPLICATION_CREDENTIALS=your_google_service_account_json_content
```

---

## 2. Firebase Setup

### Firestore Rules (firestore.rules)

Deploy these rules to both your staging and production Firestore databases.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Org-level data is private
    match /orgs/{orgId} {
      allow read, write: if request.auth.uid != null && request.auth.token.orgId == orgId;

      // Renters are readable by org members
      match /renters/{renterId} {
        allow read: if request.auth.uid != null && request.auth.token.orgId == orgId;
        allow write: if request.auth.uid != null && request.auth.token.orgId == orgId;
      }

      // Tamper-proof audit logs
      match /logs/{logId} {
        allow read: if request.auth.uid != null && request.auth.token.orgId == orgId;
        allow create: if request.auth.uid != null;
        allow update, delete: if false; // Immutable
      }
    }

    // Renter-specific data (for portal access)
    match /renters/{renterId} {
        allow read: if request.auth.uid == renterId;
        // Allow renters to update their own dispute info
        allow update: if request.auth.uid == renterId && request.resource.data.keys().hasOnly(['dispute']);
    }
  }
}
```

### Firebase Storage Rules (storage.rules)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /orgs/{orgId}/disputes/{disputeId}/{fileName} {
        allow read, write: if request.auth != null && request.auth.token.orgId == orgId;
    }
    match /renters/{renterId}/documents/{fileName} {
        allow read, write: if request.auth != null && request.auth.uid == renterId;
    }
  }
}
```

---

## 3. CRON Jobs

Set up these jobs using a service like Google Cloud Scheduler or a simple CRON daemon.

*   **Daily Backups:**
    *   **Command:** `gcloud firestore export gs://{YOUR_BACKUP_BUCKET} --project={YOUR_FIREBASE_PROJECT_ID}`
    *   **Schedule:** Every 24 hours (e.g., `0 2 * * *`)

*   **Weekly Digest Emails:**
    *   **Endpoint:** `POST /api/reports/send-digest`
    *   **Schedule:** Every Monday at 9 AM (e.g., `0 9 * * 1`)

---

## 4. Secrets Management

**NEVER** commit secret keys to your git repository. Use a secrets manager like:

*   Google Secret Manager
*   HashiCorp Vault
*   AWS Secrets Manager
*   Vercel Environment Variables UI

**Secrets to Store:**

*   `RENTFAX_API_KEY`
*   `ENCRYPTION_KEY`
*   `PLAID_CLIENT_ID`
*   `PLAID_SECRET`
*   `POSTMARK_API_KEY`
*   `CRM_API_KEY`
*   The JSON content of your `GOOGLE_APPLICATION_CREDENTIALS`

---

## 5. Staging vs. Production Configuration

| Item                      | Staging (`rentfax-staging`)                                   | Production (`rentfax-prod`)                               |
| ------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| **Domain**                | `staging.rentfax.ai`                                          | `app.rentfax.ai`                                          |
| **Firebase Project**      | `FIREBASE_PROJECT_ID_STAGING`                                 | `FIREBASE_PROJECT_ID`                                     |
| **Data**                  | Test data only. Can be wiped frequently.                      | Live customer data. Handle with extreme care.             |
| **API Keys**              | Use sandbox/test keys for all third-party services (Plaid, etc). | Use production keys for all third-party services.         |
| **Email/Notifications**   | Send only to development or staging user inboxes.             | Send to real customer inboxes.                            |
| **Security Rules**        | Can be slightly more permissive for easier testing.           | Must be locked down and strictly enforced.                |
| **CI/CD**                 | Deploy automatically on pushes to `develop` or `staging` branch. | Deploy manually or on pushes to `main` branch after approval. |

---

**Launch cleanly, launch confidently!**
