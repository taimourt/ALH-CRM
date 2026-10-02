export interface ExtractedRequirement {
  intent?: 'BUY' | 'RENT' | 'SELL' | 'INVEST' | 'GENERAL_INQUIRY';
  propertyType?: 'RESIDENTIAL_PLOT' | 'COMMERCIAL_PLOT' | 'HOUSE_VILLA' | 'APARTMENT' | 'SHOP' | 'FARMHOUSE' | 'FILE' | 'OTHER';
  size?: string;
  society?: string;
  budgetMin?: number;
  budgetMax?: number;
  purpose?: 'INVESTMENT' | 'RESIDENCE' | 'BUILD' | 'RENTAL' | 'COMMERCIAL';
  timeline?: 'IMMEDIATE' | '1_3_MONTHS' | '3_6_MONTHS' | '6_PLUS_MONTHS';
  financing?: 'CASH' | 'INSTALLMENTS' | 'BANK_LOAN';
  interestLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  rawRequirementText?: string;
}

export interface LeadScoreResult {
  score: number; // 0 to 100
  scoreReason: string;
  recommendedAction: string;
}

export function extractRequirementFromText(text: string): ExtractedRequirement {
  const lower = text.toLowerCase();
  const req: ExtractedRequirement = {
    rawRequirementText: text,
  };

  // Intent
  if (lower.includes('chahiye') || lower.includes('buy') || lower.includes('kharidna') || lower.includes('looking for')) {
    req.intent = 'BUY';
  } else if (lower.includes('invest') || lower.includes('investment') || lower.includes('munafa')) {
    req.intent = 'INVEST';
  }

  // Society
  if (lower.includes('faisal hills')) req.society = 'Faisal Hills';
  else if (lower.includes('kohistan') || lower.includes('kohistan enclave')) req.society = 'Kohistan Enclave';
  else if (lower.includes('new city')) req.society = 'New City Phase 2';
  else if (lower.includes('b17') || lower.includes('b-17') || lower.includes('multi gardens')) req.society = 'Multi Gardens B-17';
  else if (lower.includes('topcity') || lower.includes('top city')) req.society = 'TopCity-1';

  // Size
  if (lower.includes('5 marla') || lower.includes('5marla')) req.size = '5 Marla';
  else if (lower.includes('7 marla') || lower.includes('7marla')) req.size = '7 Marla';
  else if (lower.includes('10 marla') || lower.includes('10marla')) req.size = '10 Marla';
  else if (lower.includes('1 kanal') || lower.includes('1kanal')) req.size = '1 Kanal';

  // Property Type
  if (lower.includes('plot') || lower.includes('zameen')) req.propertyType = 'RESIDENTIAL_PLOT';
  else if (lower.includes('house') || lower.includes('makaan') || lower.includes('villa')) req.propertyType = 'HOUSE_VILLA';
  else if (lower.includes('commercial') || lower.includes('dukan') || lower.includes('shop')) req.propertyType = 'COMMERCIAL_PLOT';

  // Purpose
  if (lower.includes('build') || lower.includes('ghar banana') || lower.includes('construction')) req.purpose = 'BUILD';
  else if (lower.includes('invest') || lower.includes('profit')) req.purpose = 'INVESTMENT';

  // Budget extraction (e.g. "80 lakh", "1 crore", "50 lac")
  if (lower.includes('50 lakh') || lower.includes('50 lac')) req.budgetMax = 5000000;
  else if (lower.includes('70 lakh') || lower.includes('70 lac')) req.budgetMax = 7000000;
  else if (lower.includes('80 lakh') || lower.includes('80 lac')) req.budgetMax = 8000000;
  else if (lower.includes('1 crore') || lower.includes('1crore')) req.budgetMax = 10000000;

  // Timeline
  if (lower.includes('fauran') || lower.includes('immediate') || lower.includes('abhy')) req.timeline = 'IMMEDIATE';
  else if (lower.includes('month') || lower.includes('mahine')) req.timeline = '1_3_MONTHS';

  return req;
}

export function scoreLeadRequirement(req: ExtractedRequirement): LeadScoreResult {
  let score = 30; // base score
  const reasons: string[] = [];

  if (req.society) {
    score += 15;
    reasons.push(`Specified Target Society (${req.society})`);
  }

  if (req.size) {
    score += 15;
    reasons.push(`Specified Plot Size (${req.size})`);
  }

  if (req.budgetMax) {
    score += 20;
    reasons.push(`Realistic Budget Defined (PKR ${(req.budgetMax / 100000).toFixed(0)} Lakhs)`);
  }

  if (req.timeline === 'IMMEDIATE') {
    score += 20;
    reasons.push('Immediate Purchase / Build Timeline');
  } else if (req.timeline === '1_3_MONTHS') {
    score += 10;
    reasons.push('Near-term 1-3 Month Timeline');
  }

  score = Math.min(100, score);

  let recommendedAction = 'Standard Advisory Nurture';
  if (score >= 80) {
    recommendedAction = 'HIGH PRIORITY: Direct Call from Principal Advisor Asad Ali & Send WhatsApp Deed';
  } else if (score >= 60) {
    recommendedAction = 'MEDIUM PRIORITY: Send Verified Society Price List & Follow Up via Phone';
  }

  return {
    score,
    scoreReason: reasons.join(' • ') || 'Initial General Inquiry',
    recommendedAction,
  };
}
