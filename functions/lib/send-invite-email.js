"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
if (!admin.apps.length) {
    admin.initializeApp();
}
mail_1.default.setApiKey(functions.config().sendgrid.key);
exports.sendInviteEmail = functions.firestore
    .document("invites/{inviteId}")
    .onCreate(async (snap, context) => {
    const invite = snap.data();
    if (!invite)
        return;
    const { email, role, token } = invite;
    const appUrl = process.env.APP_URL || "http://localhost:9002"; // Fallback for local dev
    const link = `${appUrl}/invite/${token}`;
    const msg = {
        to: email,
        from: "noreply@rentfax.ai",
        subject: `You're invited to join RentFAX as a ${role}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #3F51B5;">Welcome to RentFAX!</h2>
            <p>You’ve been invited to join the RentFAX team as a <strong>${role}</strong>.</p>
            <p>Click the button below to accept your invitation and set up your account. This link will expire in 7 days.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#3F51B5;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Accept Invite</a>
            </p>
            <p>If the button doesn’t work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #555;">${link}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p style="font-size:12px;color:#888;">This invite was sent automatically from the RentFAX platform.</p>
          </div>
        </div>
      `,
    };
    try {
        await mail_1.default.send(msg);
        console.log(`Invite email sent successfully to ${email}`);
    }
    catch (error) {
        console.error("Error sending invite email:", error);
        // If you have error logging set up (e.g., Sentry), you'd log it here.
    }
});
//# sourceMappingURL=send-invite-email.js.map