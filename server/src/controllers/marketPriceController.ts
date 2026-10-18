import { Request, Response } from 'express';
import { MarketPrice } from '../models/MarketPrice';

export async function getMarketPrices(req: Request, res: Response): Promise<void> {
  try {
    const { crop, state, district, market, sort } = req.query;

    const filter: any = {};
    if (crop) filter.crop = { $regex: new RegExp(String(crop), 'i') };
    if (state && state !== 'All') filter.state = String(state);
    if (district && district !== 'All') filter.district = String(district);
    if (market && market !== 'All') filter.market = { $regex: new RegExp(String(market), 'i') };

    let query = MarketPrice.find(filter);

    if (sort === 'price_asc') query = query.sort({ modalPrice: 1 });
    else if (sort === 'price_desc') query = query.sort({ modalPrice: -1 });
    else query = query.sort({ date: -1 });

    const prices = await query.limit(100);

    res.json({
      success: true,
      count: prices.length,
      dataSource: 'Agmarknet (Direct Agriculture Market Network, Govt. of India)',
      lastSync: new Date().toISOString(),
      prices,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getCropsList(req: Request, res: Response): Promise<void> {
  try {
    const crops = await MarketPrice.distinct('crop');
    const states = await MarketPrice.distinct('state');
    const markets = await MarketPrice.distinct('market');

    res.json({ success: true, crops, states, markets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function compareMarketPrices(req: Request, res: Response): Promise<void> {
  try {
    const { crop, markets } = req.query;

    if (!crop) {
      res.status(400).json({ success: false, error: 'Crop name is required for price comparison.' });
      return;
    }

    const filter: any = { crop: { $regex: new RegExp(String(crop), 'i') } };

    if (markets) {
      const marketList = String(markets).split(',').map((m) => m.trim());
      filter.market = { $in: marketList };
    }

    const prices = await MarketPrice.find(filter).sort({ modalPrice: -1 }).limit(20);

    res.json({ success: true, crop, count: prices.length, comparison: prices });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getPriceHistory(req: Request, res: Response): Promise<void> {
  try {
    const { crop, market } = req.query;

    const filter: any = {};
    if (crop) filter.crop = { $regex: new RegExp(String(crop), 'i') };
    if (market) filter.market = { $regex: new RegExp(String(market), 'i') };

    // Get up to 30 past records
    const history = await MarketPrice.find(filter).sort({ date: 1 }).limit(30);

    res.json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
