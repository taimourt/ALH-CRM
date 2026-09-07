import { formatPKR } from './utils';

export type ServiceCategory =
  | 'PROPERTY_PURCHASE'
  | 'CONSTRUCTION_TURNKEY'
  | 'CONSTRUCTION_GREY_STRUCTURE'
  | 'RENOVATION_INTERIOR'
  | 'ARCHITECTURAL_DESIGN';

export type ConstructionQuality =
  | 'STANDARD'
  | 'PREMIUM_A'
  | 'LUXURY_A_PLUS';

export interface PlotSizeOption {
  label: string;
  sizeMarla: number;
  typicalCoveredAreaSqFt: number;
}

export const PLOT_SIZE_PRESETS: PlotSizeOption[] = [
  { label: '5 Marla (Double Story)', sizeMarla: 5, typicalCoveredAreaSqFt: 2200 },
  { label: '7 Marla (Double Story)', sizeMarla: 7, typicalCoveredAreaSqFt: 2800 },
  { label: '10 Marla (Double Story)', sizeMarla: 10, typicalCoveredAreaSqFt: 3300 },
  { label: '1 Kanal (Double Story)', sizeMarla: 20, typicalCoveredAreaSqFt: 5500 },
  { label: '2 Kanal (Luxury Villa)', sizeMarla: 40, typicalCoveredAreaSqFt: 10000 },
];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, { label: string; icon: string; description: string }> = {
  PROPERTY_PURCHASE: {
    label: 'Real Estate Purchase',
    icon: '🏡',
    description: 'Plot, Ready House, Commercial Shop, or Apartment acquisition',
  },
  CONSTRUCTION_TURNKEY: {
    label: 'Turnkey House Construction (Full Contract)',
    icon: '🏗️',
    description: 'Complete building package from foundation excavation to lock-and-key finishing',
  },
  CONSTRUCTION_GREY_STRUCTURE: {
    label: 'Grey Structure Contracting',
    icon: '🧱',
    description: 'RCC foundation, brick masonry, plaster, electrical conduits & plumbing rough-ins',
  },
  RENOVATION_INTERIOR: {
    label: 'Renovation & Interior Finishing',
    icon: '🎨',
    description: 'Modern remodeling, woodwork, false ceiling, premium tile work & kitchens',
  },
  ARCHITECTURAL_DESIGN: {
    label: 'Architectural & Engineering Design',
    icon: '📐',
    description: '2D/3D elevations, CDA/RDA map vetting, structural blueprints & soil testing',
  },
};

// Rates per sq.ft in PKR for Islamabad/Rawalpindi construction projects
export const CONSTRUCTION_RATES: Record<ServiceCategory, Record<ConstructionQuality, number>> = {
  PROPERTY_PURCHASE: {
    STANDARD: 0,
    PREMIUM_A: 0,
    LUXURY_A_PLUS: 0,
  },
  CONSTRUCTION_TURNKEY: {
    STANDARD: 5200,      // PKR 5,200 / sqft (Good quality standard fixtures)
    PREMIUM_A: 6800,     // PKR 6,800 / sqft (Imported tiles, solid ash wood doors, Grohe/Porta)
    LUXURY_A_PLUS: 9500, // PKR 9,500 / sqft (Spanish/Italian marble, smart home, double height lobby)
  },
  CONSTRUCTION_GREY_STRUCTURE: {
    STANDARD: 2800,      // PKR 2,800 / sqft (Grade 60 Steel, Bestway/Fauji cement, A-quality brick)
    PREMIUM_A: 3300,     // PKR 3,300 / sqft (Mughal/Amreli 60-grade, water-proofing, copper piping)
    LUXURY_A_PLUS: 3800, // PKR 3,800 / sqft (Heavy seismic RCC design, termite treatment, PPRC)
  },
  RENOVATION_INTERIOR: {
    STANDARD: 2200,      // PKR 2,200 / sqft
    PREMIUM_A: 3600,     // PKR 3,600 / sqft
    LUXURY_A_PLUS: 5800, // PKR 5,800 / sqft
  },
  ARCHITECTURAL_DESIGN: {
    STANDARD: 80,        // PKR 80 / sqft (Standard 2D floor plans & 3D front elevation)
    PREMIUM_A: 130,      // PKR 130 / sqft (Full MEP, Structural drawings, Society approval)
    LUXURY_A_PLUS: 220,  // PKR 220 / sqft (VR 3D Walkthrough, Interior design, Site supervision)
  },
};

