import { CMSDatabase, CMSBlogPost, CMSProperty, CMSFloorPlan, CMSMaterialRates, CMSVideo, CMSInquiry, CMSSettings } from './cms-types';
import { PROPERTIES_DATA, VIDEOS_DATA } from './website-data';
import { FLOOR_PLANS_DATA } from './floor-plans-data';

export const INITIAL_BLOG_POSTS: CMSBlogPost[] = [
  {
    id: 'post-1',
    slug: 'kohistan-enclave-sector-analysis-2026',
    title: 'Kohistan Enclave Sector A vs Sector C: 2026 Price & Appreciation Index',
    excerpt: 'An empirical transaction-backed comparison of Kohistan Enclave sectors, analyzing actual registry values, possession timelines, and rental yield forecasts.',
    category: 'Market Intelligence',
    tags: ['Kohistan Enclave', 'Wah Cantt', 'Market Analysis', 'Investment'],
    coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Asad Ali',
      role: 'Principal Broker & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
    },
    readTimeMinutes: 7,
    status: 'published',
    publishedAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
    views: 1420,
    featured: true,
    content: `## Executive Overview

Kohistan Enclave Wah Cantt has emerged as one of the premier master-planned gated communities along the GT Road corridor. However, wide pricing discrepancies between speculative portal listings and verified ground transactions have created confusion for genuine end-users and overseas buyers.

In this market briefing, **Asad Land Holdings** breaks down verified price indices across Sector A, Sector B, Sector C, and Sector D.

---

### 1. Empirical Rate Comparison (5 Marla & 10 Marla)

| Sector | Category | Genuine Transaction Rate | Portal Asking Average | Speculative Premium |
| :--- | :--- | :--- | :--- | :--- |
| **Sector A (Executive)** | 10 Marla (35×70) | **PKR 1.75 - 1.95 Cr** | PKR 2.15 Cr | +12.8% Artificial Gap |
| **Sector B (Park View)** | 10 Marla (35×70) | **PKR 1.55 - 1.70 Cr** | PKR 1.85 Cr | +11.2% Artificial Gap |
| **Sector C (Boulevard)** | 10 Marla (35×70) | **PKR 1.35 - 1.50 Cr** | PKR 1.65 Cr | +14.5% Artificial Gap |
| **Sector D (Upcoming)** | 5 Marla (25×45) | **PKR 55 - 65 Lac** | PKR 75 Lac | +18.0% Artificial Gap |

---

### 2. Infrastructure & Possession Ground Reality

1. **Sector A**: 100% underground electrification completed, high water pressure grid active, 120+ luxury residential houses already inhabited.
2. **Sector B**: Direct walking access to Kohistan Grand Mosque & Commercial Marquee zone. Excellent for families wanting quick construction.
3. **Sector C**: Rapid development with earthworks and sewerage complete. Offers highest 24-month capital appreciation potential for mid-term investors.

---

### 3. Investment Verdict

For **immediate construction (within 3–6 months)**, Sector A and Sector B remain the undisputed choices. For **capital appreciation with lower entry capital**, Sector C boulevard-facing plots offer an estimated 16–22% annualized ROI before 2028 possession handover.

> **Need verified on-ground inventory?** Contact Asad Land Holdings Kohistan Desk at +92 321 8004186 for registry-verified direct owner options.`,
  },
  {
    id: 'post-2',
    slug: 'cost-of-building-5-marla-house-2026-boq',
    title: 'Cost of Building a 5 Marla (25×45) House in 2026 [Itemized BOQ & Rates]',
    excerpt: 'Detailed material breakdown and labor cost benchmarks for constructing a double-storey 5 Marla house in Wah Cantt, Rawalpindi & Islamabad in 2026.',
    category: 'Construction & Architecture',
    tags: ['Construction', '5 Marla', 'BOQ', 'House Building', 'Material Rates'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Engr. Hammad Tariq',
      role: 'Head of Architectural Engineering',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    },
    readTimeMinutes: 9,
    status: 'published',
    publishedAt: '2026-09-24T14:30:00.000Z',
    updatedAt: '2026-09-24T14:30:00.000Z',
    views: 2890,
    featured: true,
    content: `## 2026 Construction Economics in Wah & Islamabad

With fluctuating steel and cement prices in Pakistan, prospective home builders frequently ask: *"How much does it genuinely cost to build an executive double-storey 5 Marla house today?"*

Below is our empirical Bill of Quantities (BOQ) based on actual ongoing construction projects executed by Asad Land Holdings turnkey construction division.

---

### Total Covered Area Specifications
- **Plot Dimensions**: 25 ft × 45 ft (125 sq. yards / 1,125 sq. ft plot area)
- **Ground Floor Covered Area**: 1,025 sq. ft
- **First Floor Covered Area**: 975 sq. ft
- **Mumty / Staircase Tower**: 200 sq. ft
- **Total Covered Area**: **2,200 sq. ft**

---

### 1. Grey Structure Cost Summary (2,200 sq. ft @ PKR 2,650 / sq. ft)
- **Total Grey Structure Cost**: **PKR 5,830,000 (~58.3 Lac)**

#### Key Grey Structure Material Quantities:
- **Cement**: ~1,100 Bags (Fauji / Bestway Grade 53) @ PKR 1,420/bag = PKR 1,562,000
- **Deformed Steel (Grade 60)**: ~8.5 Tons (Mughal / Amreli) @ PKR 260,000/ton = PKR 2,210,000
- **Red Bricks (Awwal)**: ~62,000 Bricks @ PKR 14,500/1000 = PKR 899,000
- **Ravi Sand & Chenab Sand**: PKR 380,000
- **Margalla Crush (Fine & Coarse)**: PKR 420,000
- **Underground Plumbing & PVC Piping**: PKR 359,000

---

### 2. A+ Executive Finishing Package (2,200 sq. ft @ PKR 2,800 / sq. ft)
- **Total Finishing Cost**: **PKR 6,160,000 (~61.6 Lac)**

#### Key Premium Finishing Elements:
1. 60×120cm Spanish/Porcelain floor & bath tiles.
2. Solid Ash Wood entry doors & high-gloss UV acrylic kitchen cabinets with quartz stone countertops.
3. Grohe / Master concealed bath sanitary fittings with tempered glass shower cabins.
4. Pakistan Cables pure copper wiring with Schneider Electric switches.
5. Berger / Dulux WeatherShield anti-fungal exterior & Silk vinyl emulsion interior.

---

### 3. Total Turnkey Budget
- **Grey Structure**: PKR 58.3 Lac
- **A+ Luxury Finishing**: PKR 61.6 Lac
- **Grand Total (Plot Excluded)**: **PKR 1.199 Crore (~1.20 Crore)**

> Download the full printable 2D architectural blueprint and complete BOQ schedule in our [Floor Plans & Construction section](/floor-plans).`,
  },
  {
    id: 'post-3',
    slug: 'overseas-pakistani-real-estate-verification-checklist',
    title: 'Overseas Pakistani Real Estate Verification Checklist (Registry, NOC & Mutation)',
    excerpt: 'A bulletproof 7-step due diligence guide for overseas Pakistanis in UK, UAE, USA and Saudi Arabia buying land in Wah Cantt and Rawalpindi.',
    category: 'Legal & Verification',
    tags: ['Overseas', 'Legal', 'Verification', 'NOC', 'Fard', 'Registry'],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Barrister Zeeshan Malik',
      role: 'Legal Advisor & Property Conveyance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    },
    readTimeMinutes: 6,
    status: 'published',
    publishedAt: '2026-09-19T09:00:00.000Z',
    updatedAt: '2026-09-19T09:00:00.000Z',
    views: 1980,
    featured: false,
    content: `## Safe Property Acquisition from Abroad

Investing in Pakistani real estate while living abroad in London, Dubai, Toronto, or Riyadh can be intimidating due to fraudulent files and unapproved housing societies.

At **Asad Land Holdings**, our Overseas Desk enforces a zero-compromise 7-point legal verification protocol on every plot listed on our platform.

---

### The 7-Step Due Diligence Checklist

1. **Verify RDA / TMA / Cantonment Board NOC Status**:
   Never purchase a file or plot in an unapproved housing scheme. Confirm society approval via RDA or Wah Cantonment Board official gazette.
2. **Verify Aks-e-Shajra & Mauza Settlement Records**:
   Ensure the seller has direct title to the physical khasra numbers where the plot is situated.
3. **Verify Fard-e-Malkiat (Ownership Deed)**:
   Obtain a fresh digital Arazi Record Center (PLRA) verified Fard issued within the last 14 days.
4. **Demand Original Allotment Certificate & NDC (No Demand Certificate)**:
   Confirm zero outstanding development charges, utility dues, or transfer taxes.
5. **Execute Physical On-Ground Demarcation (Nishan-Dahi)**:
   Verify corner coordinates, ground level, and road alignment before transferring funds.
6. **Execute Verified Power of Attorney (PoA) via Pakistani Consulate**:
   If delegating signing rights to a relative, ensure consular attestation.
7. **Use Banking Channel Pay Orders Only**:
   Never make cash transactions. Pay via banking instrument referencing the plot number and seller CNIC.

---

> Contact our [Overseas Desk](/overseas) for complimentary title search and video-verified ground inspection reports.`,
  },
  {
    id: 'post-4',
    slug: 'new-city-phase-2-vs-faisal-hills-comparison',
    title: 'New City Phase 2 vs Faisal Hills: 3-Year Capital Growth & Rental Comparison',
    excerpt: 'Comparing entry prices, motorway connectivity, commercial vitality, and ROI prospects for two of the most popular societies along the M-1 / GT Road axis.',
    category: 'Society Spotlight',
    tags: ['New City Phase 2', 'Faisal Hills', 'Taxila', 'Wah Cantt', 'ROI'],
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Asad Ali',
      role: 'Principal Broker & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
    },
    readTimeMinutes: 8,
    status: 'published',
    publishedAt: '2026-09-12T11:20:00.000Z',
    updatedAt: '2026-09-12T11:20:00.000Z',
    views: 1650,
    featured: false,
    content: `## The M-1 Interchange Corridor Showdown

Both **New City Phase 2** (Wah Cantt) and **Faisal Hills** (Taxila/MPCHS) have witnessed tremendous infrastructure investment over the past 3 years. Which is the superior choice for your capital in 2026?

### Direct Comparative Matrix

| Parameter | New City Phase 2 | Faisal Hills (Blocks A–D) |
| :--- | :--- | :--- |
| **Location** | Adjacent to Brahmar Interchange M-1 | Direct access on Main GT Road (N-5) |
| **Approval Body** | TMA Wah / RDA Approved | RDA Approved Master Plan |
| **Commercial Vitality** | High (Business Avenue, Banks, Malls) | Rapidly Growing |
| **Average 10 Marla Plot Price** | PKR 1.45 - 1.85 Cr | PKR 1.30 - 1.65 Cr |
| **Rental Yield on Built House** | 5.2% – 6.0% | 4.8% – 5.5% |
| **Best Suited For** | Commercial & Immediate Living | Long-term capital appreciation |

---

### Conclusion & Recommendations
- **Choose New City Phase 2** if you want immediate access to top schools, operational banks, commercial plazas, and rapid M-1 motorway access to Islamabad Airport.
- **Choose Faisal Hills** if you want scenic Margalla foothill views with lower entry prices and high appreciation potential in Executive and C Blocks.`,
  },
];

