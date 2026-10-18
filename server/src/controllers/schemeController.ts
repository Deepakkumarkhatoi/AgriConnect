import { Request, Response } from 'express';
import { Scheme } from '../models/Scheme';
import { SavedScheme } from '../models/SavedScheme';
import { FarmerProfile } from '../models/FarmerProfile';

export async function getSchemes(req: Request, res: Response): Promise<void> {
  try {
    const { state, category, search } = req.query;

    const filter: any = { isActive: true };

    if (state && state !== 'All') {
      filter.$or = [{ state: 'All-India' }, { state: String(state) }];
    }

    if (category && category !== 'All') {
      filter.category = String(category);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(String(search), 'i') } },
        { description: { $regex: new RegExp(String(search), 'i') } },
        { benefits: { $regex: new RegExp(String(search), 'i') } },
      ];
    }

    const schemes = await Scheme.find(filter).sort({ title: 1 });

    res.json({ success: true, count: schemes.length, schemes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getSchemeById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      res.status(404).json({ success: false, error: 'Government scheme not found.' });
      return;
    }

    res.json({ success: true, scheme });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function checkEligibility(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    let { state, farmSizeAcres, cropsGrown, kisanCreditCard } = req.body;

    // If farmer is logged in and didn't pass parameters, pull from their saved FarmerProfile
    if (farmerId && (!state || farmSizeAcres === undefined)) {
      const profile = await FarmerProfile.findOne({ userId: farmerId });
      if (profile) {
        state = state || profile.state;
        farmSizeAcres = farmSizeAcres !== undefined ? farmSizeAcres : profile.farmSizeAcres;
        cropsGrown = cropsGrown || profile.cropsGrown;
        kisanCreditCard = kisanCreditCard !== undefined ? kisanCreditCard : profile.kisanCreditCard;
      }
    }

    const acres = Number(farmSizeAcres) || 0;
    const farmerCrops = Array.isArray(cropsGrown) ? cropsGrown : cropsGrown ? [cropsGrown] : [];
    const allSchemes = await Scheme.find({ isActive: true });

    const results = allSchemes.map((scheme) => {
      const rules = scheme.eligibilityRules || {};
      const reasons: string[] = [];
      let isEligible = true;

      // Rule 1: State check
      if (scheme.state !== 'All-India' && rules.allowedStates && rules.allowedStates.length > 0) {
        if (!state) {
          isEligible = false;
          reasons.push('State information required');
        } else if (!rules.allowedStates.includes(state)) {
          isEligible = false;
          reasons.push(`Available only in: ${rules.allowedStates.join(', ')}`);
        }
      }

      // Rule 2: Land size check
      if (rules.minLandAcres !== undefined && acres < rules.minLandAcres) {
        isEligible = false;
        reasons.push(`Minimum land requirement is ${rules.minLandAcres} acres (You entered ${acres} acres)`);
      }

      if (rules.maxLandAcres !== undefined && acres > rules.maxLandAcres) {
        isEligible = false;
        reasons.push(`Maximum land threshold is ${rules.maxLandAcres} acres for small/marginal criteria`);
      }

      // Rule 3: Kisan Credit Card requirement
      if (rules.requiresKcc && !kisanCreditCard) {
        isEligible = false;
        reasons.push('Requires active Kisan Credit Card (KCC)');
      }

      // Rule 4: Crop specific criteria
      if (rules.allowedCrops && rules.allowedCrops.length > 0 && farmerCrops.length > 0) {
        const matchesCrop = rules.allowedCrops.some((c) =>
          farmerCrops.some((fc: string) => fc.toLowerCase().includes(c.toLowerCase()))
        );
        if (!matchesCrop) {
          isEligible = false;
          reasons.push(`Eligible crops: ${rules.allowedCrops.join(', ')}`);
        }
      }

      return {
        scheme,
        isEligible,
        status: isEligible ? 'likely_eligible' : 'not_eligible',
        reasons: isEligible ? ['Meets published land and demographic criteria'] : reasons,
      };
    });

    res.json({
      success: true,
      evaluatedFor: { state, farmSizeAcres: acres, cropsGrown: farmerCrops, kisanCreditCard },
      results,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getSavedSchemes(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const saved = await SavedScheme.find({ farmerId }).populate('schemeId');

    res.json({ success: true, saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function saveScheme(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { schemeId, notes } = req.body;

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      res.status(404).json({ success: false, error: 'Scheme not found.' });
      return;
    }

    // Initialize document checklist from scheme required documents
    const initialChecklist = (scheme.documentsRequired || []).map((doc) => ({
      item: doc,
      completed: false,
    }));

    const saved = await SavedScheme.findOneAndUpdate(
      { farmerId, schemeId },
      {
        farmerId,
        schemeId,
        notes: notes || '',
        $setOnInsert: { checklist: initialChecklist },
      },
      { upsert: true, new: true }
    ).populate('schemeId');

    res.status(201).json({ success: true, saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateChecklist(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { schemeId } = req.params;
    const { itemIndex, completed } = req.body;

    const saved = await SavedScheme.findOne({ farmerId, schemeId });
    if (!saved) {
      res.status(404).json({ success: false, error: 'Saved scheme record not found.' });
      return;
    }

    if (saved.checklist[itemIndex]) {
      saved.checklist[itemIndex].completed = completed;
      await saved.save();
    }

    res.json({ success: true, saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function removeSavedScheme(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const { schemeId } = req.params;

    await SavedScheme.findOneAndDelete({ farmerId, schemeId });

    res.json({ success: true, message: 'Scheme removed from your shortlist.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
