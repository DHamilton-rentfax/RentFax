// backend/routes/seedRoutes.js
import express from 'express';
import { seedAdmin } from '../controllers/seedController.js';

const router = express.Router();

router.post('/seed-admins', seedAdmin);

export default router;
