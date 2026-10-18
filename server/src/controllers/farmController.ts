import { Request, Response } from 'express';
import { Farm } from '../models/Farm';
import { CropRecord } from '../models/CropRecord';

export async function getFarms(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const farms = await Farm.find({ farmerId }).sort({ createdAt: -1 });

    // Attach active crop count to each farm
    const farmsWithCrops = await Promise.all(
      farms.map(async (farm) => {
        const crops = await CropRecord.find({ farmId: farm._id });
        return {
          ...farm.toObject(),
          crops,
          activeCropsCount: crops.filter((c) => c.stage !== 'harvested').length,
        };
      })
    );

    res.json({ success: true, farms: farmsWithCrops });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createFarm(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { name, village, district, state, areaAcres, soilType, irrigationSource, surveyNumber, notes } = req.body;

    if (!name || !district || !state || !areaAcres) {
      res.status(400).json({ success: false, error: 'Name, district, state, and land area (acres) are required.' });
      return;
    }

    const farm = await Farm.create({
      farmerId,
      name,
      village,
      district,
      state,
      areaAcres: Number(areaAcres),
      soilType: soilType || 'Alluvial',
      irrigationSource: irrigationSource || 'Canal / Tubewell',
      surveyNumber,
      notes,
    });

    res.status(201).json({ success: true, farm });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateFarm(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { id } = req.params;

    const farm = await Farm.findOne({ _id: id, farmerId });
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm plot not found or access denied.' });
      return;
    }

    Object.assign(farm, req.body);
    await farm.save();

    res.json({ success: true, farm });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteFarm(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { id } = req.params;

    const farm = await Farm.findOneAndDelete({ _id: id, farmerId });
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm plot not found or access denied.' });
      return;
    }

    // Also delete associated crop records
    await CropRecord.deleteMany({ farmId: id });

    res.json({ success: true, message: 'Farm plot and its crop records deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
