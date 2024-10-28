// src/models/User.ts
import mongoose from 'mongoose';
import { IUser } from '../types';

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'verifier', 'admin'], default: 'user' }
});

export const User = mongoose.model<IUser>('User', userSchema);

