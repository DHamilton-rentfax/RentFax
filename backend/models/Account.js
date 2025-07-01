// backend/models/Account.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Account name is required.'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Account = model('Account', accountSchema);
export default Account;
