// Detailed architectural Master Plan & Sector Blueprint data for Wah Cantt, Taxila, and Islamabad societies
export interface SectorBlockData {
  id: string;
  code: string;
  name: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'EXECUTIVE' | 'CIVIC_AMENITY';
  ratePerMarlaPKR: number;
  possessionPct: number; // 0 to 100
  possessionStatus: '100% Fully Possessed' | '90% Rapid Construction' | 'Balloted & Developing' | 'Commercial Ready';
  totalPlots: number;
  availablePlots: number;
  plotSizes: string[];
  roadWidthFt: number;
  utilities: {
    undergroundElectricity: boolean;
    suiGas: boolean;
    waterFiltration: boolean;
    undergroundSewerage: boolean;
    opticalFiber: boolean;
    carpetedRoads: boolean;
  };
  keyFeatures: string[];
  linkedVideoId?: string; // YouTube videoId for on-ground walkthrough
  linkedVideoTitle?: string;
  svgPath: {
    type: 'polygon' | 'rect';
    points?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
  };
  colorTheme?: string;
}

export interface LandmarkAnchor {
  id: string;
  name: string;
  distanceKm: number;
  driveTimeMins: number;
  category: 'EDUCATION' | 'TRANSIT' | 'HEALTHCARE' | 'SECURITY';
  x: number;
  y: number;
}

export interface PlotDimensionLegendItem {
  name: string;
  dimension: string;
  colorHex: string;
  avgPriceRange: string;
}

export interface SocietyMasterPlan {
  id: string;
  societySlug: string;
  societyName: string;
  city: string;
  location: string;
  totalAreaAcres: number;
  totalBlocks: number;
  viewBox: string;
  mainBoulevardText: string;
  officialMapImage?: string;
  officialMapTitle?: string;
  officialDeveloper?: string;
  officialArchitect?: string;
  plotDimensionsLegend?: PlotDimensionLegendItem[];
  blocks: SectorBlockData[];
  landmarks: LandmarkAnchor[];
  description: string;
}

