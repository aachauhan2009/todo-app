import { Router } from 'express';
import { getTodoList, createTodo, updateTodo, deleteTodo } from '../controllers/todo';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/list', requireAuth, getTodoList);
router.post('/', requireAuth, createTodo);
router.put('/:id', requireAuth, updateTodo);
router.delete('/:id', requireAuth, deleteTodo);

export default router;
