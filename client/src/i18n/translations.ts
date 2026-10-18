export type Language = 'en' | 'or' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navMandi: string;
  navWeather: string;
  navSchemes: string;
  navMarketplace: string;
  navSupport: string;
  navDashboard: string;
  login: string;
  register: string;
  logout: string;
  farmer: string;
  buyer: string;
  officer: string;
  admin: string;
  quickDemoLogin: string;
  mandiTitle: string;
  mandiSubtitle: string;
  weatherTitle: string;
  schemesTitle: string;
  marketplaceTitle: string;
  supportTitle: string;
  adminTitle: string;
  searchPlaceholder: string;
  comparePrices: string;
  checkEligibility: string;
  postListing: string;
  raiseTicket: string;
  viewDetails: string;
  applyNow: string;
  negotiate: string;
  status: string;
  quantity: string;
  pricePerUnit: string;
  totalEstimate: string;
  close: string;
  submit: string;
  allIndia: string;
  verifiedBadge: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AgriConnect',
    tagline: 'Smart Farmer Assistance & Agricultural Commerce Platform',
    navHome: 'Home',
    navMandi: 'Mandi Prices',
    navWeather: 'Weather & Alerts',
    navSchemes: 'Government Schemes',
    navMarketplace: 'Produce Marketplace',
    navSupport: 'Officer Support',
    navDashboard: 'Dashboard',
    login: 'Sign In',
    register: 'Register',
    logout: 'Sign Out',
    farmer: 'Farmer',
    buyer: 'Buyer / Trader',
    officer: 'Agri Officer',
    admin: 'Administrator',
    quickDemoLogin: 'Quick Demo Switcher',
    mandiTitle: 'Mandi Market Intelligence',
    mandiSubtitle: 'Live commodity rates from Agmarknet & state marketing committees',
    weatherTitle: 'Localized Weather & Crop Advisories',
    schemesTitle: 'Government Scheme Discovery',
    marketplaceTitle: 'Direct Produce Marketplace',
    supportTitle: 'Agricultural Officer Assistance',
    adminTitle: 'Operations & Platform Management',
    searchPlaceholder: 'Search crops, markets, or schemes...',
    comparePrices: 'Compare Markets',
    checkEligibility: 'Check My Eligibility',
    postListing: 'List Produce for Sale',
    raiseTicket: 'Request Assistance',
    viewDetails: 'View Details',
    applyNow: 'Official Portal',
    negotiate: 'Make Offer / Negotiate',
    status: 'Status',
    quantity: 'Quantity',
    pricePerUnit: 'Price / Unit',
    totalEstimate: 'Total Value',
    close: 'Close',
    submit: 'Submit',
    allIndia: 'All-India',
    verifiedBadge: 'Verified Producer',
  },
  or: {
    appName: 'କୃଷିକନେକ୍ଟ (AgriConnect)',
    tagline: 'ଚାଷୀ ସହାୟତା ଏବଂ କୃଷି ବଜାର ମଞ୍ଚ',
    navHome: 'ମୂଳ ପୃଷ୍ଠା',
    navMandi: 'ମଣ୍ଡି ଦର',
    navWeather: 'ପାଣିପାଗ ଓ ଚେତାବନୀ',
    navSchemes: 'ସରକାରୀ ଯୋଜନା',
    navMarketplace: 'କୃଷି ବଜାର',
    navSupport: 'କୃଷି ଅଧିକାରୀ ସହାୟତା',
    navDashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    login: 'ପ୍ରବେଶ କରନ୍ତୁ',
    register: 'ପଞ୍ଜୀକରଣ',
    logout: 'ପ୍ରସ୍ଥାନ',
    farmer: 'କୃଷକ (Farmer)',
    buyer: 'ବ୍ୟବସାୟୀ / କ୍ରେତା',
    officer: 'କୃଷି ଅଧିକାରୀ',
    admin: 'ପ୍ରଶାସକ (Admin)',
    quickDemoLogin: 'ଡେମୋ ଖାତା ବାଛନ୍ତୁ',
    mandiTitle: 'ମଣ୍ଡି ବଜାର ଦର',
    mandiSubtitle: 'ଆଗମାର୍କନେଟ ଏବଂ ନିୟନ୍ତ୍ରିତ ବଜାର କମିଟିରୁ ସଦ୍ୟତମ ମୂଲ୍ୟ',
    weatherTitle: 'ପାଣିପାଗ ସୂଚନା ଏବଂ କୃଷି ପରାମର୍ଶ',
    schemesTitle: 'କୃଷି କଲ୍ୟାଣ ଯୋଜନା',
    marketplaceTitle: 'ସିଧାସଳଖ ଫସଲ ବିକ୍ରୟ ମଣ୍ଡପ',
    supportTitle: 'କୃଷି ଅଧିକାରୀ ସହାୟତା ପୋର୍ଟାଲ',
    adminTitle: 'ପରିଚାଳନା କେନ୍ଦ୍ର',
    searchPlaceholder: 'ଫସଲ, ମଣ୍ଡି କିମ୍ବା ଯୋଜନା ଖୋଜନ୍ତୁ...',
    comparePrices: 'ମଣ୍ଡି ତୁଳନା କରନ୍ତୁ',
    checkEligibility: 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ',
    postListing: 'ଫସଲ ବିକ୍ରୟ ପାଇଁ ଯୋଡନ୍ତୁ',
    raiseTicket: 'ସହାୟତା ମାଗନ୍ତୁ',
    viewDetails: 'ବିସ୍ତୃତ ଦେଖନ୍ତୁ',
    applyNow: 'ଅଫିସିଆଲ୍ ପୋର୍ଟାଲ୍',
    negotiate: 'ଦର କଥାବାର୍ତ୍ତା କରନ୍ତୁ',
    status: 'ସ୍ଥିତି',
    quantity: 'ପରିମାଣ',
    pricePerUnit: 'ମୂଲ୍ୟ / ଏକକ',
    totalEstimate: 'ମୋଟ ଆକଳନ',
    close: 'ବନ୍ଦ କରନ୍ତୁ',
    submit: 'ଦାଖଲ କରନ୍ତୁ',
    allIndia: 'ସର୍ବଭାରତୀୟ',
    verifiedBadge: 'ପ୍ରମାଣିତ ଚାଷୀ',
  },
  hi: {
    appName: 'एग्रीकनेक्ट (AgriConnect)',
    tagline: 'स्मार्ट किसान सहायता एवं कृषि विपणन मंच',
    navHome: 'होम',
    navMandi: 'मंडी भाव',
    navWeather: 'मौसम व चेतावनी',
    navSchemes: 'सरकारी योजनाएं',
    navMarketplace: 'फसल बाजार',
    navSupport: 'कृषि अधिकारी सहायता',
    navDashboard: 'डैशबोर्ड',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    farmer: 'किसान (Farmer)',
    buyer: 'व्यापारी / क्रेता',
    officer: 'कृषि अधिकारी',
    admin: 'प्रशासक (Admin)',
    quickDemoLogin: 'डेमो खाता चुनें',
    mandiTitle: 'मंडी भाव सूचना केंद्र',
    mandiSubtitle: 'एगमार्कनेट और राज्य कृषि विपणन बोर्ड से नवीनतम दरें',
    weatherTitle: 'मौसम पूर्वानुमान एवं कृषि सलाह',
    schemesTitle: 'सरकारी किसान कल्याण योजनाएं',
    marketplaceTitle: 'प्रत्यक्ष फसल खरीद-बिक्री मंडी',
    supportTitle: 'कृषि अधिकारी सहायता केंद्र',
    adminTitle: 'प्रशासन एवं निगरानी',
    searchPlaceholder: 'फसल, मंडी या योजना खोजें...',
    comparePrices: 'मंडी तुलना करें',
    checkEligibility: 'पात्रता जांचें',
    postListing: 'फसल बेचने के लिए जोड़ें',
    raiseTicket: 'मदद के लिए अनुरोध करें',
    viewDetails: 'विवरण देखें',
    applyNow: 'आधिकारिक पोर्टल',
    negotiate: 'मूलभाव / मोलतोल करें',
    status: 'स्थिति',
    quantity: 'मात्रा',
    pricePerUnit: 'मूल्य / इकाई',
    totalEstimate: 'कुल अनुमान',
    close: 'बंद करें',
    submit: 'जमा करें',
    allIndia: 'अखिल भारतीय',
    verifiedBadge: 'सत्यापित किसान',
  },
};
