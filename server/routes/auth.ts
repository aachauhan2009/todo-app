import { Router } from 'express';
import { login, signUp, logout, getUser, getUserProfile, saveUserProfile } from '../controllers/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/sign-up', signUp);
router.post('/logout', logout);
router.get('/user', requireAuth, getUser);
router.get('/user/profile', requireAuth, getUserProfile);
router.post('/user/profile', requireAuth, saveUserProfile);

export default router;
