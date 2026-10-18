import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  updateUserStatus,
  createScheme,
  updateScheme,
  getAuditLogs,
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.post('/schemes', createScheme);
router.patch('/schemes/:id', updateScheme);
router.get('/audit-logs', getAuditLogs);

export default router;