export const SOCIETY_MASTER_PLANS: Record<string, SocietyMasterPlan> = {
  'kohistan-enclave-wah': {
    id: 'mp-kohistan',
    societySlug: 'kohistan-enclave-wah',
    societyName: 'Kohistan Enclave',
    city: 'Wah Cantt',
    location: 'Main GT Road, Opposite Barrier Gate 1, Wah Cantt',
    totalAreaAcres: 480,
    totalBlocks: 9,
    viewBox: '0 0 1000 700',
    mainBoulevardText: '80 FT MAIN EXECUTIVE BOULEVARD • DIRECT GT ROAD ENTRANCE',
    officialMapImage: '/images/master-plans/kohistan-enclave-official-layout.jpg',
    officialMapTitle: 'PROPOSED LAYOUT PLAN OF KOHISTAN ENCLAVE',
    officialDeveloper: 'Kohistan Builders and Developers',
    officialArchitect: 'Hadi Safi & Associates (Town Planners & Architects)',
    plotDimensionsLegend: [
      { name: 'Commercial Zone', dimension: 'Plaza & Banks', colorHex: '#7B2CBF', avgPriceRange: 'PKR 3.5 Cr – 6.5 Cr' },
      { name: '2 Kanal Plots', dimension: '75\' x 120\'', colorHex: '#9B5DE5', avgPriceRange: 'PKR 3.0 Cr – 4.2 Cr' },
      { name: '1 Kanal Plots', dimension: '50\' x 90\'', colorHex: '#8B5E3C', avgPriceRange: 'PKR 1.45 Cr – 2.2 Cr' },
      { name: '14 Marla Plots', dimension: '40\' x 80\'', colorHex: '#B08968', avgPriceRange: 'PKR 1.25 Cr – 1.6 Cr' },
      { name: '10 Marla Plots', dimension: '35\' x 70\'', colorHex: '#D4A373', avgPriceRange: 'PKR 95 Lakh – 1.45 Cr' },
      { name: '8 Marla Plots', dimension: '30\' x 60\'', colorHex: '#B7B7A4', avgPriceRange: 'PKR 85 Lakh – 1.15 Cr' },
      { name: '7 Marla Plots', dimension: '30\' x 55\'', colorHex: '#A5A58D', avgPriceRange: 'PKR 75 Lakh – 98 Lakh' },
      { name: '5 Marla Plots', dimension: '25\' x 50\'', colorHex: '#E76F51', avgPriceRange: 'PKR 55 Lakh – 78 Lakh' },
      { name: '3.5 Marla / Apts', dimension: 'Compact & Studio', colorHex: '#F4A261', avgPriceRange: 'PKR 38 Lakh – 52 Lakh' },
      { name: 'Mosques & Amenities', dimension: 'Grand Jamia & Sector', colorHex: '#D90429', avgPriceRange: 'Community Amenity' },
      { name: 'Central Parks & Lake', dimension: 'Green Landscaping', colorHex: '#2A9D8F', avgPriceRange: 'Public Recreation' },
    ],
    landmarks: [
      { id: 'lm-1', name: 'Wah Medical College', distanceKm: 0.8, driveTimeMins: 2, category: 'HEALTHCARE', x: 120, y: 80 },
      { id: 'lm-2', name: 'UET Wah Campus', distanceKm: 2.2, driveTimeMins: 5, category: 'EDUCATION', x: 880, y: 90 },
      { id: 'lm-3', name: 'Wah Cantt Barrier Gate 1', distanceKm: 0.3, driveTimeMins: 1, category: 'SECURITY', x: 80, y: 320 },
      { id: 'lm-4', name: 'Brahma Bahtar Interchange M-1', distanceKm: 6.5, driveTimeMins: 10, category: 'TRANSIT', x: 920, y: 560 },
      { id: 'lm-5', name: 'Islamabad Airport M-1', distanceKm: 28.0, driveTimeMins: 25, category: 'TRANSIT', x: 860, y: 610 },
    ],
    description: 'Premier luxury township with 100% underground utilities, verified Cantt Board & RDA approvals, and direct GT road frontage.',
    blocks: [
      {
        id: 'koh-block-a',
        code: 'A',
        name: 'Block A (Executive)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1450000, // 14.5 Lakhs
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 850,
        availablePlots: 12,
        plotSizes: ['10 Marla', '1 Kanal', '2 Kanal Executive'],
        roadWidthFt: 80,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Direct frontage on 80ft Executive Boulevard',
          '100% underground electricity & operational Sui Gas',
          'Adjacent to Wah Cantt Gate 1 security barrier',
          'Highest capital appreciation zone in Wah Cantt',
        ],
        linkedVideoId: '4lRpQr0dloo',
        linkedVideoTitle: '10 Marla Luxury Villa in Block A Executive Tour',
        svgPath: {
          type: 'polygon',
          points: '160,180 340,180 330,320 150,320',
          cx: 245,
          cy: 250,
        },
        colorTheme: '#D97706',
      },
      {
        id: 'koh-civic-center',
        code: 'CC',
        name: 'Civic Commercial Center',
        category: 'COMMERCIAL',
        ratePerMarlaPKR: 3800000, // 38 Lakhs / Marla
        possessionPct: 100,
        possessionStatus: 'Commercial Ready',
        totalPlots: 180,
        availablePlots: 6,
        plotSizes: ['4 Marla Commercial', '8 Marla Plaza Plot', 'Corporate Banks'],
        roadWidthFt: 100,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Central commercial plaza hub with dedicated parking',
          'Operational retail branches, cafes, and pharmacy chains',
          'High rental yield benchmark of 8.5% p.a.',
        ],
        linkedVideoId: 'Fqk9r9Z725c',
        linkedVideoTitle: 'Kohistan Enclave Commercial & Extension Rate Review',
        svgPath: {
          type: 'polygon',
          points: '360,220 480,220 480,320 360,320',
          cx: 420,
          cy: 270,
        },
        colorTheme: '#DC2626',
      },
      {
        id: 'koh-block-b',
        code: 'B',
        name: 'Block B (Prime Residential)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1250000, // 12.5 Lakhs
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 920,
        availablePlots: 18,
        plotSizes: ['8 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Surrounded by Central Park and Grand Jamia Mosque',
          'Quiet residential avenues with 50ft & 60ft wide streets',
          'Over 350+ occupied luxury villas',
        ],
        linkedVideoId: '27ThtcJa2qE',
        linkedVideoTitle: '8 Marla House for Sale in Kohistan Enclave',
        svgPath: {
          type: 'polygon',
          points: '160,340 330,340 320,490 150,490',
          cx: 235,
          cy: 415,
        },
        colorTheme: '#2563EB',
      },
      {
        id: 'koh-block-c',
        code: 'C',
        name: 'Block C (Family Sector)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1100000, // 11 Lakhs
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 750,
        availablePlots: 15,
        plotSizes: ['5 Marla', '8 Marla', '10 Marla'],
        roadWidthFt: 50,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Affordable entry rate for 5 & 8 Marla homebuilders',
          'Dedicated primary school & sector commercial market',
          'High demand for medical university faculty rentals',
        ],
        linkedVideoId: 'FDTeUYMOxC0',
        linkedVideoTitle: '5 Marla Luxury House Complete Tour in Kohistan',
        svgPath: {
          type: 'polygon',
          points: '350,340 480,340 480,490 340,490',
          cx: 410,
          cy: 415,
        },
        colorTheme: '#10B981',
      },
      {
        id: 'koh-block-d',
        code: 'D',
        name: 'Block D (Lakeside Sector)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1050000,
        possessionPct: 95,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 680,
        availablePlots: 22,
        plotSizes: ['7 Marla', '10 Marla', '1 Kanal Lakeside'],
        roadWidthFt: 50,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Overlooks the central community lake and walking track',
          'Underground gas lines fully commissioned',
          '18.4% 3-year compound annual capital appreciation',
        ],
        linkedVideoId: 'bbIiHrNbhyU',
        linkedVideoTitle: '13 Marla Plot Tour & Ground Update in Kohistan',
        svgPath: {
          type: 'polygon',
          points: '500,180 660,180 650,320 500,320',
          cx: 575,
          cy: 250,
        },
        colorTheme: '#06B6D4',
      },
      {
        id: 'koh-block-f',
        code: 'F',
        name: 'Block F (Garden District)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1180000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 620,
        availablePlots: 11,
        plotSizes: ['8.4 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Known for designer villas with indoor courtyards and lawns',
          'Underground sewerage and high-voltage power backup',
          'Immediate construction clearance from Cantonment Board',
        ],
        linkedVideoId: 'Mw6CWP_dIMo',
        linkedVideoTitle: '8.4 Marla House with Indoor Lawn in Block F',
        svgPath: {
          type: 'polygon',
          points: '500,340 660,340 650,490 490,490',
          cx: 575,
          cy: 415,
        },
        colorTheme: '#8B5CF6',
      },
      {
        id: 'koh-block-i',
        code: 'I',
        name: 'Block I (New Executive Heights)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 980000,
        possessionPct: 90,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 890,
        availablePlots: 28,
        plotSizes: ['5 Marla', '7 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'High elevation sector with scenic mountain views of Margalla range',
          'High development velocity with multiple active grey structures',
          'Ideal high-growth investment horizon for 2026-2028',
        ],
        linkedVideoId: 'Z7e_r06Zyu8',
        linkedVideoTitle: 'Kohistan Enclave I Block Full Tour & Investment Potential',
        svgPath: {
          type: 'polygon',
          points: '680,180 850,180 840,330 670,330',
          cx: 760,
          cy: 255,
        },
        colorTheme: '#EC4899',
      },
      {
        id: 'koh-block-g',
        code: 'G',
        name: 'Block G (North Crest View)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1150000,
        possessionPct: 95,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 710,
        availablePlots: 16,
        plotSizes: ['10 Marla', '1 Kanal', '2 Kanal Hilltop'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Highest elevation in Kohistan Enclave master plan',
          'Panoramic views overlooking Wah Cantt valley',
          'Preferred sector for luxury 1 & 2 Kanal architectural mansions',
        ],
        linkedVideoId: 'Mw6CWP_dIMo',
        linkedVideoTitle: 'Kohistan Enclave Block G & Heights Mansions Tour',
        svgPath: {
          type: 'polygon',
          points: '215,90 350,90 340,225 200,225',
          cx: 275,
          cy: 155,
        },
        colorTheme: '#8B5CF6',
      },
      {
        id: 'koh-block-e',
        code: 'E',
        name: 'Block E (Northeast Executive)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1120000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 580,
        availablePlots: 14,
        plotSizes: ['8 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Direct linkage with central water stream & walking promenade',
          'Over 85% constructed and inhabited luxury homes',
          'Dedicated sector park and commercial provisions',
        ],
        linkedVideoId: '27ThtcJa2qE',
        linkedVideoTitle: 'Block E Executive Villa & Street Tour in Kohistan',
        svgPath: {
          type: 'polygon',
          points: '550,350 675,350 665,485 540,485',
          cx: 605,
          cy: 415,
        },
        colorTheme: '#06B6D4',
      },
      {
        id: 'koh-ext-4',
        code: 'EXT-4',
        name: 'Extension 4 & P-Blocks (Future Expansion)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 650000, // 6.5 Lakhs
        possessionPct: 65,
        possessionStatus: 'Balloted & Developing',
        totalPlots: 1400,
        availablePlots: 45,
        plotSizes: ['5 Marla', '8 Marla', '10 Marla File & Plot'],
        roadWidthFt: 50,
        utilities: {
          undergroundElectricity: true,
          suiGas: false, // In progress
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: false, // Sub-base complete
        },
        keyFeatures: [
          'Lowest entry rate per Marla in Kohistan master plan',
          'Demarcated southern pocket with independent access corridor',
          'Projected 35%+ capital gain upon road asphalt completion',
        ],
        linkedVideoId: 'PCZ3L4e7mCU',
        linkedVideoTitle: 'Kohistan Enclave Extension 4 Balloting Update & Details',
        svgPath: {
          type: 'polygon',
          points: '390,570 530,570 520,680 380,680',
          cx: 455,
          cy: 625,
        },
        colorTheme: '#F59E0B',
      },
    ],
  },

  'new-city-phase-2-wah': {
    id: 'mp-new-city',
    societySlug: 'new-city-phase-2-wah',
    societyName: 'New City Phase 2',
    city: 'Wah Cantt',
    location: 'Near M-1 Motorway Interchange, Wah Cantt',
    totalAreaAcres: 950,
    totalBlocks: 6,
    viewBox: '0 0 1000 650',
    mainBoulevardText: '120 FT DUAL CARRIAGEWAY • DIRECT MOTORWAY ACCESS',
    landmarks: [
      { id: 'nc-lm-1', name: 'M-1 Motorway Interchange', distanceKm: 1.2, driveTimeMins: 3, category: 'TRANSIT', x: 80, y: 150 },
      { id: 'nc-lm-2', name: 'Commercial Arcade 1 & 2', distanceKm: 0.2, driveTimeMins: 1, category: 'EDUCATION', x: 420, y: 260 },
      { id: 'nc-lm-3', name: 'Wah Engineering University', distanceKm: 4.5, driveTimeMins: 8, category: 'EDUCATION', x: 890, y: 120 },
      { id: 'nc-lm-4', name: 'Islamabad Zero Point', distanceKm: 34.0, driveTimeMins: 30, category: 'TRANSIT', x: 920, y: 580 },
    ],
    description: 'Mega self-sustained township with direct M-1 motorway connectivity, commercial arcades, and active possession.',
    blocks: [
      {
        id: 'nc-arcade',
        code: 'ARCADE',
        name: 'Commercial Arcade 1 & 2',
        category: 'COMMERCIAL',
        ratePerMarlaPKR: 4200000,
        possessionPct: 100,
        possessionStatus: 'Commercial Ready',
        totalPlots: 350,
        availablePlots: 9,
        plotSizes: ['4 Marla Commercial', '8 Marla Plaza'],
        roadWidthFt: 120,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'High-density commercial market with mega supermarkets and brand outlets',
          '8.2% annual commercial rental yield',
          'Direct frontage on main M-1 approach road',
        ],
        linkedVideoId: 'vid-2',
        linkedVideoTitle: 'New City Phase 2 Arcade & Executive Price Review',
        svgPath: {
          type: 'polygon',
          points: '380,200 540,200 540,320 380,320',
          cx: 460,
          cy: 260,
        },
        colorTheme: '#DC2626',
      },
      {
        id: 'nc-exec',
        code: 'EXEC',
        name: 'Executive Block (Luxury Villas)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1200000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 1200,
        availablePlots: 24,
        plotSizes: ['10 Marla', '1 Kanal Designer Villas'],
        roadWidthFt: 80,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Premium residential sector with gated security',
          'Underground utilities & backup generator grid',
          'High concentration of overseas Pakistani designer homes',
        ],
        linkedVideoId: 'vid-short-2',
        linkedVideoTitle: '1 Kanal Designer Villa in New City Executive Block',
        svgPath: {
          type: 'polygon',
          points: '160,180 350,180 350,330 160,330',
          cx: 255,
          cy: 255,
        },
        colorTheme: '#D97706',
      },
      {
        id: 'nc-block-a',
        code: 'A',
        name: 'Block A (Main Boulevard)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1050000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 1100,
        availablePlots: 21,
        plotSizes: ['7 Marla', '10 Marla'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Immediate house construction rights',
          'Walking distance to Central Park and City School campus',
          '100% Sui Gas network installed',
        ],
        svgPath: {
          type: 'polygon',
          points: '160,360 350,360 350,510 160,510',
          cx: 255,
          cy: 435,
        },
        colorTheme: '#2563EB',
      },
      {
        id: 'nc-block-b',
        code: 'B',
        name: 'Block B (Sector Hub)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 950000,
        possessionPct: 95,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 980,
        availablePlots: 26,
        plotSizes: ['5 Marla', '8 Marla', '10 Marla'],
        roadWidthFt: 50,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Popular sector for 5 & 8 Marla starter homes',
          'Active commercial pocket with grocery and pharmacy',
          'Strong demand from Wah & Taxila industrial professionals',
        ],
        svgPath: {
          type: 'polygon',
          points: '380,360 540,360 540,510 380,510',
          cx: 460,
          cy: 435,
        },
        colorTheme: '#10B981',
      },
      {
        id: 'nc-overseas',
        code: 'OVS',
        name: 'Overseas Block',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1150000,
        possessionPct: 90,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 1350,
        availablePlots: 32,
        plotSizes: ['10 Marla', '1 Kanal', '2 Kanal'],
        roadWidthFt: 70,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Dedicated sector engineered for non-resident Pakistanis',
          'Lush central theme park with sporting facilities',
          'Strict architectural elevation bylaws',
        ],
        svgPath: {
          type: 'polygon',
          points: '570,180 820,180 820,330 570,330',
          cx: 695,
          cy: 255,
        },
        colorTheme: '#8B5CF6',
      },
      {
        id: 'nc-block-c',
        code: 'C',
        name: 'Block C (Investment Sector)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 820000,
        possessionPct: 80,
        possessionStatus: 'Balloted & Developing',
        totalPlots: 1500,
        availablePlots: 40,
        plotSizes: ['5 Marla', '7 Marla', '10 Marla'],
        roadWidthFt: 50,
        utilities: {
          undergroundElectricity: true,
          suiGas: false,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'High appreciation upside as gas line extension nears completion',
          'Clean RDA approved NOC title',
          'Low entry ticket price per plot',
        ],
        svgPath: {
          type: 'polygon',
          points: '570,360 820,360 820,510 570,510',
          cx: 695,
          cy: 435,
        },
        colorTheme: '#06B6D4',
      },
    ],
  },
  'multi-gardens-b17-islamabad': {
    id: 'mp-b17',
    societySlug: 'multi-gardens-b17-islamabad',
    societyName: 'Multi Gardens B-17',
    city: 'Islamabad',
    location: 'Zone 2, Main GT Road & M-1 Motorway Link, Islamabad',
    totalAreaAcres: 1600,
    totalBlocks: 7,
    viewBox: '0 0 1000 650',
    mainBoulevardText: '150 FT CENTRAL EXPRESSWAY • DIRECT M-1 INTERCHANGE & GT ROAD',
    landmarks: [
      { id: 'b17-lm-1', name: 'M-1 Motorway B-17 Interchange', distanceKm: 1.5, driveTimeMins: 3, category: 'TRANSIT', x: 100, y: 120 },
      { id: 'b17-lm-2', name: 'Multi Mall & Lake View Park', distanceKm: 0.5, driveTimeMins: 2, category: 'HEALTHCARE', x: 490, y: 270 },
      { id: 'b17-lm-3', name: 'Islamabad International Airport', distanceKm: 18.0, driveTimeMins: 18, category: 'TRANSIT', x: 880, y: 560 },
      { id: 'b17-lm-4', name: 'Zero Point Islamabad', distanceKm: 28.0, driveTimeMins: 25, category: 'TRANSIT', x: 920, y: 110 },
    ],
    description: 'CDA-approved master-planned community in Islamabad Zone 2 featuring artificial lakes, wide arterial boulevards, and high commercial liquidity.',
    blocks: [
      {
        id: 'b17-block-a',
        code: 'A',
        name: 'Block A (Main Boulevard)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1950000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 1200,
        availablePlots: 14,
        plotSizes: ['10 Marla', '1 Kanal', '2 Kanal'],
        roadWidthFt: 100,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Immediate entry point from GT Road N-5',
          '100% occupied with high-end designer houses',
          'CDA regularized utilities and commercial centers',
        ],
        linkedVideoId: 'vid-3',
        linkedVideoTitle: 'Multi Gardens B-17 Sector A Rate & Ground Review',
        svgPath: {
          type: 'polygon',
          points: '150,180 320,180 320,320 150,320',
          cx: 235,
          cy: 250,
        },
        colorTheme: '#D97706',
      },
      {
        id: 'b17-block-b',
        code: 'B',
        name: 'Block B (Lake District)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1800000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 1400,
        availablePlots: 19,
        plotSizes: ['8 Marla', '10 Marla', '1 Kanal Lakeside'],
        roadWidthFt: 80,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Surrounds the scenic central lake and community sports complex',
          'Very strong rental demand from Islamabad diplomats & corporate professionals',
          'Underground utilities & 24/7 security patrol',
        ],
        svgPath: {
          type: 'polygon',
          points: '150,340 320,340 320,490 150,490',
          cx: 235,
          cy: 415,
        },
        colorTheme: '#2563EB',
      },
      {
        id: 'b17-block-c',
        code: 'C',
        name: 'Block C (Central Markaz)',
        category: 'COMMERCIAL',
        ratePerMarlaPKR: 4500000,
        possessionPct: 100,
        possessionStatus: 'Commercial Ready',
        totalPlots: 450,
        availablePlots: 8,
        plotSizes: ['4 Marla', '8 Marla Commercial', 'Multi Mall Plots'],
        roadWidthFt: 150,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'The premier commercial hub of Sector B-17',
          'Multi-storey commercial plazas, bank branches, and high-street dining',
          'Unrivaled commercial rental returns of 9% p.a.',
        ],
        svgPath: {
          type: 'polygon',
          points: '340,220 480,220 480,330 340,330',
          cx: 410,
          cy: 275,
        },
        colorTheme: '#DC2626',
      },
      {
        id: 'b17-block-d',
        code: 'D',
        name: 'Block D (Family Enclave)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1650000,
        possessionPct: 100,
        possessionStatus: '100% Fully Possessed',
        totalPlots: 1100,
        availablePlots: 16,
        plotSizes: ['5 Marla', '8 Marla', '10 Marla'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'High concentration of compact 5 & 8 Marla modern houses',
          'Walking distance to Sector D Mosque and community school',
          'Fast title transfer at MPCHS head office',
        ],
        svgPath: {
          type: 'polygon',
          points: '340,350 480,350 480,500 340,500',
          cx: 410,
          cy: 425,
        },
        colorTheme: '#10B981',
      },
      {
        id: 'b17-block-e',
        code: 'E',
        name: 'Block E (Motorway Corridor)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1500000,
        possessionPct: 95,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 1600,
        availablePlots: 31,
        plotSizes: ['7 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 70,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Direct connectivity to the new M-1 Motorway interchange',
          'Rapid ongoing residential construction',
          'Underground electricity and water supply fully operational',
        ],
        svgPath: {
          type: 'polygon',
          points: '500,180 670,180 670,330 500,330',
          cx: 585,
          cy: 255,
        },
        colorTheme: '#8B5CF6',
      },
      {
        id: 'b17-block-f',
        code: 'F',
        name: 'Block F (High Growth Sector)',
        category: 'EXECUTIVE',
        ratePerMarlaPKR: 1350000,
        possessionPct: 90,
        possessionStatus: '90% Rapid Construction',
        totalPlots: 2100,
        availablePlots: 42,
        plotSizes: ['8 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: true,
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Huge upside potential with new link road connection',
          'Extensive green spaces and hill views',
          'High demand for mid-term capital investment',
        ],
        svgPath: {
          type: 'polygon',
          points: '500,350 670,350 670,500 500,500',
          cx: 585,
          cy: 425,
        },
        colorTheme: '#06B6D4',
      },
      {
        id: 'b17-block-g',
        code: 'G',
        name: 'Block G (Multi Residia & Margalla Views)',
        category: 'RESIDENTIAL',
        ratePerMarlaPKR: 1100000,
        possessionPct: 80,
        possessionStatus: 'Balloted & Developing',
        totalPlots: 2400,
        availablePlots: 55,
        plotSizes: ['5 Marla', '8 Marla', '10 Marla', '1 Kanal'],
        roadWidthFt: 60,
        utilities: {
          undergroundElectricity: true,
          suiGas: false, // in development
          waterFiltration: true,
          undergroundSewerage: true,
          opticalFiber: true,
          carpetedRoads: true,
        },
        keyFeatures: [
          'Nearest sector to Margalla Avenue extension',
          'Best value entry price in CDA Zone 2',
          'Ideal 2-3 year medium-term investment holding',
        ],
        svgPath: {
          type: 'polygon',
          points: '690,200 850,200 850,470 690,470',
          cx: 770,
          cy: 335,
        },
        colorTheme: '#EC4899',
      },
    ],
  },
};