export interface ConstructionEstimate {
  ratePerSqFt: number;
  coveredAreaSqFt: number;
  totalEstimatedCost: number;
  greyStructureShare: number;
  finishingShare: number;
  architecturalShare: number;
  contingencyMargin: number;
  estimatedTimelineMonths: number;
  paymentMilestones: {
    milestone: string;
    percentage: number;
    amount: number;
  }[];
}

export function calculateConstructionEstimate(
  serviceCategory: ServiceCategory,
  coveredAreaSqFt: number,
  qualityTier: ConstructionQuality = 'PREMIUM_A'
): ConstructionEstimate {
  const ratePerSqFt = CONSTRUCTION_RATES[serviceCategory]?.[qualityTier] || 6500;
  const area = Math.max(100, coveredAreaSqFt || 2200);
  const totalEstimatedCost = Math.round(ratePerSqFt * area);

  // Split calculations
  const greyStructureShare = serviceCategory === 'CONSTRUCTION_GREY_STRUCTURE'
    ? totalEstimatedCost
    : Math.round(totalEstimatedCost * 0.45);

  const finishingShare = serviceCategory === 'CONSTRUCTION_TURNKEY'
    ? Math.round(totalEstimatedCost * 0.50)
    : serviceCategory === 'RENOVATION_INTERIOR'
    ? totalEstimatedCost
    : 0;

  const architecturalShare = Math.round(totalEstimatedCost * 0.05);
  const contingencyMargin = Math.round(totalEstimatedCost * 0.05);

  let estimatedTimelineMonths = 6;
  if (area > 8000) estimatedTimelineMonths = 14;
  else if (area > 4000) estimatedTimelineMonths = 10;
  else if (area > 2000) estimatedTimelineMonths = 8;
  else estimatedTimelineMonths = 5;

  if (serviceCategory === 'CONSTRUCTION_GREY_STRUCTURE') {
    estimatedTimelineMonths = Math.max(3, Math.round(estimatedTimelineMonths * 0.55));
  } else if (serviceCategory === 'ARCHITECTURAL_DESIGN') {
    estimatedTimelineMonths = 1;
  }

  // Milestone breakdown
  const paymentMilestones = serviceCategory === 'CONSTRUCTION_GREY_STRUCTURE'
    ? [
        { milestone: '1. Booking & Mobilization Advance', percentage: 20, amount: Math.round(totalEstimatedCost * 0.20) },
        { milestone: '2. Plinth Beam & Foundation Completion', percentage: 25, amount: Math.round(totalEstimatedCost * 0.25) },
        { milestone: '3. Ground Floor Slab Casting', percentage: 20, amount: Math.round(totalEstimatedCost * 0.20) },
        { milestone: '4. First Floor Slab & Masonry', percentage: 20, amount: Math.round(totalEstimatedCost * 0.20) },
        { milestone: '5. Internal/External Plaster & Handover', percentage: 15, amount: Math.round(totalEstimatedCost * 0.15) },
      ]
    : [
        { milestone: '1. Advance Mobilization & Site Layout', percentage: 15, amount: Math.round(totalEstimatedCost * 0.15) },
        { milestone: '2. Foundation & Plinth Level', percentage: 15, amount: Math.round(totalEstimatedCost * 0.15) },
        { milestone: '3. RCC Structure & Slabs Completed', percentage: 25, amount: Math.round(totalEstimatedCost * 0.25) },
        { milestone: '4. Plumbing, Electrical Conduits & Plaster', percentage: 15, amount: Math.round(totalEstimatedCost * 0.15) },
        { milestone: '5. Flooring, Tiles, Woodwork & Paint', percentage: 20, amount: Math.round(totalEstimatedCost * 0.20) },
        { milestone: '6. Final Snagging & Key Handover', percentage: 10, amount: Math.round(totalEstimatedCost * 0.10) },
      ];

  return {
    ratePerSqFt,
    coveredAreaSqFt: area,
    totalEstimatedCost,
    greyStructureShare,
    finishingShare,
    architecturalShare,
    contingencyMargin,
    estimatedTimelineMonths,
    paymentMilestones,
  };
}

