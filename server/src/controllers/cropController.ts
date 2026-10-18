import { Request, Response } from 'express';
import { CropRecord } from '../models/CropRecord';
import { Farm } from '../models/Farm';

export async function getCrops(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { farmId, stage } = req.query;

    const filter: any = { farmerId };
    if (farmId) filter.farmId = farmId;
    if (stage) filter.stage = stage;

    const crops = await CropRecord.find(filter).populate('farmId', 'name district state').sort({ sowingDate: -1 });

    res.json({ success: true, crops });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function addCrop(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const {
      farmId,
      cropName,
      variety,
      season,
      sowingDate,
      expectedHarvestDate,
      stage,
      estimatedProductionQuintals,
      irrigationNotes,
      fertilizerNotes,
    } = req.body;

    if (!farmId || !cropName || !sowingDate || !expectedHarvestDate || estimatedProductionQuintals === undefined) {
      res.status(400).json({
        success: false,
        error: 'farmId, cropName, sowingDate, expectedHarvestDate, and estimatedProductionQuintals are required.',
      });
      return;
    }

    const farm = await Farm.findOne({ _id: farmId, farmerId });
    if (!farm) {
      res.status(404).json({ success: false, error: 'Specified farm does not exist or does not belong to you.' });
      return;
    }

    const crop = await CropRecord.create({
      farmId,
      farmerId,
      cropName,
      variety: variety || 'Standard',
      season: season || 'Kharif',
      sowingDate: new Date(sowingDate),
      expectedHarvestDate: new Date(expectedHarvestDate),
      stage: stage || 'sowing',
      estimatedProductionQuintals: Number(estimatedProductionQuintals),
      irrigationNotes,
      fertilizerNotes,
      activities: [
        {
          date: new Date(sowingDate),
          title: 'Sowing completed',
          notes: `Planted ${variety || 'Standard'} variety`,
        },
      ],
    });

    res.status(201).json({ success: true, crop });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateCropStage(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { id } = req.params;
    const { stage, actualHarvestQuintals, note } = req.body;

    const crop = await CropRecord.findOne({ _id: id, farmerId });
    if (!crop) {
      res.status(404).json({ success: false, error: 'Crop record not found' });
      return;
    }

    if (stage) crop.stage = stage;
    if (actualHarvestQuintals !== undefined) crop.actualHarvestQuintals = Number(actualHarvestQuintals);

    if (note || stage) {
      crop.activities.push({
        date: new Date(),
        title: `Stage updated to ${stage || crop.stage}`,
        notes: note || `Growth stage changed to ${stage || crop.stage}`,
      });
    }

    await crop.save();

    res.json({ success: true, crop });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function addFarmActivity(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { id } = req.params;
    const { title, notes, cost, date } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: 'Activity title is required.' });
      return;
    }

    const crop = await CropRecord.findOne({ _id: id, farmerId });
    if (!crop) {
      res.status(404).json({ success: false, error: 'Crop record not found' });
      return;
    }

    crop.activities.push({
      date: date ? new Date(date) : new Date(),
      title,
      notes: notes || '',
      cost: cost ? Number(cost) : 0,
    });

    await crop.save();

    res.json({ success: true, crop });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
