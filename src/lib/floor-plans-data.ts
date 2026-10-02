// Standardized Architectural 2D / 3D Floor Plans and CAD Layout Catalog for Wah Cantt & Islamabad
export interface RoomDimensionItem {
  roomName: string;
  dimensionFt: string; // e.g. "14' × 16'"
  areaSqFt: number;
  floor: 'GROUND' | 'FIRST' | 'BASEMENT' | 'ROOFTOP';
  features: string[];
}

export interface FloorPlanItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  plotSizeCategory: '5_MARLA' | '7_MARLA' | '8_MARLA' | '10_MARLA' | '1_KANAL';
  plotDimensions: string; // e.g. "25' × 45'", "35' × 70'"
  architecturalStyle: 'MINIMALIST_CUBIC' | 'CONTEMPORARY_VILLA' | 'SPANISH_MEDITERRANEAN' | 'INDEPENDENT_DUPLEX' | 'ROYAL_PRESIDENTIAL';
  styleLabel: string;
  totalCoveredAreaSqFt: number;
  groundFloorCoveredAreaSqFt: number;
  firstFloorCoveredAreaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  carPorchCapacity: '1 Sedan' | '2 SUVs' | '3-4 Luxury Cars';
  carPorchCount: number;
  kitchensCount: number;
  hasServantQuarter: boolean;
  hasPowderRoom: boolean;
  hasDirtyKitchen: boolean;
  hasIndoorCourtyard: boolean;
  hasTerraceBalcony: boolean;
  
  // Images
  elevation3dRender: string;
  gallery: string[];
  
  // Engineering & Turnkey BOQ Costs (PKR 2026 empirical rates)
  boqCostEstimates: {
    greyStructureRatePerSqFt: number;
    greyStructureTotalPKR: number;
    premiumFinishingRatePerSqFt: number;
    premiumFinishingTotalPKR: number;
    executiveSignatureRatePerSqFt: number;
    executiveSignatureTotalPKR: number;
  };

  // Environmental & Spatial Analytics
  spatialAnalysis: {
    naturalLightScore: number; // out of 10
    crossVentilationScore: number; // out of 10
    circulationEfficiencyPct: number; // e.g. 88%
    otsVentilationShaftsCount: number;
    ventilationDescription: string;
  };

  roomDimensions: RoomDimensionItem[];
  suitableSocieties: string[];
  description: string;
  keyHighlights: string[];
  architectRemarks: string;
  leadArchitect: string;
  linkedConstructionSeriesEpisodeId?: string;
}

