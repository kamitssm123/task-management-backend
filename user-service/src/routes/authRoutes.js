import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);

export default router;
