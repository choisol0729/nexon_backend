import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    id:   { type: String, required: true, unique: true },
    pw:   { type: String, required: true },          // bcrypt hash
    role: { type: String, required: true },
    consecutiveDay: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
  },
  { collection: 'users' },
);