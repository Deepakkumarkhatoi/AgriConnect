import { Router } from 'express';
import {
  getMarketPrices,
  getCropsList,
  compareMarketPrices,
  getPriceHistory,
} from '../controllers/marketPriceController';

const router = Router();

router.get('/', getMarketPrices);
router.get('/crops', getCropsList);
router.get('/compare', compareMarketPrices);
router.get('/history', getPriceHistory);

export default router;
