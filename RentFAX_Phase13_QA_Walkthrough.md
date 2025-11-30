#  RentFAX Phase 13 – Final QA & UX Walkthrough Checklist

This checklist is designed to be used by the QA team to ensure that the RentFAX platform is ready for launch. It covers all major features and user flows for the Client Portal, Renter Portal, Admin Dashboard, and Super Admin Dashboard.

---

##  Client Portal QA

- [x] **Login:** Can you log in with valid client credentials?
- [ ] **Dashboard:** Does the dashboard display the correct stats for total renters, open disputes, and recent incidents?
- [ ] **Renters:**
    - [ ] Can you view a list of all renters?
    - [x] Can you add a new renter via the Search Renter Modal?
    - [ ] Can you upload a CSV of renters?
    - [ ] Can you view the details of a specific renter?
    - [ ] Can you see the risk score and fraud signals for a renter?
    - [ ] Can you export the renter list to CSV?
- [ ] **Disputes:**
    - [ ] Can you view a list of all disputes?
    - [ ] Can you view the details of a specific dispute?
    - [ ] Can you respond to a dispute?
    - [ ] Can you close a dispute?
    - [ ] Can you export the disputes list to CSV?
- [ ] **Incidents:**
    - [ ] Can you view a list of all incidents?
    - [ ] Can you log a new incident?
    - [ ] Can you view the details of a specific incident?
    - [ ] Can you export the incidents list to CSV?
- [ ] **Settings:**
    - [ ] Can you update your organization's settings?
    - [ ] Can you invite a new team member?
    - [x] Can you manage team member roles and view seat usage?
- [x] **Billing:** Can the user purchase seats and manage their subscription?

---

##  Renter Portal QA

- [x] **Access:** Can you access the portal using a magic link?
- [ ] **Documents:** Can you view your documents?
- [ ] **Disputes:**
    - [ ] Can you view a list of your disputes?
    - [ ] Can you create a new dispute?
    - [ ] Can you view the details of a specific dispute?
- [ ] **Messages:** Can you send and receive messages?
- [ ] **History:** Can you view your incident history?
- [x] **Payments:** Can you make a payment using Stripe?
- [ ] **Responsiveness:** Is the portal responsive and mobile-friendly?

---

## Admin Dashboard QA

- [x] **Login:** Can you log in with admin credentials?
- [ ] **Organizations:** Can you view all organizations?
- [ ] **Organization Details:** Can you view the details of a specific organization?
- [ ] **Organization Management:** Can you manage the settings of an organization?
- [ ] **Platform Analytics:** Can you view analytics for the entire platform?

---

## Super Admin QA

- [x] **Login:** Can you log in with super admin credentials?
- [ ] **Global Stats:** Can you view global statistics (total tenants, fraud spikes)?
- [ ] **Rate Limiting:** Can you manage rate limiting settings?
- [ ] **Backups:** Can you trigger a manual backup?
- [ ] **Environments:** Can you manage staging and production environments?

---

## UX/UI QA

- [ ] **Toast Notifications:** Are toast notifications appearing for relevant actions (e.g., saving, creating)?
- [ ] **Loading Skeletons:** Are loading skeletons displayed while data is being fetched?
- [ ] **Responsive Sidebar:** Is the sidebar responsive on mobile devices for both client and renter portals?
- [ ] **Buttons:** Are all buttons using the new `Button` component and styled consistently?
- [ ] **Typography & Spacing:** Is the typography and spacing consistent across the application?
- [ ] **Client Portal Vision:** Does the Client Portal feel like a financial dashboard?
- [ ] **Renter Portal Vision:** Is the Renter Portal consumer-friendly and easy to navigate?
- [ ] **Admin/Super Admin Vision:** Is the Admin/Super Admin dashboard styled consistently with the rest of the application?
