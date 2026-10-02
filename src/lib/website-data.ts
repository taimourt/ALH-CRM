export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  society: string;
  societySlug: string;
  city: string;
  location: string;
  propertyType: 'RESIDENTIAL_PLOT' | 'COMMERCIAL_PLOT' | 'HOUSE_VILLA' | 'PLAZA_BUILDING' | 'APARTMENT' | 'FARMHOUSE' | 'FILE' | 'OTHER';
  purpose: 'INVESTMENT' | 'BUILD' | 'RESIDENCE' | 'RENTAL' | 'COMMERCIAL';
  sizeMarla: number;
  sizeSqFt: number;
  demandPrice: number; // in PKR
  marketPrice: number; // in PKR
  pricePerSqFt: number;
  pricePerMarla: number;
  nocStatus: string;
  devStatus: string;
  possessionStatus: 'AVAILABLE' | 'UPCOMING' | 'UNKNOWN';
  developmentStatus: 'DEVELOPED' | 'DEVELOPING' | 'UPCOMING';
  availabilityStatus: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'HOT_OPPORTUNITY';
  plotNumber?: string;
  sectorBlock?: string;
  description: string;
  features: string[];
  image: string;
  gallery: string[];
  paymentPlanDetails?: {
    downPayment: number;
    monthlyInstallment: number;
    quarterlyInstallment: number;
    durationMonths: number;
  };
  nearbyLandmarks?: string[];
  documentsList?: string[];
  faqs?: { question: string; answer: string }[];
  attachedVideoId?: string;
  isFeatured?: boolean;
  isHotInvestment?: boolean;
  createdDate: string;
  agentName: string;
  agentPhone: string;
}

export interface InvestmentAssessmentScore {
  location: number;         // out of 10
  accessibility: number;    // out of 10
  development: number;      // out of 10
  demand: number;           // out of 10
  liquidity: number;        // out of 10
  priceEntry: number;       // out of 10
  infrastructure: number;   // out of 10
  rentalPotential: number;  // out of 10
  overallScore: number;     // calculated average
  methodologyNotes: string;
}

export interface SocietyItem {
  id: string;
  slug: string;
  name: string;
  city: string;
  location: string;
  tagline: string;
  developer: string;
  nocStatus: string;
  devStatus: string;
  blocks: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  rentalYield: string;
  annualAppreciation: string;
  totalPlots: number;
  heroImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  masterPlanDetails: string;
  investmentAssessment: InvestmentAssessmentScore;
  priceTrends: { year: string; avgRatePerMarla: number }[];
  paymentPlans?: {
    category: string;
    downPayment: number;
    quarterlyInstallment: number;
    totalPrice: number;
  }[];
  amenities: string[];
  nearbyLandmarks: string[];
  prosCons: { pros: string[]; cons: string[] };
  faqs: { question: string; answer: string }[];
  isFeatured?: boolean;
}

export interface InvestmentReport {
  id: string;
  slug: string;
  title: string;
  category: 'MARKET_ANALYSIS' | 'SOCIETY_DEEEP_DIVE' | 'REAL_VS_SPECULATIVE' | 'CONSTRUCTION_METRICS';
  summary: string;
  readTime: string;
  publishedDate: string;
  author: string;
  keyTakeaways: string[];
  content: string;
}

export interface VideoItem {
  id: string;
  title: string;
  society: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  youtubeId?: string;
  publishedDate: string;
  category: 'SITE_TOUR' | 'PRICE_ANALYSIS' | 'DEVELOPMENT_UPDATE' | 'ADVISORY' | 'WALKTHROUGH';
  description: string;
  isShort?: boolean;
  linkedPropertyId?: string;
  linkedSocietySlug?: string;
  aspectRatio?: '16:9' | '9:16';
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  image: string;
}

// -----------------------------------------------------------------------------
// SEED MOCK DATA (Wah & Islamabad Market Real Rates)
// -----------------------------------------------------------------------------

