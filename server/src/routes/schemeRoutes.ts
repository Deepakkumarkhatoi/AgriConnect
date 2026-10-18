import { Router } from 'express';
import {
  getSchemes,
  getSchemeById,
  checkEligibility,
  getSavedSchemes,
  saveScheme,
  updateChecklist,
  removeSavedScheme,
} from '../controllers/schemeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getSchemes);
router.post('/check-eligibility', checkEligibility);
router.get('/:id', getSchemeById);

// Farmer authenticated routes
router.get('/saved/my', authenticate, getSavedSchemes);
router.post('/saved', authenticate, saveScheme);
router.patch('/saved/:schemeId/checklist', authenticate, updateChecklist);
router.delete('/saved/:schemeId', authenticate, removeSavedScheme);

export default router;
