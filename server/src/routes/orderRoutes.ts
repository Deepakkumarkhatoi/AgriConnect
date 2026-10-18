import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  negotiateOrder,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

// Buyer creates order
router.post('/', authorizeRoles('buyer', 'admin'), createOrder);

// Both buyer, farmer, and admin can view their orders
router.get('/', getOrders);
router.get('/:id', getOrderById);

// Negotiation message thread
router.post('/:id/negotiate', negotiateOrder);

// Status update (accept/reject/cancel/complete)
router.patch('/:id/status', updateOrderStatus);

export default router;