export const INITIAL_MATERIAL_RATES: CMSMaterialRates = {
  greyStructureRatePerSqFtPKR: 2650,
  premiumFinishRatePerSqFtPKR: 2800,
  executiveFinishRatePerSqFtPKR: 4300,
  cementBagPKR: 1420,
  steelTonPKR: 260000,
  bricks1000PKR: 14500,
  sandTruckPKR: 28000,
  crushTruckPKR: 34000,
  electricCablesBundlePKR: 18500,
  plumbingPipesPerFtPKR: 320,
  paintDrumPKR: 22000,
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_SETTINGS: CMSSettings = {
  siteTitle: 'Asad Land Holdings | Real Estate on Real Rates',
  tagline: 'Wah Cantt & Islamabad Premier Real Estate, Construction & Architectural Advisory',
  phone: '+92 321 8004186',
  whatsapp: '+923218004186',
  email: 'info@asadlandholdings.com',
  address: 'Shop no 3, Hassan Heights, F Block, Wah Cantt, 47040',
  officeHours: 'Monday – Saturday: 9:30 AM – 7:30 PM (Friday: Closed for Juma prayer 1-3 PM)',
  facebookUrl: 'https://facebook.com/asadlandholdings',
  youtubeUrl: 'https://youtube.com/@asadlandholdings',
  instagramUrl: 'https://instagram.com/asadlandholdings',
  enableAnnouncementBanner: true,
  announcementText: '📢 Live Ground Verified Prices: Kohistan Enclave Sector A & C fresh plots now open for booking with instant registry.',
  seoMetaTitle: 'Asad Land Holdings — Verified Real Estate, Turnkey Construction & Floor Plans',
  seoMetaDescription: 'Empirical real estate portal for Wah Cantt & Islamabad. Transparent property listings, verified transaction index, turnkey construction BOQ and 2D/3D floor plans.',
};

export const INITIAL_INQUIRIES: CMSInquiry[] = [
  {
    id: 'inq-1',
    name: 'Tariq Mehmood (UK)',
    phone: '+44 7700 900123',
    email: 'tariq.mehmood@example.co.uk',
    propertySlug: '10-marla-corner-plot-sector-a-kohistan-enclave',
    propertyTitle: '10 Marla Corner Plot — Sector A, Kohistan Enclave',
    subject: 'Request for Title Deed & On-Ground Video',
    message: 'I live in Manchester and want to verify if this Sector A corner plot is 100% direct owner with possession. Please send video inspection via WhatsApp.',
    source: 'property_page',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'inq-2',
    name: 'Dr. Shahzad Rafiq',
    phone: '+92 321 5556789',
    email: 'shahzad.rafiq@example.com',
    propertySlug: '',
    propertyTitle: '',
    subject: '5 Marla Modern House Construction Package',
    message: 'I have a 5 Marla plot in New City Phase 2 and want a turnkey quote for your 5 Marla Modern Executive 3-Story design.',
    source: 'floor_plan',
    status: 'unread',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Helper to seed initial CMS DB (client-safe)
export function getInitialCMSDatabase(): CMSDatabase {
  const initialProperties: CMSProperty[] = PROPERTIES_DATA.map((p) => ({
    ...p,
    status: 'published',
  }));

  const initialFloorPlans: CMSFloorPlan[] = FLOOR_PLANS_DATA.map((fp) => ({
    ...fp,
    status: 'published',
  }));

  const initialVideos: CMSVideo[] = VIDEOS_DATA.map((v) => ({
    ...v,
    isShort: v.duration.includes('0:') || v.category === 'DEVELOPMENT_UPDATE',
    featured: true,
  }));

  return {
    posts: INITIAL_BLOG_POSTS,
    properties: initialProperties,
    floorPlans: initialFloorPlans,
    materialRates: INITIAL_MATERIAL_RATES,
    videos: initialVideos,
    inquiries: INITIAL_INQUIRIES,
    settings: INITIAL_SETTINGS,
    lastBackupDate: new Date().toISOString(),
  };
}
