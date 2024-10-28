// src/controllers/adminController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import { Loan } from '../models/Loan';
import bcrypt from 'bcrypt';

export const createVerifier = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, address, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifier = new User({
      email,
      name,
      phone,
      address,
      password: hashedPassword,
      role: 'verifier'
    });

    await verifier.save();
    res.status(201).json(verifier);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create verifier' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
};

export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find().populate('user').populate('assignedVerifier');
    res.json(loans);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch loans' });
  }
};

export const assignVerifier = async (req: Request, res: Response) => {
  try {
    const { loanId, verifierId } = req.body;

    // Find the loan by ID and update the assignedVerifier field
    const loan = await Loan.findByIdAndUpdate(loanId, { assignedVerifier: verifierId }, { new: true });
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ message: 'Verifier assigned successfully', loan });
  } catch (error) {
    res.status(400).json({ error: 'Failed to assign verifier' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
};
