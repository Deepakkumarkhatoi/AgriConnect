import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';
import { User } from '../models/User';
import { FarmerProfile } from '../models/FarmerProfile';
import { Farm } from '../models/Farm';
import { CropRecord } from '../models/CropRecord';
import { MarketPrice } from '../models/MarketPrice';
import { Scheme } from '../models/Scheme';
import { Listing } from '../models/Listing';
import { Order } from '../models/Order';
import { SupportTicket } from '../models/SupportTicket';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';

async function seed() {
  console.log(`Connecting to database for seeding...`);
  await mongoose.connect(ENV.MONGODB_URI);
  console.log(`Connected to MongoDB. Clearing existing demo collections...`);

  await Promise.all([
    User.deleteMany({}),
    FarmerProfile.deleteMany({}),
    Farm.deleteMany({}),
    CropRecord.deleteMany({}),
    MarketPrice.deleteMany({}),
    Scheme.deleteMany({}),
    Listing.deleteMany({}),
    Order.deleteMany({}),
    SupportTicket.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log(`Collections cleared. Seeding accounts with 4 role-specific passwords...`);

  // 4 distinct passwords for RBAC testing
  const farmerPasswordHash = await bcrypt.hash('Farmer@123', 10);
  const buyerPasswordHash = await bcrypt.hash('Buyer@123', 10);
  const officerPasswordHash = await bcrypt.hash('Officer@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Create Demo Users for all 4 roles
  const farmer = await User.create({
    name: 'Ramesh Mohapatra',
    email: 'farmer@agriconnect.com',
    passwordHash: farmerPasswordHash,
    role: 'farmer',
    status: 'active',
    phone: '+91 98765 43210',
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    language: 'en',
  });

  const buyer = await User.create({
    name: 'Ananya Agro Traders',
    email: 'buyer@agriconnect.com',
    passwordHash: buyerPasswordHash,
    role: 'buyer',
    status: 'active',
    phone: '+91 98123 45678',
    district: 'Bhubaneswar',
    state: 'Odisha',
    organization: 'Ananya Wholesale Agri Logistics Pvt Ltd',
    language: 'en',
  });

  const officer = await User.create({
    name: 'Dr. Debabrata Jena (DAO)',
    email: 'officer@agriconnect.com',
    passwordHash: officerPasswordHash,
    role: 'officer',
    status: 'active',
    phone: '+91 94370 11223',
    district: 'Puri',
    state: 'Odisha',
    jurisdiction: 'Puri',
    organization: 'Department of Agriculture & Farmers Empowerment, Odisha',
    language: 'en',
  });

  const admin = await User.create({
    name: 'Platform Administrator',
    email: 'admin@agriconnect.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
    status: 'active',
    phone: '+91 90000 00000',
    district: 'Bhubaneswar',
    state: 'Odisha',
    language: 'en',
  });

  // 2. Farmer Profile
  await FarmerProfile.create({
    userId: farmer._id,
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    farmSizeAcres: 3.5,
    cropsGrown: ['Paddy', 'Mustard', 'Moong Dal'],
    kisanCreditCard: true,
    irrigationType: 'Canal & Borewell',
    bankAccountLinked: true,
    notes: 'Member of local Krushak Sangha',
  });

  // 3. Farms
  const farm1 = await Farm.create({
    farmerId: farmer._id,
    name: 'Mahanadi Delta Main Plot',
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    areaAcres: 2.5,
    soilType: 'Alluvial Loam',
    irrigationSource: 'Canal Flow',
    surveyNumber: 'KH-142/2021',
  });

  const farm2 = await Farm.create({
    farmerId: farmer._id,
    name: 'Riverbank Vegetable Patch',
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    areaAcres: 1.0,
    soilType: 'Sandy Loam',
    irrigationSource: 'Drip & Borewell',
    surveyNumber: 'KH-188/2023',
  });

  // 4. Crop Records
  await CropRecord.create([
    {
      farmId: farm1._id,
      farmerId: farmer._id,
      cropName: 'Paddy (Dhan)',
      variety: 'Swarna Sub-1',
      season: 'Kharif',
      sowingDate: new Date('2026-06-15'),
      expectedHarvestDate: new Date('2026-11-20'),
      stage: 'ripening',
      estimatedProductionQuintals: 45,
      irrigationNotes: 'Flooded 5cm alternate wetting and drying',
      fertilizerNotes: 'Urea and DAP applied at tillering stage',
      activities: [
        { date: new Date('2026-06-15'), title: 'Direct Seed Sowing', notes: 'Certified seed treated with Trichoderma' },
        { date: new Date('2026-07-20'), title: 'Weeding & Thinning', notes: 'Cono-weeder used between rows' },
        { date: new Date('2026-09-10'), title: 'Panicle Initiation Inspection', notes: 'Healthy foliage, no blast observed' },
      ],
    },
    {
      farmId: farm2._id,
      farmerId: farmer._id,
      cropName: 'Mustard (Sarson)',
      variety: 'Pusa Bold',
      season: 'Rabi',
      sowingDate: new Date('2026-10-05'),
      expectedHarvestDate: new Date('2027-01-25'),
      stage: 'vegetative',
      estimatedProductionQuintals: 12,
      irrigationNotes: 'First irrigation at 30 days after sowing',
      fertilizerNotes: 'Single Super Phosphate and Farm Yard Manure applied',
      activities: [
        { date: new Date('2026-10-05'), title: 'Bed preparation and line sowing', notes: 'Spacing 30cm x 10cm maintained' },
      ],
    },
  ]);

  // 5. Mandi Market Prices (Official realistic Agmarknet samples)
  await MarketPrice.create([
    {
      crop: 'Paddy (Common)',
      variety: 'Common FAQ',
      market: 'Bhubaneswar RMC',
      district: 'Khordha',
      state: 'Odisha',
      minPrice: 2180,
      maxPrice: 2320,
      modalPrice: 2280,
      date: new Date(),
      source: 'Agmarknet Odisha RMC',
      priceTrend: 'up',
    },
    {
      crop: 'Paddy (Grade A)',
      variety: 'Grade A Fine',
      market: 'Bargarh Mandi',
      district: 'Bargarh',
      state: 'Odisha',
      minPrice: 2300,
      maxPrice: 2480,
      modalPrice: 2420,
      date: new Date(),
      source: 'Agmarknet Odisha RMC',
      priceTrend: 'up',
    },
    {
      crop: 'Paddy (Common)',
      variety: 'Common',
      market: 'Cuttack Sadar',
      district: 'Cuttack',
      state: 'Odisha',
      minPrice: 2150,
      maxPrice: 2290,
      modalPrice: 2240,
      date: new Date(),
      source: 'Agmarknet Odisha RMC',
      priceTrend: 'stable',
    },
    {
      crop: 'Wheat',
      variety: 'Lokwan',
      market: 'Karnal Grain Market',
      district: 'Karnal',
      state: 'Haryana',
      minPrice: 2450,
      maxPrice: 2680,
      modalPrice: 2590,
      date: new Date(),
      source: 'Haryana State Agricultural Marketing Board',
      priceTrend: 'stable',
    },
    {
      crop: 'Mustard',
      variety: 'Black Bold',
      market: 'Alwar Mandi',
      district: 'Alwar',
      state: 'Rajasthan',
      minPrice: 5350,
      maxPrice: 5720,
      modalPrice: 5580,
      date: new Date(),
      source: 'Rajasthan Mandi Samiti',
      priceTrend: 'up',
    },
    {
      crop: 'Onion',
      variety: 'Red Medium',
      market: 'Lasalgaon APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      minPrice: 1650,
      maxPrice: 2200,
      modalPrice: 1950,
      date: new Date(),
      source: 'MSAMB Maharashtra',
      priceTrend: 'down',
    },
    {
      crop: 'Tomato',
      variety: 'Hybrid Desi',
      market: 'Kolar APMC',
      district: 'Kolar',
      state: 'Karnataka',
      minPrice: 1400,
      maxPrice: 1900,
      modalPrice: 1720,
      date: new Date(),
      source: 'Karnataka APMC Directorate',
      priceTrend: 'up',
    },
    {
      crop: 'Moong Dal (Green Gram)',
      variety: 'Standard FAQ',
      market: 'Sambalpur Market Yard',
      district: 'Sambalpur',
      state: 'Odisha',
      minPrice: 7800,
      maxPrice: 8550,
      modalPrice: 8300,
      date: new Date(),
      source: 'Agmarknet Odisha',
      priceTrend: 'stable',
    },
  ]);

  // 6. Schemes
  await Scheme.create([
    {
      title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      code: 'PM-KISAN',
      state: 'All-India',
      category: 'Financial',
      department: 'Ministry of Agriculture & Farmers Welfare, GoI',
      description: 'An income support scheme providing ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of all landholding farmer families across India.',
      benefits: 'Direct transfer of ₹6,000 annually via DBT into Aadhaar-linked bank accounts.',
      eligibilityRules: {
        minLandAcres: 0.1,
        maxLandAcres: 100,
        allowedStates: [],
        requiresKcc: false,
        targetCategory: 'All Landholding Farmers',
      },
      documentsRequired: ['Aadhaar Card', 'Land Ownership RoR (Patta)', 'Active Bank Passbook', 'Mobile linked to Aadhaar'],
      officialUrl: 'https://pmkisan.gov.in',
      deadline: 'Open Throughout Year',
      isActive: true,
    },
    {
      title: 'KALIA Scheme (Krushak Assistance for Livelihood and Income Augmentation)',
      code: 'KALIA-ODISHA',
      state: 'Odisha',
      category: 'Financial',
      department: 'Department of Agriculture & Farmers Empowerment, Govt. of Odisha',
      description: 'Odisha Government comprehensive welfare scheme providing financial assistance of ₹10,000 per family for small and marginal farmers, crop loan interest subvention, and life insurance.',
      benefits: '₹10,000 per year per farm family for five seasons + ₹2 Lakh life and accident insurance cover.',
      eligibilityRules: {
        minLandAcres: 0.1,
        maxLandAcres: 5.0, // Small & marginal farmers up to 5 acres
        allowedStates: ['Odisha'],
        requiresKcc: false,
        targetCategory: 'Small and Marginal Farmers of Odisha',
      },
      documentsRequired: ['Aadhaar Card', 'Odisha Land RoR / Ration Card', 'Bank Account Passbook (Odisha Gramya or Apex Bank preferred)'],
      officialUrl: 'https://kalia.odisha.gov.in',
      deadline: 'Ongoing Scheme',
      isActive: true,
    },
    {
      title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      code: 'PMFBY',
      state: 'All-India',
      category: 'Insurance',
      department: 'Ministry of Agriculture & Farmers Welfare, GoI',
      description: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest stages. Maximum 2% premium for Kharif crops and 1.5% for Rabi crops.',
      benefits: 'Financial compensation for yield loss, localized calamities (hailstorm, landslide), and post-harvest cyclone damage.',
      eligibilityRules: {
        minLandAcres: 0.1,
        allowedStates: [],
        allowedCrops: ['Paddy', 'Wheat', 'Mustard', 'Moong Dal', 'Cotton', 'Maize'],
        requiresKcc: false,
        targetCategory: 'Sharecroppers, Tenant and Landowning Farmers',
      },
      documentsRequired: ['Land Possession Certificate or Sowing Certificate', 'Aadhaar Card', 'Bank Account details', 'Crop Sowing Declaration'],
      officialUrl: 'https://pmfby.gov.in',
      deadline: 'July 31 for Kharif / Dec 31 for Rabi',
      isActive: true,
    },
    {
      title: 'PMKSY - Per Drop More Crop (Micro Irrigation Subsidy)',
      code: 'PMKSY-PDMC',
      state: 'All-India',
      category: 'Irrigation',
      department: 'Department of Agriculture and Cooperation',
      description: 'Subsidies up to 55% for small/marginal farmers and 45% for other farmers on drip and sprinkler micro-irrigation systems to improve water use efficiency.',
      benefits: 'Up to 55% capital cost subsidy for installing drip and sprinkler systems.',
      eligibilityRules: {
        minLandAcres: 0.5,
        maxLandAcres: 12.5,
        allowedStates: [],
        requiresKcc: false,
        targetCategory: 'Farmers with assured water source',
      },
      documentsRequired: ['Water Source Certificate / Electricity bill for pump', 'Soil & Water testing report', 'Land RoR Patta', 'Aadhaar Card'],
      officialUrl: 'https://pmksy.gov.in',
      deadline: 'Rolling Applications by District DHO/DAO',
      isActive: true,
    },
  ]);

  // 7. Produce Listings
  const listing1 = await Listing.create({
    farmerId: farmer._id,
    farmerName: farmer.name,
    farmerPhone: farmer.phone,
    crop: 'Paddy (Swarna Sub-1)',
    variety: 'Swarna Sub-1 Certified',
    quantityAvailable: 35,
    initialQuantity: 45,
    unit: 'Quintal',
    pricePerUnit: 2350,
    qualityGrade: 'Grade A / FAQ (Moisture < 14%)',
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    availabilityDate: new Date('2026-11-25'),
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'],
    description: 'Freshly harvested paddy from Mahanadi delta basin. Naturally dried, moisture below 13.5%, high head rice recovery.',
    status: 'active',
  });

  const listing2 = await Listing.create({
    farmerId: farmer._id,
    farmerName: farmer.name,
    farmerPhone: farmer.phone,
    crop: 'Mustard Seed (Pusa Bold)',
    variety: 'Pusa Bold High Oil Content',
    quantityAvailable: 15,
    initialQuantity: 15,
    unit: 'Quintal',
    pricePerUnit: 5600,
    qualityGrade: 'Organic Certified (42% Oil Content)',
    village: 'Pipili',
    district: 'Puri',
    state: 'Odisha',
    availabilityDate: new Date('2027-02-01'),
    images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'],
    description: 'High pungency organic mustard seeds. Cleaned and graded, free from foreign weed seeds.',
    status: 'active',
  });

  // 8. Order / Negotiation
  await Order.create({
    buyerId: buyer._id,
    buyerName: buyer.name,
    buyerPhone: buyer.phone,
    farmerId: farmer._id,
    farmerName: farmer.name,
    listingId: listing1._id,
    crop: listing1.crop,
    quantity: 10,
    unit: 'Quintal',
    offeredPricePerUnit: 2280,
    counterPricePerUnit: 2320,
    totalAmount: 23200,
    deliveryPreference: 'Pickup from Pipili village collection point',
    status: 'negotiating',
    messages: [
      {
        senderId: buyer._id,
        senderName: buyer.name,
        senderRole: 'buyer',
        text: 'Hello Ramesh ji, we are interested in 10 quintals of Swarna Sub-1. Can you offer ₹2,280 per quintal?',
        proposedPrice: 2280,
        timestamp: new Date('2026-10-12T10:00:00Z'),
      },
      {
        senderId: farmer._id,
        senderName: farmer.name,
        senderRole: 'farmer',
        text: 'Namaste! The grain quality and moisture are well maintained. Best I can do is ₹2,320 per quintal with gunny bags included.',
        proposedPrice: 2320,
        timestamp: new Date('2026-10-12T14:30:00Z'),
      },
    ],
  });

  // 9. Support Ticket
  await SupportTicket.create({
    farmerId: farmer._id,
    farmerName: farmer.name,
    farmerPhone: farmer.phone,
    district: 'Puri',
    state: 'Odisha',
    category: 'pest_disease',
    priority: 'high',
    status: 'in_progress',
    subject: 'Yellowing of lower leaf margins in Paddy nursery',
    description: 'Observed yellow discoloration and brown spots spreading from leaf tips on 25-day old paddy plants. Need guidance on whether this is zinc deficiency or brown spot fungus.',
    cropName: 'Paddy',
    photoUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80',
    assignedOfficerId: officer._id,
    assignedOfficerName: officer.name,
    messages: [
      {
        senderId: farmer._id,
        senderName: farmer.name,
        senderRole: 'farmer',
        text: 'Observed yellow discoloration and brown spots spreading from leaf tips on 25-day old paddy plants. Need guidance on whether this is zinc deficiency or brown spot fungus.',
        createdAt: new Date('2026-10-13T08:00:00Z'),
      },
      {
        senderId: officer._id,
        senderName: officer.name,
        senderRole: 'officer',
        text: 'The symptoms indicate early Zinc deficiency aggravated by prolonged submerged water. Drain excess water and spray Zinc Sulphate (0.5% + 0.25% lime) or chelated zinc @ 1g/liter during clear sunlight hours.',
        createdAt: new Date('2026-10-13T11:15:00Z'),
      },
    ],
  });

  // 10. Sample In-App Notification
  await Notification.create({
    recipientId: farmer._id,
    type: 'weather_alert',
    title: 'Rainfall Advisory for Puri & Khordha',
    message: 'Scattered thunderstorms forecasted for the next 48 hours. Ensure crop drainage channels are cleared.',
    link: '/farmer/weather',
    createdAt: new Date(),
  });

  console.log(`\n🎉 Database Seed Completed Successfully!`);
  console.log(`--------------------------------------------------`);
  console.log(`Role-Specific Demo Credentials:`);
  console.log(`🌾 Farmer:   farmer@agriconnect.com   | Password: Farmer@123`);
  console.log(`🛒 Buyer:    buyer@agriconnect.com    | Password: Buyer@123`);
  console.log(`🏛️  Officer:  officer@agriconnect.com  | Password: Officer@123`);
  console.log(`👑 Admin:    admin@agriconnect.com    | Password: Admin@123`);
  console.log(`--------------------------------------------------\n`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
