// src/models/Loan.ts
import { Schema, model } from 'mongoose';
import { ILoan } from '../types';

const loanSchema = new Schema<ILoan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  employmentStatus: { type: String, enum: ['unemployed', 'employed'], required: true },
  reason: { type: String, required: true },
  employmentAddress1: { type: String, required: true },
  employmentAddress2: { type: String },
  termsAccepted: { type: Boolean, required: true },
  creditInfoDisclosure: { type: Boolean, required: true },
  assignedVerifier: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'verified', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const Loan = model<ILoan>('Loan', loanSchema);