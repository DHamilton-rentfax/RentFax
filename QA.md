# 🔍 RentFAX QA Checklist (Must Pass Before Launch)

### **1. Authentication**

* [ ] Signup works
* [ ] Login works
* [ ] Logout works
* [ ] Session cookies persist
* [ ] Redirects work correctly

### **2. Onboarding**

* [ ] User cannot reach `/dashboard` before completing onboarding
* [ ] Step-by-step onboarding works
* [ ] Onboarding progress saved in Firestore
* [ ] Guard redirects consistently

### **3. Company Setup**

* [ ] Creating a company works
* [ ] Invites work
* [ ] Accept invite flow works
* [ ] Employee roles displayed correctly

### **4. Renter Search**

* [ ] Search (with autofill) works
* [ ] No-match screen appears
* [ ] Multi-match screen appears
* [ ] Match confirmation screen works

### **5. Identity Check**

* [ ] $4.99 identity check opens Stripe
* [ ] Webhook marks identityVerified in Firestore
* [ ] Identity score appears

### **6. Report Unlock**

* [ ] Unlock full report works via Stripe
* [ ] Webhook sets unlocked = true
* [ ] Report viewer loads
* [ ] PDF download works
* [ ] AI summary appears

### **7. Incidents & Disputes**

* [ ] New incidents appear correctly
* [ ] Dispute submission works
* [ ] Admin can resolve dispute
* [ ] Timeline updates

### **8. Notifications**

* [ ] Email sending works
* [ ] SMS sending works
* [ ] In-app notifications appear
* [ ] Notification center loads

### **9. Super Admin Dashboard**

* [ ] Global metrics load
* [ ] High-risk alerts appear
* [ ] System logs update
* [ ] Employee monitoring displays actions

### **10. Billing**

* [ ] Subscription checkout works
* [ ] Stripe portal loads
* [ ] Plan enforcement logic works
* [ ] Credits system enforced

### **11. Security**

* [ ] Users cannot access other companies
* [ ] Renters cannot access others' reports
* [ ] Rules compile & deploy cleanly
* [ ] API endpoints reject unauthorized calls