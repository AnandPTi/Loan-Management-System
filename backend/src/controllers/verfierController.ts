// src/controllers/verifierController.ts
import { Request, Response } from 'express';
import { Loan } from '../models/Loan';
import { AuthRequest } from '../middleware/auth';

// export const getAssignedLoans = async (req: AuthRequest, res: Response) => {
//   try {
//     const verifierId = req.user.id; // Assumes verifier ID is stored in req.user.id after auth middleware
//     const loans = await Loan.find({ assignedVerifier: verifierId });

//     res.json(loans);
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to fetch assigned loans' });
//   }
// };
export const getAssignedLoans = async (req: AuthRequest, res: Response) => {
    try {
      console.log('Entering getAssignedLoans controller');
      console.log('User from request:', req.user);
      
      const verifierId = req.user.userId;
      console.log('Verifier ID:', verifierId);
      
      const loans = await Loan.find({ assignedVerifier: verifierId });
      console.log('Found loans:', loans);
      
      res.json(loans);
    } catch (error) {
      console.error('Error in getAssignedLoans:', error);
      res.status(400).json({ error: 'Failed to fetch assigned loans' });
    }
  };
export const updateLoanStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { loanId } = req.params;
      const { status } = req.body;
      const verifierId = req.user.userId; // Assumes verifier ID is stored in req.user.id after auth middleware
  
      // Validate status value
      if (!['pending', 'approved', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
  
      // Find the loan and ensure it is assigned to the authenticated verifier
      const loan = await Loan.findOneAndUpdate(
        { _id: loanId, assignedVerifier: verifierId },
        { status },
        { new: true }
      );
  
      if (!loan) {
        return res.status(404).json({ error: 'Loan not found or not assigned to this verifier' });
      }
  
      res.json(loan);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update loan status' });
    }
  };