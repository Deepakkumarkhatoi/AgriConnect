// AgriConnect Client API Service Layer
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('agriconnect_token');
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('agriconnect_token', token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('agriconnect_token');
  localStorage.removeItem('agriconnect_user');
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.warn(`[API Network Error on ${endpoint}]:`, error.message);
    throw error;
  }
}

// Fallback Realistic Offline/Preloaded Data
export const FALLBACK_DATA = {
  mandiPrices: [
    { _id: 'mp1', crop: 'Paddy (Common)', variety: 'Swarna FAQ', market: 'Bhubaneswar RMC', district: 'Khordha', state: 'Odisha', minPrice: 2180, maxPrice: 2340, modalPrice: 2280, date: '2026-10-14T06:00:00.000Z', source: 'Agmarknet Odisha', priceTrend: 'up' },
    { _id: 'mp2', crop: 'Paddy (Grade A)', variety: 'Fine Super', market: 'Bargarh Mandi', district: 'Bargarh', state: 'Odisha', minPrice: 2320, maxPrice: 2510, modalPrice: 2440, date: '2026-10-14T06:00:00.000Z', source: 'Agmarknet Odisha', priceTrend: 'up' },
    { _id: 'mp3', crop: 'Wheat', variety: 'Sharbati', market: 'Karnal Grain Market', district: 'Karnal', state: 'Haryana', minPrice: 2450, maxPrice: 2700, modalPrice: 2610, date: '2026-10-14T06:00:00.000Z', source: 'HSAMB Haryana', priceTrend: 'stable' },
    { _id: 'mp4', crop: 'Mustard', variety: 'Pusa Bold', market: 'Alwar Mandi', district: 'Alwar', state: 'Rajasthan', minPrice: 5350, maxPrice: 5740, modalPrice: 5590, date: '2026-10-14T06:00:00.000Z', source: 'Rajasthan APMC', priceTrend: 'up' },
    { _id: 'mp5', crop: 'Onion', variety: 'Red Nasik', market: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', minPrice: 1650, maxPrice: 2250, modalPrice: 1980, date: '2026-10-14T06:00:00.000Z', source: 'MSAMB Maharashtra', priceTrend: 'down' },
    { _id: 'mp6', crop: 'Tomato', variety: 'Hybrid Desi', market: 'Kolar APMC', district: 'Kolar', state: 'Karnataka', minPrice: 1400, maxPrice: 1950, modalPrice: 1750, date: '2026-10-14T06:00:00.000Z', source: 'Karnataka APMC', priceTrend: 'up' },
    { _id: 'mp7', crop: 'Moong Dal', variety: 'Green Gram', market: 'Sambalpur Market Yard', district: 'Sambalpur', state: 'Odisha', minPrice: 7800, maxPrice: 8600, modalPrice: 8350, date: '2026-10-14T06:00:00.000Z', source: 'Agmarknet Odisha', priceTrend: 'stable' },
    { _id: 'mp8', crop: 'Cotton', variety: 'Medium Staple', market: 'Warangal Mandi', district: 'Warangal', state: 'Telangana', minPrice: 6700, maxPrice: 7250, modalPrice: 7100, date: '2026-10-14T06:00:00.000Z', source: 'TS AMC Directorate', priceTrend: 'up' },
  ],
  schemes: [
    {
      _id: 'sc1',
      title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      code: 'PM-KISAN',
      state: 'All-India',
      category: 'Financial',
      department: 'Ministry of Agriculture & Farmers Welfare, GoI',
      description: 'Income support of ₹6,000 per annum in three equal installments to all landholding farmer families across India.',
      benefits: 'Direct transfer of ₹6,000 yearly via Aadhaar-linked DBT into your bank account.',
      eligibilityRules: { minLandAcres: 0.1, maxLandAcres: 100, requiresKcc: false },
      documentsRequired: ['Aadhaar Card', 'Land Ownership RoR (Patta)', 'Bank Passbook with IFSC', 'Aadhaar-linked Mobile'],
      officialUrl: 'https://pmkisan.gov.in',
      deadline: 'Open Throughout the Year',
    },
    {
      _id: 'sc2',
      title: 'KALIA Scheme (Krushak Assistance for Livelihood and Income Augmentation)',
      code: 'KALIA-ODISHA',
      state: 'Odisha',
      category: 'Financial',
      department: 'Dept. of Agriculture & Farmers Empowerment, Odisha',
      description: 'Comprehensive welfare scheme providing ₹10,000/year to small and marginal farmers, crop loan interest subvention, and life insurance.',
      benefits: '₹10,000 financial support per farm family + ₹2 Lakh life and personal accident insurance.',
      eligibilityRules: { minLandAcres: 0.1, maxLandAcres: 5.0, allowedStates: ['Odisha'] },
      documentsRequired: ['Aadhaar Card', 'Odisha Land RoR / Ration Card', 'Bank Passbook'],
      officialUrl: 'https://kalia.odisha.gov.in',
      deadline: 'Ongoing Scheme',
    },
    {
      _id: 'sc3',
      title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      code: 'PMFBY',
      state: 'All-India',
      category: 'Insurance',
      department: 'Ministry of Agriculture & Farmers Welfare, GoI',
      description: 'Low-cost comprehensive crop insurance protecting against drought, floods, pest outbreaks, and post-harvest unseasonal rain losses.',
      benefits: 'Full sum insured reimbursement for crop yield loss with max 2% premium for Kharif and 1.5% for Rabi.',
      eligibilityRules: { minLandAcres: 0.1 },
      documentsRequired: ['Land Possession Certificate / Patta', 'Crop Sowing Declaration', 'Aadhaar Card', 'Bank Account details'],
      officialUrl: 'https://pmfby.gov.in',
      deadline: 'July 31 for Kharif / Dec 31 for Rabi',
    },
    {
      _id: 'sc4',
      title: 'PMKSY - Per Drop More Crop (Micro Irrigation Subsidy)',
      code: 'PMKSY-PDMC',
      state: 'All-India',
      category: 'Irrigation',
      department: 'Department of Agriculture & Cooperation',
      description: 'Up to 55% capital subsidy for installing drip and sprinkler irrigation systems, conserving up to 40% water.',
      benefits: '55% subsidy for small/marginal farmers and 45% for other farmers on micro-irrigation installation.',
      eligibilityRules: { minLandAcres: 0.5, maxLandAcres: 12.5 },
      documentsRequired: ['Land Ownership Document (Patta)', 'Water Source Verification', 'Soil & Water Test Report', 'Aadhaar Card'],
      officialUrl: 'https://pmksy.gov.in',
      deadline: 'Rolling Applications by District Horticulture Office',
    },
  ],
  listings: [
    {
      _id: 'list1',
      farmerId: 'farmer1',
      farmerName: 'Ramesh Mohapatra',
      farmerPhone: '+91 98765 43210',
      crop: 'Paddy (Swarna Sub-1)',
      variety: 'Swarna Sub-1 Certified',
      quantityAvailable: 35,
      unit: 'Quintal',
      pricePerUnit: 2350,
      qualityGrade: 'Grade A / FAQ (Moisture < 13.5%)',
      village: 'Pipili',
      district: 'Puri',
      state: 'Odisha',
      availabilityDate: new Date('2026-11-25').toISOString(),
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'],
      description: 'Directly harvested from Mahanadi delta basin. Naturally sun-dried, moisture tested below 13.5%, high milling yield.',
      status: 'active',
    },
    {
      _id: 'list2',
      farmerId: 'farmer1',
      farmerName: 'Ramesh Mohapatra',
      farmerPhone: '+91 98765 43210',
      crop: 'Mustard (Pusa Bold)',
      variety: 'Pusa Bold High-Oil',
      quantityAvailable: 15,
      unit: 'Quintal',
      pricePerUnit: 5600,
      qualityGrade: 'Organic Certified (42% Oil Content)',
      village: 'Pipili',
      district: 'Puri',
      state: 'Odisha',
      availabilityDate: new Date('2027-02-01').toISOString(),
      images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'],
      description: 'Pungent, high oil yield mustard seeds grown using bio-fertilizers. Double cleaned and sorted.',
      status: 'active',
    },
    {
      _id: 'list3',
      farmerId: 'farmer2',
      farmerName: 'Suresh Chandra Pradhan',
      farmerPhone: '+91 94371 99887',
      crop: 'Moong Dal (Green Gram)',
      variety: 'Nayagarh Local Premium',
      quantityAvailable: 22,
      unit: 'Quintal',
      pricePerUnit: 8400,
      qualityGrade: 'Bold Machine Cleaned',
      village: 'Ranpur',
      district: 'Nayagarh',
      state: 'Odisha',
      availabilityDate: '2026-10-14T06:00:00.000Z',
      images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'],
      description: 'Naturally grown green gram moong. Uniform size, ideal for wholesale pulses processing.',
      status: 'active',
    },
    {
      _id: 'list4',
      farmerId: 'farmer3',
      farmerName: 'Gurmukh Singh',
      farmerPhone: '+91 98140 22334',
      crop: 'Basmati Rice (1121)',
      variety: 'Pusa Basmati 1121 Extra Long',
      quantityAvailable: 80,
      unit: 'Quintal',
      pricePerUnit: 4200,
      qualityGrade: 'Export Quality (Aged 1 Year)',
      village: 'Nilokheri',
      district: 'Karnal',
      state: 'Haryana',
      availabilityDate: '2026-10-14T06:00:00.000Z',
      images: ['https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80'],
      description: 'Aroma-rich extra long grain basmati rice, 8.4mm average grain length. Pre-sorted in 50kg bags.',
      status: 'active',
    },
  ],
  weather: {
    district: 'Puri',
    state: 'Odisha',
    current: {
      temp: 31,
      feelsLike: 35,
      condition: 'Partly Cloudy',
      humidity: 78,
      windSpeedKmph: 14,
      rainfallProbability: 45,
      uvIndex: 7,
      updatedAt: '12:30 PM',
    },
    alerts: [
      {
        id: 'al-rain',
        type: 'warning',
        title: 'Monsoon Low Pressure Watch for Coastal Odisha',
        description: 'Moderate to heavy rain showers predicted across Puri and Khordha over the next 48 hours.',
        recommendation: 'Ensure field drainage trenches are clear. Delay spraying of pesticides and foliar nutrients.',
        issuedAt: '2026-10-14T06:00:00.000Z',
      },
      {
        id: 'al-pest',
        type: 'info',
        title: 'Stem Borer & Leaf Blast Vigilance',
        description: 'Persistent humidity above 75% favors yellow stem borer egg laying in tillering paddy.',
        recommendation: 'Set up 5 pheromone traps per acre. Spray Cartap Hydrochloride 50 SP @ 2g/L if ETL exceeds 5% dead hearts.',
        issuedAt: new Date().toISOString(),
      },
    ],
    forecast: [
      { date: '2026-10-14', day: 'Wed', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', humidity: 76, rainfallProbability: 35, rainfallMm: 4, windSpeedKmph: 14 },
      { date: '2026-10-15', day: 'Thu', tempMax: 30, tempMin: 23, condition: 'Scattered Showers', humidity: 84, rainfallProbability: 70, rainfallMm: 22, windSpeedKmph: 18 },
      { date: '2026-10-16', day: 'Fri', tempMax: 29, tempMin: 22, condition: 'Thunderstorms', humidity: 88, rainfallProbability: 85, rainfallMm: 38, windSpeedKmph: 22 },
      { date: '2026-10-17', day: 'Sat', tempMax: 31, tempMin: 23, condition: 'Scattered Showers', humidity: 79, rainfallProbability: 50, rainfallMm: 12, windSpeedKmph: 15 },
      { date: '2026-10-18', day: 'Sun', tempMax: 33, tempMin: 24, condition: 'Clear Sunny', humidity: 68, rainfallProbability: 15, rainfallMm: 0, windSpeedKmph: 12 },
      { date: '2026-10-19', day: 'Mon', tempMax: 34, tempMin: 25, condition: 'Clear Sunny', humidity: 64, rainfallProbability: 10, rainfallMm: 0, windSpeedKmph: 11 },
      { date: '2026-10-20', day: 'Tue', tempMax: 33, tempMin: 24, condition: 'Partly Cloudy', humidity: 70, rainfallProbability: 25, rainfallMm: 2, windSpeedKmph: 13 },
    ],
  },
};
