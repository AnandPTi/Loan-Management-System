// src/routes/loanRoutes.ts
import express from 'express';
import { applyLoan, getUserLoans, updateLoanStatus } from '../controllers/loanController';
import { auth, verifierAuth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post('/apply', auth, applyLoan);
router.get('/user-loans', auth, getUserLoans);
router.patch('/:loanId/status', auth, adminAuth, updateLoanStatus);

export default router;
