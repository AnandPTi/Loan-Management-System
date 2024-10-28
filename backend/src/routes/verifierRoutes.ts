// src/routes/verifierRoutes.ts
import express from 'express';
import { auth, verifierAuth } from '../middleware/auth';
import { getAssignedLoans, updateLoanStatus } from '../controllers/verfierController';

const router = express.Router();

// Route for verifiers to get their assigned loans
router.get('/loans', auth, verifierAuth, getAssignedLoans);

// Route for verifiers to update the status of their assigned loan
router.patch('/loans/:loanId/status', auth, verifierAuth, updateLoanStatus);

export default router;
