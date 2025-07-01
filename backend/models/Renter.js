// backend/models/Renter.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AddressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false }
);

const IdDocumentSchema = new Schema(
  {
    type: {
      type: String,
      default: 'drivers_license',
      enum: ['drivers_license', 'passport', 'national_id'],
    },
    number: String,
    country: String,
    state: String,
    expires: Date,
  },
  { _id: false }
);

const PersonaVerificationSchema = new Schema(
  {
    inquiryId: { type: String },
    status: {
      type: String,
      enum: ['approved', 'in_review', 'unverified', 'denied'],
    },
    outcome: { type: String },
    updatedAt: { type: Date },
  },
  { _id: false }
);

const RenterSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dob: { type: Date },
    licenseNumber: { type: String },
    licenseState: { type: String },
    licenseExpires: { type: Date },
    firstRentalDate: { type: Date },
    totalRentals: { type: Number, default: 0 },
    incidents: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'under_review', 'banned'],
      default: 'active',
    },
    address: AddressSchema,
    idDocument: IdDocumentSchema,
    notes: { type: String },
    tags: [{ type: String }],
    personaVerification: PersonaVerificationSchema,
  },
  { timestamps: true }
);

const Renter = model('Renter', RenterSchema);
export default Renter;
