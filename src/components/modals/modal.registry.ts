// ─────────────────────────────────────────────
// RentFAX — Modal Registry (FINAL, SYNCED)
// ─────────────────────────────────────────────

import SearchRenterModal from "../search/SearchRenterModal";
import ReportFoundModal from "./ReportFoundModal";
import ConfirmActionModal from "./ConfirmActionModal";
import StripeCheckoutModal from "./StripeCheckoutModal";
import ReportAssignmentModal from "./ReportAssignmentModal";

// Admin Modals
import AdminAnalyticsFilterModal from "./admin/AdminAnalyticsFilterModal";
import AdminAssignReportModal from "./admin/AdminAssignReportModal";
import AdminBannerEditorModal from "./admin/AdminBannerEditorModal";
import AdminBroadcastModal from "./admin/AdminBroadcastModal";
import AdminCreateUserModal from "./admin/AdminCreateUserModal";
import AdminEditAgencyModal from "./admin/AdminEditAgencyModal";
import AdminVerifyPartnerModal from "./admin/AdminVerifyPartnerModal";

// Company Modals
import CompanyAddAssetModal from "./company/CompanyAddAssetModal";
import CompanyAddRenterModal from "./company/CompanyAddRenterModal";
import CompanyAssignStaffModal from "./company/CompanyAssignStaffModal";
import CompanyQRGeneratorModal from "./company/CompanyQRGeneratorModal";
import CompanyUploadDocModal from "./company/CompanyUploadDocModal";
import CompanyVerificationModal from "./company/CompanyVerificationModal";

// Landlord Modals
import LandlordAddPropertyModal from "./landlord/LandlordAddPropertyModal";
import LandlordDisputeModal from "./landlord/LandlordDisputeModal";
import LandlordInviteManagerModal from "./landlord/LandlordInviteManagerModal";
import LandlordProofOfRentModal from "./landlord/LandlordProofOfRentModal";
import LandlordReportIssueModal from "./landlord/LandlordReportIssueModal";
import LandlordVerifyRenterModal from "./landlord/LandlordVerifyRenterModal";

// Renter Modals
import RenterCreateDisputeModal from "./renter/RenterCreateDisputeModal";
import RenterIncidentDetailsModal from "./renter/RenterIncidentDetailsModal";
import RenterPayForReportModal from "./renter/RenterPayForReportModal";
import RenterScoreExplainerModal from "./renter/RenterScoreExplainerModal";
import RenterUpdateProfileModal from "./renter/RenterUpdateProfileModal";
import RenterUploadEvidenceModal from "./renter/RenterUploadEvidenceModal";

// ─────────────────────────────────────────────
// Registry Object
// ─────────────────────────────────────────────

export const modalRegistry = {
  // Global
  searchRenter: SearchRenterModal,
  reportFound: ReportFoundModal,
  confirmAction: ConfirmActionModal,
  stripeCheckout: StripeCheckoutModal,
  reportAssignment: ReportAssignmentModal,

  // Admin
  adminAnalyticsFilter: AdminAnalyticsFilterModal,
  adminAssignReport: AdminAssignReportModal,
  adminBannerEditor: AdminBannerEditorModal,
  adminBroadcast: AdminBroadcastModal,
  adminCreateUser: AdminCreateUserModal,
  adminEditAgency: AdminEditAgencyModal,
  adminVerifyPartner: AdminVerifyPartnerModal,

  // Company
  companyAddAsset: CompanyAddAssetModal,
  companyAddRenter: CompanyAddRenterModal,
  companyAssignStaff: CompanyAssignStaffModal,
  companyQRGenerator: CompanyQRGeneratorModal,
  companyUploadDoc: CompanyUploadDocModal,
  companyVerification: CompanyVerificationModal,

  // Landlord
  landlordAddProperty: LandlordAddPropertyModal,
  landlordDispute: LandlordDisputeModal,
  landlordInviteManager: LandlordInviteManagerModal,
  landlordProofOfRent: LandlordProofOfRentModal,
  landlordReportIssue: LandlordReportIssueModal,
  landlordVerifyRenter: LandlordVerifyRenterModal,

  // Renter
  renterCreateDispute: RenterCreateDisputeModal,
  renterIncidentDetails: RenterIncidentDetailsModal,
  renterPayForReport: RenterPayForReportModal,
  renterScoreExplainer: RenterScoreExplainerModal,
  renterUpdateProfile: RenterUpdateProfileModal,
  renterUploadEvidence: RenterUploadEvidenceModal,
} as const;

// Type-safe modal keys
export type ModalType = keyof typeof modalRegistry;
