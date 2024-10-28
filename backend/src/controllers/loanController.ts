// src/controllers/loanController.ts
import { Request, Response } from 'express';
import { Loan } from '../models/Loan';
import { AuthRequest } from '../middleware/auth';

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const loanData = {
      ...req.body,
      user: req.user.userId
    };

    const loan = new Loan(loanData);
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: 'Failed to apply for loan' });
  }
};

export const getUserLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ user: req.user.userId });
    res.json(loans);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch loans' });
  }
};

export const updateLoanStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;
    
    // Validate status value
    if (!['pending', 'approved', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update loan status' });
  }
};

// export const updateLoanStatus = async (req: Request, res: Response) => {
//   try {
//     const { loanId } = req.params;
//     const { status } = req.body;

//     const loan = await Loan.findByIdAndUpdate(
//       loanId,
//       { status },
//       { new: true }
//     );

//     if (!loan) {
//       return res.status(404).json({ error: 'Loan not found' });
//     }

//     res.json(loan);
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to update loan status' });
//   }
// };