export const FLOOR_PLANS_DATA: FloorPlanItem[] = [
  // ---------------------------------------------------------------------------
  // 1. 5 MARLA (25' × 45') - THE MINIMALIST NORDIC CUBIC VILLA
  // ---------------------------------------------------------------------------
  {
    id: 'fp-5m-nordic',
    slug: '5-marla-modern-nordic-cubic-villa',
    title: '5 Marla Modern Nordic Cubic Villa',
    subtitle: 'Optimized 3-Bed Family Layout with Open Island Kitchen & Sunlit OTS',
    plotSizeCategory: '5_MARLA',
    plotDimensions: "25' × 45'",
    architecturalStyle: 'MINIMALIST_CUBIC',
    styleLabel: 'Minimalist Nordic Cubic',
    totalCoveredAreaSqFt: 2150,
    groundFloorCoveredAreaSqFt: 1050,
    firstFloorCoveredAreaSqFt: 1100,
    bedrooms: 3,
    bathrooms: 4,
    carPorchCapacity: '1 Sedan',
    carPorchCount: 1,
    kitchensCount: 2,
    hasServantQuarter: false,
    hasPowderRoom: true,
    hasDirtyKitchen: false,
    hasIndoorCourtyard: true,
    hasTerraceBalcony: true,
    elevation3dRender: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    ],
    boqCostEstimates: {
      greyStructureRatePerSqFt: 2450,
      greyStructureTotalPKR: 5267500, // ~52.6 Lakh
      premiumFinishingRatePerSqFt: 4600,
      premiumFinishingTotalPKR: 9890000, // ~98.9 Lakh
      executiveSignatureRatePerSqFt: 5800,
      executiveSignatureTotalPKR: 12470000, // ~1.24 Crore
    },
    spatialAnalysis: {
      naturalLightScore: 9.4,
      crossVentilationScore: 9.2,
      circulationEfficiencyPct: 91,
      otsVentilationShaftsCount: 2,
      ventilationDescription: 'Dual-shaft Open-To-Sky (OTS) air corridor creates a natural thermal chimney effect, purging warm air from ground floor lounge through rooftop skylight.',
    },
    roomDimensions: [
      { roomName: 'Car Porch', dimensionFt: "14'0\" × 12'6\"", areaSqFt: 175, floor: 'GROUND', features: ['Fits 1 full sedan', 'Underground water tank access'] },
      { roomName: 'Drawing Room', dimensionFt: "12'0\" × 14'0\"", areaSqFt: 168, floor: 'GROUND', features: ['Separate street entrance', 'Attached powder room'] },
      { roomName: 'Living & TV Lounge', dimensionFt: "14'6\" × 16'0\"", areaSqFt: 232, floor: 'GROUND', features: ['Double volume feel', 'Floating wooden staircase'] },
      { roomName: 'Open Kitchen & Island', dimensionFt: "9'0\" × 11'6\"", areaSqFt: 103, floor: 'GROUND', features: ['Quartz island countertop', 'Concealed exhaust ducting'] },
      { roomName: 'Master Bedroom (Ground)', dimensionFt: "12'0\" × 14'6\"", areaSqFt: 174, floor: 'GROUND', features: ['Attached luxury bath 6x7', 'Walk-in wardrobe recess'] },
      { roomName: 'Rear Open OTS & Laundry', dimensionFt: "5'0\" × 12'0\"", areaSqFt: 60, floor: 'GROUND', features: ['Washing machine drainage', 'Cross ventilation'] },
      { roomName: 'Bedroom 2 (First Floor)', dimensionFt: "12'0\" × 14'0\"", areaSqFt: 168, floor: 'FIRST', features: ['Front garden balcony access', 'Attached bath'] },
      { roomName: 'Bedroom 3 (First Floor)', dimensionFt: "12'0\" × 14'6\"", areaSqFt: 174, floor: 'FIRST', features: ['Rear OTS view', 'En-suite bathroom'] },
      { roomName: 'First Floor Family Lounge', dimensionFt: "14'6\" × 12'0\"", areaSqFt: 174, floor: 'FIRST', features: ['Coffee kitchenette bar', 'Overlooks ground stairwell'] },
      { roomName: 'Front Sunset Terrace', dimensionFt: "14'0\" × 8'0\"", areaSqFt: 112, floor: 'FIRST', features: ['Tempered glass railing', 'Outdoor seating'] },
    ],
    suitableSocieties: ['Kohistan Enclave (Block C & D)', 'New City Phase 2 (Block B & C)', 'Multi Gardens B-17 (Sector D & G)'],
    description: 'Masterfully engineered for 5 Marla (25×45) plots in Wah Cantt and Islamabad. Eliminates cramped hallways by utilizing an open-concept great room, expansive rear OTS, and cantilevered first-floor bedrooms.',
    keyHighlights: [
      'Zero wasted hallway space with 91% circulation efficiency',
      'Dual OTS shafts ensuring every bathroom & kitchen has direct exterior ventilation',
      'Accommodates 1 full-size sedan in porch with independent drawing room access',
      'Turnkey construction cost under PKR 1 Crore for premium finish',
    ],
    architectRemarks: 'Designed strictly compliant with Cantonment Board and RDA front/rear setback bylaws (5ft rear, 5ft front).',
    leadArchitect: 'Engr. Hammad Khan (Head of Architectural Engineering)',
    linkedConstructionSeriesEpisodeId: 'ep-2',
  },

  // ---------------------------------------------------------------------------
  // 2. 7 / 8 MARLA (30' × 60') - THE CONTEMPORARY CANTILEVER COURTYARD VILLA
  // ---------------------------------------------------------------------------
  {
    id: 'fp-8m-cantilever',
    slug: '8-marla-contemporary-cantilever-courtyard-villa',
    title: '8 Marla Contemporary Cantilever Courtyard Villa',
    subtitle: '4-Bed Executive Home with 2-SUV Parking, Dirty Kitchen & Internal Green Courtyard',
    plotSizeCategory: '8_MARLA',
    plotDimensions: "30' × 60'",
    architecturalStyle: 'CONTEMPORARY_VILLA',
    styleLabel: 'Contemporary Cantilever',
    totalCoveredAreaSqFt: 3200,
    groundFloorCoveredAreaSqFt: 1550,
    firstFloorCoveredAreaSqFt: 1650,
    bedrooms: 4,
    bathrooms: 5,
    carPorchCapacity: '2 SUVs',
    carPorchCount: 2,
    kitchensCount: 3, // Main + Dirty + Kitchenette
    hasServantQuarter: true,
    hasPowderRoom: true,
    hasDirtyKitchen: true,
    hasIndoorCourtyard: true,
    hasTerraceBalcony: true,
    elevation3dRender: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    ],
    boqCostEstimates: {
      greyStructureRatePerSqFt: 2450,
      greyStructureTotalPKR: 7840000, // ~78.4 Lakh
      premiumFinishingRatePerSqFt: 4600,
      premiumFinishingTotalPKR: 14720000, // ~1.47 Crore
      executiveSignatureRatePerSqFt: 5800,
      executiveSignatureTotalPKR: 18560000, // ~1.85 Crore
    },
    spatialAnalysis: {
      naturalLightScore: 9.7,
      crossVentilationScore: 9.6,
      circulationEfficiencyPct: 89,
      otsVentilationShaftsCount: 3,
      ventilationDescription: 'Central glass-enclosed indoor garden courtyard channels sunlight into both ground-floor dining and first-floor family gallery simultaneously.',
    },
    roomDimensions: [
      { roomName: 'Dual Car Porch', dimensionFt: "18'0\" × 15'6\"", areaSqFt: 279, floor: 'GROUND', features: ['Parks 2 full Fortuner/Prado SUVs', 'EV charging provision'] },
      { roomName: 'Formal Drawing & Dining', dimensionFt: "14'0\" × 20'0\"", areaSqFt: 280, floor: 'GROUND', features: ['Solid ash wood double doors', 'Powder room'] },
      { roomName: 'Grand TV Lounge', dimensionFt: "17'0\" × 18'6\"", areaSqFt: 314, floor: 'GROUND', features: ['Frameless glass view of courtyard', 'Recessed media wall'] },
      { roomName: 'Main Show Kitchen', dimensionFt: "11'0\" × 13'0\"", areaSqFt: 143, floor: 'GROUND', features: ['Corian countertop', 'Breakfast bar connecting to lounge'] },
      { roomName: 'Dedicated Dirty / Spice Kitchen', dimensionFt: "6'6\" × 11'0\"", areaSqFt: 71, floor: 'GROUND', features: ['Heavy commercial exhaust', 'Separate service entry'] },
      { roomName: 'Ground Master Bed Suite', dimensionFt: "14'0\" × 16'0\"", areaSqFt: 224, floor: 'GROUND', features: ['Dress lobby 6x8', 'Shower cabin luxury bath 8x8'] },
      { roomName: 'Internal Green Courtyard', dimensionFt: "8'0\" × 10'0\"", areaSqFt: 80, floor: 'GROUND', features: ['Skylight with indoor planters', 'Rainwater collector'] },
      { roomName: 'First Floor Master Suite 2', dimensionFt: "14'0\" × 16'6\"", areaSqFt: 231, floor: 'FIRST', features: ['Walk-in closet', 'Jacuzzi bathtub bathroom'] },
      { roomName: 'Bedroom 3 & 4 (First)', dimensionFt: "13'0\" × 14'0\" each", areaSqFt: 364, floor: 'FIRST', features: ['En-suite baths', 'Direct balcony access'] },
      { roomName: 'Rooftop Servant Quarter', dimensionFt: "10'0\" × 11'0\"", areaSqFt: 110, floor: 'FIRST', features: ['Separate external spiral stair entry', 'Attached bath'] },
    ],
    suitableSocieties: ['Kohistan Enclave (Block B & F)', 'New City Phase 2 (Executive & Block A)', 'Multi Gardens B-17 (Sector B & C)'],
    description: 'The definitive architectural blueprint for 8 Marla (30×60) luxury homebuilding in Wah Cantt. Incorporates a 2-SUV porch, separate spice kitchen, internal open courtyard, and dedicated rooftop servant quarters.',
    keyHighlights: [
      'Spacious 18ft wide porch comfortably fits 2 large SUVs side-by-side',
      'Separate spice/dirty kitchen keeps main living area odorless during cooking',
      'Central glass-encased courtyard providing 360-degree natural sunlight',
      '4 full master bedroom suites each with attached luxury washrooms',
    ],
    architectRemarks: 'Engineered with 9-inch loadbearing brick perimeter and RCC frame cantilever to eliminate ground-floor interior pillars.',
    leadArchitect: 'Engr. Hammad Khan & Asad Ali',
    linkedConstructionSeriesEpisodeId: 'ep-6',
  },

  // ---------------------------------------------------------------------------
  // 3. 10 MARLA (35' × 70') - THE EXECUTIVE MONOLITHIC VILLA
  // ---------------------------------------------------------------------------
  {
    id: 'fp-10m-executive',
    slug: '10-marla-executive-monolithic-villa',
    title: '10 Marla Executive Monolithic Villa',
    subtitle: '5-Bed Architectural Masterpiece with Double-Height Lobby, 2-SUV Port & Servant Suite',
    plotSizeCategory: '10_MARLA',
    plotDimensions: "35' × 70'",
    architecturalStyle: 'CONTEMPORARY_VILLA',
    styleLabel: 'Monolithic Executive',
    totalCoveredAreaSqFt: 3950,
    groundFloorCoveredAreaSqFt: 1950,
    firstFloorCoveredAreaSqFt: 2000,
    bedrooms: 5,
    bathrooms: 6,
    carPorchCapacity: '2 SUVs',
    carPorchCount: 2,
    kitchensCount: 3,
    hasServantQuarter: true,
    hasPowderRoom: true,
    hasDirtyKitchen: true,
    hasIndoorCourtyard: true,
    hasTerraceBalcony: true,
    elevation3dRender: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    ],
    boqCostEstimates: {
      greyStructureRatePerSqFt: 2450,
      greyStructureTotalPKR: 9677500, // ~96.7 Lakh
      premiumFinishingRatePerSqFt: 4600,
      premiumFinishingTotalPKR: 18170000, // ~1.81 Crore
      executiveSignatureRatePerSqFt: 5800,
      executiveSignatureTotalPKR: 22910000, // ~2.29 Crore
    },
    spatialAnalysis: {
      naturalLightScore: 9.8,
      crossVentilationScore: 9.7,
      circulationEfficiencyPct: 92,
      otsVentilationShaftsCount: 4,
      ventilationDescription: '22ft high double-volume lobby features motorized clerestory windows for continuous passive ventilation, maintaining cool indoor temperatures in summer.',
    },
    roomDimensions: [
      { roomName: 'Executive 2-Car Porch & Front Lawn', dimensionFt: "20'0\" × 18'0\"", areaSqFt: 360, floor: 'GROUND', features: ['Parks 2 Land Cruisers', 'Front green grass strip 8x15'] },
      { roomName: 'Double-Height Grand Foyer', dimensionFt: "12'0\" × 14'0\"", areaSqFt: 168, floor: 'GROUND', features: ['22ft ceiling height', 'Italian marble lobby'] },
      { roomName: 'Executive Drawing & Dining', dimensionFt: "15'0\" × 22'0\"", areaSqFt: 330, floor: 'GROUND', features: ['Corner fireplace', 'Powder room with Grohe fittings'] },
      { roomName: 'Sprawling TV Lounge & Dining', dimensionFt: "20'0\" × 22'0\"", areaSqFt: 440, floor: 'GROUND', features: ['Integrated audio wiring', 'French windows to rear lawn'] },
      { roomName: 'Open Chef Kitchen & Dirty Kitchen', dimensionFt: "14'0\" × 16'0\"", areaSqFt: 224, floor: 'GROUND', features: ['Island hob', 'Pantry store 6x8', 'Dirty kitchen'] },
      { roomName: 'Ground Master Bed Suite', dimensionFt: "15'0\" × 17'0\"", areaSqFt: 255, floor: 'GROUND', features: ['Walk-in dressing room', 'Spa bath 9x10 with rain shower'] },
      { roomName: 'First Floor Presidential Master', dimensionFt: "16'0\" × 18'0\"", areaSqFt: 288, floor: 'FIRST', features: ['Private balcony terrace', 'Walk-in walk-through wardrobe'] },
      { roomName: 'Bedroom 3, 4 & 5 (First)', dimensionFt: "14'0\" × 15'0\" each", areaSqFt: 630, floor: 'FIRST', features: ['Attached baths', 'Built-in study nooks'] },
      { roomName: 'Upper Living Gallery Lounge', dimensionFt: "16'0\" × 18'0\"", areaSqFt: 288, floor: 'FIRST', features: ['Overlooks double height entrance lobby'] },
      { roomName: 'Servant Suite with Attached Bath', dimensionFt: "10'0\" × 12'0\"", areaSqFt: 120, floor: 'FIRST', features: ['Dedicated rear service staircase'] },
    ],
    suitableSocieties: ['Kohistan Enclave (Block A Executive)', 'New City Phase 2 (Executive Block)', 'Multi Gardens B-17 (Sector A & B)'],
    description: 'The flagship 10 Marla (35×70) architectural villa engineered for overseas Pakistani investors and high-profile executives. Features a soaring 22ft double-height lobby, 5 en-suite bedrooms, and full smart home wiring.',
    keyHighlights: [
      '22ft double-height entrance foyer with grand suspended chandelier anchor',
      '5 spacious master bedrooms — 2 on ground floor, 3 on first floor',
      'Dual car porch with independent wide front lawn for outdoor tea/BBQ',
      'Dedicated servant quarter with private rear access preserving family privacy',
    ],
    architectRemarks: 'Structural design calculated with seismic Zone 2B reinforcement standards and Grade 60 deformed rebar.',
    leadArchitect: 'Engr. Hammad Khan & Asad Ali',
    linkedConstructionSeriesEpisodeId: 'ep-12',
  },

  // ---------------------------------------------------------------------------
  // 4. 1 KANAL (50' × 90') - THE ROYAL PRESIDENTIAL ESTATE
  // ---------------------------------------------------------------------------
  {
    id: 'fp-1k-royal',
    slug: '1-kanal-royal-presidential-estate',
    title: '1 Kanal Royal Presidential Estate',
    subtitle: '6-Bed Ultra-Luxury Mansion with 4-Car Port, Swimming Pool / Back Lawn & Home Cinema',
    plotSizeCategory: '1_KANAL',
    plotDimensions: "50' × 90'",
    architecturalStyle: 'ROYAL_PRESIDENTIAL',
    styleLabel: 'Royal Presidential Estate',
    totalCoveredAreaSqFt: 6200,
    groundFloorCoveredAreaSqFt: 3100,
    firstFloorCoveredAreaSqFt: 3100,
    bedrooms: 6,
    bathrooms: 7,
    carPorchCapacity: '3-4 Luxury Cars',
    carPorchCount: 4,
    kitchensCount: 4,
    hasServantQuarter: true,
    hasPowderRoom: true,
    hasDirtyKitchen: true,
    hasIndoorCourtyard: true,
    hasTerraceBalcony: true,
    elevation3dRender: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
    ],
    boqCostEstimates: {
      greyStructureRatePerSqFt: 2450,
      greyStructureTotalPKR: 15190000, // ~1.51 Crore
      premiumFinishingRatePerSqFt: 4600,
      premiumFinishingTotalPKR: 28520000, // ~2.85 Crore
      executiveSignatureRatePerSqFt: 5800,
      executiveSignatureTotalPKR: 35960000, // ~3.59 Crore
    },
    spatialAnalysis: {
      naturalLightScore: 9.9,
      crossVentilationScore: 9.8,
      circulationEfficiencyPct: 94,
      otsVentilationShaftsCount: 4,
      ventilationDescription: 'Expansive 50ft frontage with wrap-around side green belts (7ft each side) allowing 360-degree natural cross breeze and floor-to-ceiling glass ventilation.',
    },
    roomDimensions: [
      { roomName: '4-Car Grand Portico & Side Driveway', dimensionFt: "26'0\" × 24'0\"", areaSqFt: 624, floor: 'GROUND', features: ['Fits 4 full SUVs', 'Grand arched portico entrance'] },
      { roomName: 'Formal Drawing Room & Banquet Dining', dimensionFt: "18'0\" × 28'0\"", areaSqFt: 504, floor: 'GROUND', features: ['Separate entrance from portico', 'Luxury guest washroom'] },
      { roomName: 'Great Room & Family Living Foyer', dimensionFt: "24'0\" × 28'0\"", areaSqFt: 672, floor: 'GROUND', features: ['Overlooks swimming pool & back lawn', '24ft double volume ceiling'] },
      { roomName: 'Chef Kitchen, Dirty Kitchen & Pantry', dimensionFt: "16'0\" × 20'0\"", areaSqFt: 320, floor: 'GROUND', features: ['Commercial walk-in refrigerator space', 'Island bar'] },
      { roomName: '2x Ground Master Royal Suites', dimensionFt: "16'0\" × 20'0\" each", areaSqFt: 640, floor: 'GROUND', features: ['Dressing lounges', 'Jacuzzi spa baths 10x12'] },
      { roomName: 'Back Lawn & Optional Plunge Pool', dimensionFt: "50'0\" × 20'0\"", areaSqFt: 1000, floor: 'GROUND', features: ['Pergola BBQ pavilion', 'Heated splash pool'] },
      { roomName: 'First Floor Presidential Suite', dimensionFt: "18'0\" × 22'0\"", areaSqFt: 396, floor: 'FIRST', features: ['Private sunset terrace', 'Walk-in his/hers closet'] },
      { roomName: '3x First Floor Bedrooms', dimensionFt: "15'0\" × 17'0\" each", areaSqFt: 765, floor: 'FIRST', features: ['All en-suite bathrooms', 'Hardwood flooring'] },
      { roomName: 'Home Theater / Media Cinema', dimensionFt: "16'0\" × 20'0\"", areaSqFt: 320, floor: 'FIRST', features: ['Acoustically insulated walls', 'Tiered recliner seating'] },
      { roomName: '2x Servant Quarters & Guard Room', dimensionFt: "12'0\" × 20'0\"", areaSqFt: 240, floor: 'FIRST', features: ['Independent rooftop access', 'Dedicated kitchen & bath'] },
    ],
    suitableSocieties: ['Kohistan Enclave (Block A & B 1 Kanal)', 'New City Phase 2 (Executive 1 Kanal)', 'Multi Gardens B-17 (Sector A Lake Front)'],
    description: 'The pinnacle of luxury residential architecture in Wah Cantt and Islamabad. Spanning 6,200 SqFt of covered area on a 50×90 plot, this 6-bedroom estate includes a 4-car portico, dedicated cinema room, rear private swimming pool deck, and dual servant quarters.',
    keyHighlights: [
      'Massive 4-car portico accommodating luxury fleet parking with side driveway',
      'Private rear garden pavilion with provision for a heated plunge pool and BBQ patio',
      'Dedicated sound-insulated home cinema / multimedia entertainment lounge',
      'Two master suites on the ground floor for elderly parents and guests',
    ],
    architectRemarks: 'Fully engineered for solar 25kW net-metering arrays, central HVAC ducted air-conditioning, and 3-phase underground power.',
    leadArchitect: 'Engr. Hammad Khan (Head of Architectural Engineering)',
    linkedConstructionSeriesEpisodeId: 'ep-16',
  },

  // ---------------------------------------------------------------------------
  // 5. 5 MARLA CORNER (25' × 50') - DUAL-FAMILY INDEPENDENT DUPLEX
  // ---------------------------------------------------------------------------
  {
    id: 'fp-5m-duplex',
    slug: '5-marla-corner-dual-family-rental-duplex',
    title: '5 Marla Corner Dual-Family Rental Duplex',
    subtitle: 'High-Yield Investment Layout with 2 Independent Units, Separate Meters & Separate Entrances',
    plotSizeCategory: '5_MARLA',
    plotDimensions: "25' × 50' Corner",
    architecturalStyle: 'INDEPENDENT_DUPLEX',
    styleLabel: 'Dual-Family Rental Duplex',
    totalCoveredAreaSqFt: 2300,
    groundFloorCoveredAreaSqFt: 1150,
    firstFloorCoveredAreaSqFt: 1150,
    bedrooms: 4, // 2 on ground, 2 on first
    bathrooms: 4,
    carPorchCapacity: '1 Sedan',
    carPorchCount: 1,
    kitchensCount: 2,
    hasServantQuarter: false,
    hasPowderRoom: false,
    hasDirtyKitchen: false,
    hasIndoorCourtyard: false,
    hasTerraceBalcony: true,
    elevation3dRender: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80',
    ],
    boqCostEstimates: {
      greyStructureRatePerSqFt: 2450,
      greyStructureTotalPKR: 5635000,
      premiumFinishingRatePerSqFt: 4600,
      premiumFinishingTotalPKR: 10580000,
      executiveSignatureRatePerSqFt: 5800,
      executiveSignatureTotalPKR: 13340000,
    },
    spatialAnalysis: {
      naturalLightScore: 9.6,
      crossVentilationScore: 9.5,
      circulationEfficiencyPct: 93,
      otsVentilationShaftsCount: 2,
      ventilationDescription: 'Corner plot advantage with windows along 50ft side street providing abundant natural illumination to all 4 bedrooms and both kitchens.',
    },
    roomDimensions: [
      { roomName: 'Ground Unit Porch & Entry', dimensionFt: "13'0\" × 14'0\"", areaSqFt: 182, floor: 'GROUND', features: ['Fits 1 car', 'Staircase door to lock upper unit'] },
      { roomName: 'Ground Unit 2 Beds + Lounge + Kitchen', dimensionFt: "25'0\" × 36'0\"", areaSqFt: 900, floor: 'GROUND', features: ['2 Beds with attached baths', 'Complete independent kitchen'] },
      { roomName: 'First Unit 2 Beds + Lounge + Kitchen', dimensionFt: "25'0\" × 45'0\"", areaSqFt: 1125, floor: 'FIRST', features: ['Independent electric meter', 'Front terrace balcony'] },
    ],
    suitableSocieties: ['Kohistan Enclave (Block C & EXT-4)', 'New City Phase 2 (Block B)', 'Multi Gardens B-17 (Sector D)'],
    description: 'Designed specifically for rental yield investors in Wah Cantt. Allows the homeowner to live on the ground floor while renting out the upper floor for PKR 45,000 – 60,000/month, or renting both units independently for an 8.2% annual rental return.',
    keyHighlights: [
      'Two 100% independent 2-bedroom units with separate entrances and kitchens',
      'Dual utility connections (separate electric & sub-gas meters)',
      'Corner plot advantage giving windows on 2 perpendicular streets',
      'Generates PKR 90,000 – 110,000/month combined rental income in Wah Cantt',
    ],
    architectRemarks: 'Engineered staircase at the extreme front porch edge so upper floor tenants never enter the ground floor living space.',
    leadArchitect: 'Asad Ali & Engr. Hammad Khan',
    linkedConstructionSeriesEpisodeId: 'ep-4',
  },
];