export const SOCIETIES_DATA: SocietyItem[] = [
  {
    id: 'soc-1',
    slug: 'kohistan-enclave-wah',
    name: 'Kohistan Enclave',
    city: 'Wah Cantt',
    location: 'Main GT Road, Wah Cantt',
    tagline: 'The premier luxury residential address in Wah Cantt with verified CDA/RDA clearance.',
    developer: 'Kohistan Builders & Developers',
    nocStatus: 'RDA & Cantt Board Approved',
    devStatus: '100% Fully Developed & Possessed',
    blocks: ['Block A (Executive)', 'Block B', 'Block C', 'Block D', 'Civic Center'],
    priceRangeMin: 7500000,   // 75 Lakhs
    priceRangeMax: 45000000,  // 4.5 Crore
    rentalYield: '7.8% p.a.',
    annualAppreciation: '18.4%',
    totalPlots: 4200,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Kohistan Enclave stands as the benchmark for luxury living and real-estate security in Wah Cantt. Positioned directly on main GT Road with underground electricity, 24/7 security, lush green parks, and high-margin commercial civic centers.',
    highlights: [
      'Direct main GT Road frontage opposite Wah Cantt barrier',
      '100% underground utilities & gas network installed',
      'Active underground sewerage & optical fiber telecom',
      'High rental demand driven by Wah Medical & Engineering Universities',
    ],
    masterPlanDetails: 'Comprising 5 distinct sectors with dedicated commercial civic centers, 80ft main boulevards, and strict architectural bylaws ensuring high asset valuation.',
    investmentAssessment: {
      location: 9.5,
      accessibility: 9.8,
      development: 9.6,
      demand: 9.2,
      liquidity: 9.0,
      priceEntry: 8.0,
      infrastructure: 9.7,
      rentalPotential: 9.4,
      overallScore: 9.3,
      methodologyNotes: 'Asad Land Holdings Internal Proprietary Assessment based on GT Road access, 100% possession speed, and university rental absorption.',
    },
    priceTrends: [
      { year: '2023', avgRatePerMarla: 950000 },
      { year: '2024', avgRatePerMarla: 1150000 },
      { year: '2025', avgRatePerMarla: 1320000 },
      { year: '2026', avgRatePerMarla: 1450000 },
    ],
    paymentPlans: [
      {
        category: '10 Marla Residential Plot (Block B)',
        downPayment: 2500000,
        quarterlyInstallment: 750000,
        totalPrice: 10000000,
      },
    ],
    amenities: [
      'Underground Electricity',
      'Sui Gas Network',
      '24/7 Gated Security & CCTV',
      'Central Park & Lake',
      'Grand Jamia Mosque',
      'Civic Commercial Center',
    ],
    nearbyLandmarks: [
      'Wah Medical College (2 mins)',
      'University of Engineering & Technology Wah (5 mins)',
      'Wah Cantt Barrier Gate 1 (1 min)',
      'Brahma Bahtar Interchange M-1 (12 mins)',
    ],
    prosCons: {
      pros: [
        'Highest security & prestige in Wah Cantt',
        '100% on-ground plot possession',
        'Strong student & faculty rental returns',
      ],
      cons: [
        'Higher entry price per Marla compared to outer societies',
        'Limited remaining primary developer plot inventory',
      ],
    },
    faqs: [
      {
        question: 'Is Kohistan Enclave approved by RDA & Cantt Board?',
        answer: 'Yes. Kohistan Enclave possesses 100% verified approval from RDA and the local Wah Cantt Board with no title encumbrances.',
      },
      {
        question: 'What is the average construction cost in Kohistan Enclave?',
        answer: 'A+ Luxury finishing current engineering BOQ cost is PKR 4,800 - 5,400 per SqFt.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'soc-2',
    slug: 'new-city-phase-2-wah',
    name: 'New City Phase 2',
    city: 'Wah Cantt',
    location: 'Near M-1 Motorway Interchange, Wah',
    tagline: 'A self-sustained mega township featuring Arcade 1 & 2, Executive Blocks, and M-1 Connectivity.',
    developer: 'New City Developers (Ch. Qamar Zaman & Family)',
    nocStatus: 'RDA Approved',
    devStatus: '90% Developed / Rapid Construction',
    blocks: ['Block A', 'Block B', 'Block C', 'Executive Block', 'Commercial Arcade'],
    priceRangeMin: 5500000,   // 55 Lakhs
    priceRangeMax: 38000000,  // 3.8 Crore
    rentalYield: '8.2% p.a.',
    annualAppreciation: '16.5%',
    totalPlots: 8500,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'New City Phase 2 is the largest planned urban development in Wah Cantt, offering seamless connectivity to Islamabad via M-1 Motorway interchange. Home to major retail brands, educational institutes, and modern healthcare facilities.',
    highlights: [
      'Direct access from Brahma Bahtar Interchange M-1 Motorway',
      'Operational New City Arcade commercial complex',
      'Active family parks, international standard schools, and mosques',
      'Strong end-user demand and consistent commercial plot absorption',
    ],
    masterPlanDetails: 'Divided into Phase 1, Phase 2, and New City Executive with dedicated commercial squares and wide 100ft arterial roads.',
    investmentAssessment: {
      location: 9.0,
      accessibility: 9.5,
      development: 9.0,
      demand: 9.1,
      liquidity: 9.2,
      priceEntry: 8.8,
      infrastructure: 9.0,
      rentalPotential: 9.5,
      overallScore: 9.1,
      methodologyNotes: 'ALH Proprietary Assessment driven by M-1 motorway interchange connectivity and high commercial footfall at New City Arcade.',
    },
    priceTrends: [
      { year: '2023', avgRatePerMarla: 700000 },
      { year: '2024', avgRatePerMarla: 850000 },
      { year: '2025', avgRatePerMarla: 980000 },
      { year: '2026', avgRatePerMarla: 1100000 },
    ],
    amenities: [
      'M-1 Motorway Direct Interchange',
      'Commercial Arcade Mall',
      'City School & Roots Campus',
      'Underground Electricity',
    ],
    nearbyLandmarks: [
      'Brahma Bahtar M-1 Toll Plaza (3 mins)',
      'New City Arcade (1 min)',
      'Wah Cantt Railway Station (10 mins)',
    ],
    prosCons: {
      pros: ['Excellent motorway connectivity', 'Thriving commercial center'],
      cons: ['Slightly further from main GT Road barrier'],
    },
    faqs: [
      {
        question: 'Are plots in Executive Block possession-ready?',
        answer: 'Yes, Block A, B, and Executive Block have instant physical plot possession.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'soc-3',
    slug: 'multi-gardens-b17-islamabad',
    name: 'Multi Gardens B-17',
    city: 'Islamabad',
    location: 'Zone 2, Main GT Road & M-1 Link Road',
    tagline: 'MPCHS flagship sector offering high capital growth between Rawalpindi and Wah.',
    developer: 'Multi Professional Cooperative Housing Society (MPCHS)',
    nocStatus: 'CDA Approved Sector B-17',
    devStatus: '95% Developed with Active Living',
    blocks: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G (Multi Residia)'],
    priceRangeMin: 8500000,   // 85 Lakhs
    priceRangeMax: 65000000,  // 6.5 Crore
    rentalYield: '6.9% p.a.',
    annualAppreciation: '21.0%',
    totalPlots: 14000,
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Multi Gardens B-17 is a premier CDA-approved cooperative housing project spanning across Zone 2 Islamabad. Famous for its green lake parks, wide avenues, and high ROI on commercial investment.',
    highlights: [
      'Dedicated M-1 Interchange connection approved & operational',
      'Natural lake parks, sports complex, and wide commercial avenues',
      'Proven capital growth over 10+ consecutive years',
    ],
    masterPlanDetails: 'Includes Sectors A, B, C, D, E, F, G with dedicated commercial hubs, high-rise apartment zones, and public health facilities.',
    investmentAssessment: {
      location: 9.4,
      accessibility: 9.6,
      development: 9.5,
      demand: 9.5,
      liquidity: 9.4,
      priceEntry: 8.2,
      infrastructure: 9.4,
      rentalPotential: 8.5,
      overallScore: 9.2,
      methodologyNotes: 'ALH Proprietary Assessment based on CDA Zone 2 regulatory status and M-1 motorway link road completion.',
    },
    priceTrends: [
      { year: '2023', avgRatePerMarla: 1100000 },
      { year: '2024', avgRatePerMarla: 1350000 },
      { year: '2025', avgRatePerMarla: 1550000 },
      { year: '2026', avgRatePerMarla: 1750000 },
    ],
    amenities: ['CDA Approved Sewerage & Water', 'Natural Lake Parks', 'Multi Mall'],
    nearbyLandmarks: ['Srinagar Highway (15 mins)', 'Islamabad Airport (20 mins)'],
    prosCons: {
      pros: ['CDA Zone 2 jurisdiction', 'High liquidity on commercial plots'],
      cons: ['Block F and G still completing utility connections'],
    },
    faqs: [{ question: 'Is B-17 CDA approved?', answer: 'Yes, Sector B-17 is fully CDA approved.' }],
    isFeatured: true,
  },
  {
    id: 'soc-4',
    slug: 'faisal-hills-taxila',
    name: 'Faisal Hills',
    city: 'Taxila / Wah',
    location: 'Main GT Road, N-5 near Taxila Bypass',
    tagline: 'Zedem International flagship mega project with panoramic Margalla mountain views.',
    developer: 'Zedem International (Ch. Abdul Majeed)',
    nocStatus: 'RDA Approved',
    devStatus: '85% Developed / On-ground Plots',
    blocks: ['Executive Block', 'Block A', 'Block B', 'Block C', 'Block D'],
    priceRangeMin: 4800000,   // 48 Lakhs
    priceRangeMax: 32000000,  // 3.2 Crore
    rentalYield: '7.2% p.a.',
    annualAppreciation: '19.5%',
    totalPlots: 18000,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    description: 'Faisal Hills Taxila/Wah is one of the most sought-after investment destinations in Northern Punjab. Backed by Zedem International, it guarantees solid development pace and high liquidity.',
    highlights: ['225ft wide main boulevard', 'Uninterrupted views of Margalla Hills', 'High speed development'],
    masterPlanDetails: 'Spans thousands of kanals with grand mosque, sports complex, and central boulevard.',
    investmentAssessment: {
      location: 9.0,
      accessibility: 9.2,
      development: 9.1,
      demand: 9.4,
      liquidity: 9.5,
      priceEntry: 9.1,
      infrastructure: 9.0,
      rentalPotential: 8.2,
      overallScore: 9.1,
      methodologyNotes: 'ALH Proprietary Assessment highlighting high plot trade liquidity driven by Zedem International reputation.',
    },
    priceTrends: [
      { year: '2023', avgRatePerMarla: 600000 },
      { year: '2024', avgRatePerMarla: 750000 },
      { year: '2025', avgRatePerMarla: 880000 },
      { year: '2026', avgRatePerMarla: 1040000 },
    ],
    amenities: ['225ft Boulevard', 'Grand Mosque', 'Margalla View Sports Complex'],
    nearbyLandmarks: ['Taxila Bypass N-5 (1 min)', 'Heavy Industries Taxila (5 mins)'],
    prosCons: { pros: ['Highly liquid plots', 'Affordable price per Marla'], cons: ['Underground gas pipeline connection in progress'] },
    faqs: [{ question: 'Who is the developer of Faisal Hills?', answer: 'Zedem International led by Ch. Abdul Majeed.' }],
    isFeatured: true,
  },
];

export const PROPERTIES_DATA: PropertyItem[] = [
  {
    id: 'prop-1',
    slug: '10-marla-prime-plot-kohistan-enclave-block-a',
    title: '10 Marla Corner Plot — Block A Executive',
    society: 'Kohistan Enclave',
    societySlug: 'kohistan-enclave-wah',
    city: 'Wah Cantt',
    location: 'Block A, Boulevard 1, Kohistan Enclave, Wah Cantt',
    propertyType: 'RESIDENTIAL_PLOT',
    purpose: 'BUILD',
    sizeMarla: 10,
    sizeSqFt: 2250,
    demandPrice: 14500000,  // 1.45 Crore
    marketPrice: 14200000,
    pricePerSqFt: 6444,
    pricePerMarla: 1450000,
    nocStatus: 'RDA Approved',
    devStatus: 'Possessed & Ready for Construction',
    possessionStatus: 'AVAILABLE',
    developmentStatus: 'DEVELOPED',
    availabilityStatus: 'AVAILABLE',
    plotNumber: 'A-342',
    sectorBlock: 'Block A Executive',
    description: 'Direct owner listing for a 10 Marla prime corner plot located on a 50ft wide street in Block A Executive. Flat land, clear title, immediate possession available with electricity and gas meters available at site.',
    features: [
      'Corner Plot with Extra Land',
      '50ft Wide Asphalt Street',
      'Park Facing Frontage',
      '100% Paid NOC & All Dues Cleared',
      'Immediate Construction Permission',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    nearbyLandmarks: ['Wah Medical College', 'Main GT Road Barrier 1', 'UET Wah Campus'],
    documentsList: ['RDA Allotment Letter', 'CDA NOC Clearance Certificate', 'Registry Transfer Deed'],
    faqs: [
      { question: 'Is plot possession immediate?', answer: 'Yes, plot A-342 is on-ground and ready for immediate map submission.' }
    ],
    attachedVideoId: 'vid-1',
    isFeatured: true,
    isHotInvestment: true,
    createdDate: '2026-09-10',
    agentName: 'Asad Ali',
    agentPhone: '+923005123456',
  },
  {
    id: 'prop-2',
    slug: '1-kanal-architectural-modern-villa-new-city-phase-2',
    title: '1 Kanal Brand New Designer Villa — Executive Block',
    society: 'New City Phase 2',
    societySlug: 'new-city-phase-2-wah',
    city: 'Wah Cantt',
    location: 'Executive Block, New City Phase 2, Wah Cantt',
    propertyType: 'HOUSE_VILLA',
    purpose: 'RESIDENCE',
    sizeMarla: 20,
    sizeSqFt: 4500,
    demandPrice: 48000000,  // 4.8 Crore
    marketPrice: 47500000,
    pricePerSqFt: 10666,
    pricePerMarla: 2400000,
    nocStatus: 'RDA Approved',
    devStatus: 'Turnkey Completed A+ Build',
    possessionStatus: 'AVAILABLE',
    developmentStatus: 'DEVELOPED',
    availabilityStatus: 'AVAILABLE',
    plotNumber: 'Exec-88',
    sectorBlock: 'Executive Block',
    description: 'Turnkey 5-bedroom luxury architectural villa built with premium grey structure engineering and imported Spanish tile finishes. Features dual servant quarters, basement lounge, and solar Net-Metering pre-installed.',
    features: [
      '5 Master Bedrooms with En-suite Bathrooms',
      'Double Height Ceiling Lounge with Flow Line Accents',
      'Custom Grohe & Kohler Sanitary Fittings',
      '10KW Net-Metering Solar System',
      'Italian Modular Kitchen with Appliances',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    nearbyLandmarks: ['New City Arcade', 'Brahma Bahtar Interchange M-1'],
    documentsList: ['Complete Approved Architectural Blueprints', 'Completion Certificate'],
    attachedVideoId: 'vid-2',
    isFeatured: true,
    isHotInvestment: false,
    createdDate: '2026-09-12',
    agentName: 'Engr. Hammad Khan',
    agentPhone: '+923005987654',
  },
  {
    id: 'prop-3',
    slug: '5-marla-residential-plot-faisal-hills-executive-block',
    title: '5 Marla On-Ground Plot — Executive Block',
    society: 'Faisal Hills',
    societySlug: 'faisal-hills-taxila',
    city: 'Taxila / Wah',
    location: 'Executive Block, Faisal Hills, N-5 GT Road',
    propertyType: 'RESIDENTIAL_PLOT',
    purpose: 'INVESTMENT',
    sizeMarla: 5,
    sizeSqFt: 1125,
    demandPrice: 5200000,   // 52 Lakhs
    marketPrice: 5100000,
    pricePerSqFt: 4622,
    pricePerMarla: 1040000,
    nocStatus: 'RDA Approved',
    devStatus: 'On-Ground Possessed',
    possessionStatus: 'AVAILABLE',
    developmentStatus: 'DEVELOPING',
    availabilityStatus: 'HOT_OPPORTUNITY',
    plotNumber: 'E-712',
    sectorBlock: 'Executive Block',
    description: 'High-liquidity 5 Marla residential plot located in close proximity to the 225ft Main Boulevard. Excellent entry point for real-rate property investors seeking 2-year capital gains.',
    features: [
      'On-Ground Plot Number Allotted',
      '100ft Boulevard Access',
      'Margalla Hills View',
      'Ready for Map Approval & Digging',
    ],
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    ],
    attachedVideoId: 'vid-3',
    isFeatured: true,
    isHotInvestment: true,
    createdDate: '2026-09-14',
    agentName: 'Asad Ali',
    agentPhone: '+923005123456',
  },
  {
    id: 'prop-4',
    slug: 'commercial-plaza-b17-multi-gardens-civic-center',
    title: '4 Marla Commercial Plot — Civic Center Block C',
    society: 'Multi Gardens B-17',
    societySlug: 'multi-gardens-b17-islamabad',
    city: 'Islamabad',
    location: 'Sector C Commercial Civic Center, B-17 Islamabad',
    propertyType: 'COMMERCIAL_PLOT',
    purpose: 'COMMERCIAL',
    sizeMarla: 4,
    sizeSqFt: 1000,
    demandPrice: 32000000,  // 3.2 Crore
    marketPrice: 31500000,
    pricePerSqFt: 32000,
    pricePerMarla: 8000000,
    nocStatus: 'CDA Approved',
    devStatus: 'Possessed Basement+Ground+4 Approved',
    possessionStatus: 'AVAILABLE',
    developmentStatus: 'DEVELOPED',
    availabilityStatus: 'AVAILABLE',
    plotNumber: 'C-Comm-19',
    sectorBlock: 'Sector C Civic Center',
    description: 'Rare commercial plot with CDA approved height permission for Basement + Ground + 4 Floors. Located in the densely populated sector C of B-17 with guaranteed high commercial rental yield.',
    features: [
      'Main Civic Center Frontage',
      'Approved Building Height B+G+4',
      'Adjacent to Multi Mall & Lake Park',
      'High Footfall Commercial Zone',
    ],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: false,
    isHotInvestment: true,
    createdDate: '2026-09-15',
    agentName: 'Asad Ali',
    agentPhone: '+923005123456',
  },
  {
    id: 'prop-5',
    slug: '7-marla-residential-plot-kohistan-enclave-block-b',
    title: '7 Marla Category Plot — Block B',
    society: 'Kohistan Enclave',
    societySlug: 'kohistan-enclave-wah',
    city: 'Wah Cantt',
    location: 'Block B, Street 14, Kohistan Enclave, Wah Cantt',
    propertyType: 'RESIDENTIAL_PLOT',
    purpose: 'BUILD',
    sizeMarla: 7,
    sizeSqFt: 1575,
    demandPrice: 9800000,   // 98 Lakhs
    marketPrice: 9600000,
    pricePerSqFt: 6222,
    pricePerMarla: 1400000,
    nocStatus: 'RDA Approved',
    devStatus: 'Fully Developed',
    possessionStatus: 'AVAILABLE',
    developmentStatus: 'DEVELOPED',
    availabilityStatus: 'AVAILABLE',
    plotNumber: 'B-184',
    sectorBlock: 'Block B',
    description: '7 Marla residential plot situated in the calm, family-friendly Block B of Kohistan Enclave. Close to mosque, community center, and main commercial gate.',
    features: [
      'Flat Solid Ground (Zero Filling)',
      'Utility Connections Ready',
      '24/7 Gated Security Patrol',
    ],
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: false,
    isHotInvestment: false,
    createdDate: '2026-09-16',
    agentName: 'Engr. Hammad Khan',
    agentPhone: '+923005987654',
  },
];

export const INVESTMENT_REPORTS: InvestmentReport[] = [
  {
    id: 'rep-1',
    slug: 'wah-cantt-real-estate-rates-analysis-2026',
    title: 'Wah Cantt Real Estate Valuation Benchmark Q3 2026',
    category: 'MARKET_ANALYSIS',
    summary: 'An empirical comparison of actual transactional rates versus advertised file prices across Kohistan Enclave, New City Phase 2, and Faisal Hills.',
    readTime: '6 min read',
    publishedDate: 'September 2026',
    author: 'Asad Ali — Managing Director',
    keyTakeaways: [
      'On-ground plots with clear NOC carry a 34% liquidity premium over unallocated file options.',
      'Kohistan Enclave Block A has demonstrated a steady 18.4% annualized appreciation backed by actual end-user house construction.',
      'Rental yields for 10 Marla and 1 Kanal modern villas in Wah Cantt now hover between 7.5% to 8.2% due to university student & faculty demand.',
    ],
    content: `
      Real estate in Wah Cantt has undergone a structural shift from speculative paper trading to utility-driven, end-user residential demand.
      
      ### Real Rates Philosophy
      Unlike inflated online portals that list non-existent files at artificially suppressed rates, Asad Land Holdings measures market value based exclusively on verified registry transfers and physical plot possession metrics.
      
      ### Capital Growth Drivers
      1. **Industrial & Educational Hub:** Wah Cantt's density of top-tier engineering and medical institutes creates guaranteed housing demand.
      2. **GT Road & M-1 Nexus:** Seamless 30-minute commuting distance to Islamabad central business district.
      3. **Infrastructure Security:** CDA, RDA, and Cantt Board regulatory approval ensures zero risk of land acquisition disputes.
    `,
  },
  {
    id: 'rep-2',
    slug: 'grey-structure-vs-turnkey-construction-costs-wah-islamabad',
    title: 'Architectural Engineering: Grey Structure vs. Turnkey Cost Matrix',
    category: 'CONSTRUCTION_METRICS',
    summary: 'Complete technical breakdown of current material costs (Steel, Cement, Bricks, Plumbing) for constructing 5 Marla, 10 Marla, and 1 Kanal luxury houses in 2026.',
    readTime: '8 min read',
    publishedDate: 'August 2026',
    author: 'Engr. Hammad Khan — Head of Engineering',
    keyTakeaways: [
      'Standard Grey Structure cost currently averages PKR 2,450 – 2,750 per SqFt.',
      'A+ Luxury Turnkey finishing ranges between PKR 4,800 – 5,600 per SqFt depending on imported marble vs porcelain tiles.',
      'Integrating 10KW Solar Net-Metering during structural layout reduces total lifetime energy operational expenses by 82%.',
    ],
    content: `
      Precision in construction pricing requires an engineering bill of quantities (BOQ) rather than ballpark estimations.
      
      ### 2026 Material Baseline (Wah / Islamabad Region)
      - **Deformed Steel Bars (Grade 60):** Calculated with zero tolerance for sub-standard gauge.
      - **OPC Cement:** Fresh batch procurement directly from Wah Cement Works.
      - **First Class Bricks (A-Awal):** Rigorous water absorption & crushing strength verified.
    `,
  },
];

import { SHORTS_DATA, ShortVideoItem } from './shorts-data';

export const STANDARD_VIDEOS_DATA: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Ground Reality Tour: Kohistan Enclave Block A Construction Progress',
    society: 'Kohistan Enclave',
    duration: '08:45',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedDate: '10 Sep 2026',
    category: 'SITE_TOUR',
    description: 'On-site walk-through showing asphalt road paving, underground gas installation, and luxury house builds currently underway in Block A Executive.',
    isShort: false,
    linkedPropertyId: 'prop-1',
    linkedSocietySlug: 'kohistan-enclave-wah',
  },
  {
    id: 'vid-2',
    title: 'New City Phase 2 Arcade & Executive Block Price Review',
    society: 'New City Phase 2',
    duration: '12:15',
    thumbnail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedDate: '05 Sep 2026',
    category: 'PRICE_ANALYSIS',
    description: 'Detailed market rate analysis comparing commercial shop rates vs residential plots near the M-1 motorway interchange.',
    isShort: false,
    linkedPropertyId: 'prop-2',
    linkedSocietySlug: 'new-city-phase-2-wah',
  },
];

export const VIDEOS_DATA: VideoItem[] = [
  ...STANDARD_VIDEOS_DATA,
  ...SHORTS_DATA.map((s) => ({
    id: s.id,
    title: s.title,
    society: s.society,
    duration: s.duration,
    thumbnail: s.thumbnail,
    videoUrl: s.videoUrl,
    youtubeId: s.videoId,
    publishedDate: s.publishedDate,
    category: s.category as any,
    description: s.description,
    isShort: true,
    aspectRatio: '9:16' as const,
    linkedPropertyId: s.linkedPropertyId,
    linkedSocietySlug: s.linkedSocietySlug,
  })),
];

import { CONSTRUCTION_SERIES_DATA, ConstructionEpisode } from './construction-series-data';

export { SHORTS_DATA, CONSTRUCTION_SERIES_DATA };
export type { ShortVideoItem, ConstructionEpisode };



export const AGENTS_DATA: AgentItem[] = [
  {
    id: 'agent-1',
    name: 'Asad Ali',
    role: 'Founder & Managing Director',
    phone: '+92 300 5123456',
    whatsapp: '923005123456',
    email: 'asad@asadlandholdings.com',
    specialization: 'Investment Advisory & High-Value Commercial Land',
    experienceYears: 14,
    bio: 'Founder of Asad Land Holdings with over 14 years of direct transaction experience in Wah Cantt, Taxila, and Islamabad real estate. Committed to transparent pricing and verified title deeds.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'agent-2',
    name: 'Engr. Hammad Khan',
    role: 'Head of Architectural Engineering & Construction',
    phone: '+92 300 5987654',
    whatsapp: '923005987654',
    email: 'engineering@asadlandholdings.com',
    specialization: 'Turnkey Construction, Structural BOQ & Villa Engineering',
    experienceYears: 10,
    bio: 'Licensed Civil Engineer overseeing turnkey residential villa design, structural integrity audits, and cost optimization for clients across Wah and Islamabad.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
];
