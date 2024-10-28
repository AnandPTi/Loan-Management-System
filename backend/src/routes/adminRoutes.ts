// src/routes/adminRoutes.ts
import express from 'express';
import { assignVerifier, createVerifier, deleteUser, getAllLoans, getAllUsers } from '../controllers/adminController';
import { auth, adminAuth, verifierAuth } from '../middleware/auth';

const router = express.Router();

router.post('/verifier', auth, adminAuth, createVerifier);
router.delete('/user/:userId', auth, adminAuth, deleteUser);
router.get('/loans', auth, adminAuth, getAllLoans);
router.post('/loans/assign-verifier', auth, adminAuth, assignVerifier); // New route for assigning verifier
router.get('/users', auth, adminAuth, getAllUsers);

export default router;
