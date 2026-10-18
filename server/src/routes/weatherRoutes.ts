import { Router } from 'express';
import { getWeatherForecast } from '../controllers/weatherController';

const router = Router();

router.get('/', getWeatherForecast);

export default router;
