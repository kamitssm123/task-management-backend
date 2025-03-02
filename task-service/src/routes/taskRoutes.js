import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTasks, getTaskMetrics} from '../controllers/taskController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticateJWT, getTaskMetrics);
router.post('/', authenticateJWT, createTask);
router.get('/', authenticateJWT,  getTasks);
router.get('/:id', authenticateJWT, getTaskById);
router.put('/:id', authenticateJWT, updateTask);
router.delete('/',authenticateJWT, deleteTasks);

export default router;
