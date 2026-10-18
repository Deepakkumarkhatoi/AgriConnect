import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
} from '../controllers/supportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Farmer creates ticket
router.post('/', createTicket);

// List tickets based on role (Farmer: own; Officer: district/assigned; Admin: all)
router.get('/', getTickets);
router.get('/:id', getTicketById);

// Add reply
router.post('/:id/messages', addMessage);

// Update status
router.patch('/:id/status', updateTicketStatus);

export default router;
