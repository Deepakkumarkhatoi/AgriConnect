import { Router } from 'express';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../controllers/farmController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('farmer', 'admin'));

router.get('/', getFarms);
router.post('/', createFarm);
router.patch('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
