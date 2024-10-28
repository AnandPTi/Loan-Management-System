// src/types/index.ts
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  address: string;
  password: string;
  role: 'user' | 'verifier' | 'admin';
}

export interface ILoan {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  fullName: string;
  amount: number;
  tenure: number;
  employmentStatus: 'unemployed' | 'employed';
  reason: string;
  employmentAddress1: string;
  employmentAddress2?: string;
  termsAccepted: boolean;
  creditInfoDisclosure: boolean;
  assignedVerifier: Types.ObjectId | IUser;
  status: 'pending' | 'approved' | 'verified' | 'rejected';
}