export function generateConstructionWhatsAppQuote(params: {
  clientName: string;
  serviceCategory: ServiceCategory;
  society?: string;
  plotSize?: string;
  coveredAreaSqFt: number;
  qualityTier: ConstructionQuality;
  advisorName?: string;
  advisorPhone?: string;
}): string {
  const { clientName, serviceCategory, society, plotSize, coveredAreaSqFt, qualityTier, advisorName, advisorPhone } = params;
  const estimate = calculateConstructionEstimate(serviceCategory, coveredAreaSqFt, qualityTier);
  const serviceInfo = SERVICE_CATEGORY_LABELS[serviceCategory] || SERVICE_CATEGORY_LABELS.CONSTRUCTION_TURNKEY;

  const qualityLabels: Record<ConstructionQuality, string> = {
    STANDARD: 'Standard Grade-A Execution',
    PREMIUM_A: 'Premium Executive A-Quality (Imported Fixtures & Semi-Solid Wood)',
    LUXURY_A_PLUS: 'Ultra-Luxury A+ Signature (Spanish/Italian Tiles & Custom Millwork)',
  };

  return `*ASAD LAND HOLDINGS — CONSTRUCTION & TURNKEY QUOTATION* 🏗️✨

*Dear ${clientName || 'Valued Client'},*
Assalam-o-Alaikum,

Thank you for your interest in our construction & contracting services at *Asad Land Holdings*. Below is the preliminary estimate for your project:

📌 *PROJECT SPECIFICATIONS:*
• *Service Required:* ${serviceInfo.icon} ${serviceInfo.label}
• *Target Location:* ${society || 'Islamabad / Rawalpindi Prime Society'}
• *Plot Size:* ${plotSize || 'Standard Plot'}
• *Total Covered Area:* ${estimate.coveredAreaSqFt.toLocaleString()} Sq. Ft.
• *Finishing Tier:* ${qualityLabels[qualityTier]}

💰 *FINANCIAL ESTIMATION:*
• *Benchmark Rate:* PKR ${estimate.ratePerSqFt.toLocaleString()} / sq.ft
• *Total Project Estimate:* *${formatPKR(estimate.totalEstimatedCost)}*
• *Estimated Timeline:* ~${estimate.estimatedTimelineMonths} Months to Completion

📋 *CONSTRUCTION SPECIFICATION HIGHLIGHTS:*
✔ 60-Grade Deformed Steel (Mughal / Amreli / Prime Steel)
✔ Grade-A Fauji/Bestway OPC Cement with 1:2:4 RCC mix
✔ High-Density Red Bricks with Termite Proofing & Bitumen Seal
✔ Copper wiring (Pakistan Cables) & PPRC/PVC conduits (Master / Popular)
✔ Complete architectural 2D/3D maps & Society CDA/RDA Approval support

💳 *FLEXIBLE CONSTRUCTION MILESTONES:*
${estimate.paymentMilestones.map((m) => `• ${m.milestone}: ${m.percentage}% (${formatPKR(m.amount)})`).join('\n')}

_Note: This is an estimated quotation based on standard covered area bye-laws. Final BOQ is tailored upon architectural layout finalization._

Warm regards,
*${advisorName || 'Asad Land Holdings — Projects & Construction Desk'}*
📞 Contact: ${advisorPhone || '0300-1234567'}
🌐 Website: crm.asadlandholdings.com`;
}
