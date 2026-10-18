import { Router } from 'express';
import {
  getListings,
  getListingById,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/marketplaceController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Public / Buyer search
router.get('/', getListings);
router.get('/:id', getListingById);

// Farmer authenticated listing operations
router.get('/farmer/my', authenticate, authorizeRoles('farmer', 'admin'), getMyListings);
router.post('/', authenticate, authorizeRoles('farmer', 'admin'), createListing);
router.patch('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);

export default router;
