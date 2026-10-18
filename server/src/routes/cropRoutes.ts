import { Router } from 'express';
import { getCrops, addCrop, updateCropStage, addFarmActivity } from '../controllers/cropController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('farmer', 'admin'));

router.get('/', getCrops);
router.post('/', addCrop);
router.patch('/:id/stage', updateCropStage);
router.post('/:id/activities', addFarmActivity);

export default router;
