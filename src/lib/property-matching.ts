export interface ParsedPropertyQuery {
  size?: number;
  sizeUnit?: string;
  propertyType?: string;
  societyName?: string;
  maxPrice?: number;
  minPrice?: number;
  block?: string;
  rawQuery: string;
}

export function parsePropertyQuery(queryStr: string): ParsedPropertyQuery {
  const q = queryStr.trim().toLowerCase();
  const result: ParsedPropertyQuery = { rawQuery: queryStr };

  // Parse Size & Unit (e.g., "10 marla", "1 kanal", "500 sqft")
  const marlaMatch = q.match(/(\d+(?:\.\d+)?)\s*(marla|marlar)/i);
  if (marlaMatch) {
    result.size = parseFloat(marlaMatch[1]);
    result.sizeUnit = 'MARLA';
  }

  const kanalMatch = q.match(/(\d+(?:\.\d+)?)\s*(kanal|kanals)/i);
  if (kanalMatch) {
    result.size = parseFloat(kanalMatch[1]);
    result.sizeUnit = 'KANAL';
  }

  // Parse Property Type
  if (q.includes('plot') || q.includes('plots')) {
    if (q.includes('commercial')) {
      result.propertyType = 'COMMERCIAL_PLOT';
    } else {
      result.propertyType = 'RESIDENTIAL_PLOT';
    }
  } else if (q.includes('house') || q.includes('villa')) {
    result.propertyType = 'HOUSE';
  } else if (q.includes('file') || q.includes('files')) {
    result.propertyType = 'FILE';
  } else if (q.includes('shop')) {
    result.propertyType = 'SHOP';
  }

  // Parse Price Range ("under 1 crore", "under 50 lakh", "below 2 cr", "1.5 crore")
  const croreMatch = q.match(/(?:under|below|max|upto)?\s*(\d+(?:\.\d+)?)\s*(?:crore|cr|crores)/i);
  if (croreMatch) {
    result.maxPrice = parseFloat(croreMatch[1]) * 10000000;
  }

  const lakhMatch = q.match(/(?:under|below|max|upto)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)/i);
  if (lakhMatch) {
    result.maxPrice = parseFloat(lakhMatch[1]) * 100000;
  }

  // Parse Society Name
  if (q.includes('faisal hills') || q.includes('faisal')) {
    result.societyName = 'Faisal Hills';
  } else if (q.includes('dha phase 8') || q.includes('dha 8') || q.includes('dha')) {
    result.societyName = 'DHA Phase 8';
  } else if (q.includes('bahria town') || q.includes('bahria')) {
    result.societyName = 'Bahria Town Sector F';
  } else if (q.includes('park view') || q.includes('parkview')) {
    result.societyName = 'Park View City';
  } else if (q.includes('gulberg')) {
    result.societyName = 'Gulberg Greens';
  }

  // Parse Block ("block a", "sector 2")
  const blockMatch = q.match(/block\s*([a-z0-9]+)/i);
  if (blockMatch) {
    result.block = `Block ${blockMatch[1].toUpperCase()}`;
  }

  return result;
}

export interface PropertyMatchResult {
  property: any;
  score: number; // 0 to 100
  reasons: string[];
}

export function calculatePropertyMatchScore(lead: any, property: any): PropertyMatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Budget Match (Up to 35 pts)
  const propPrice = property.demandPrice;
  const maxBudget = lead.budgetMax || 100000000;
  const minBudget = lead.budgetMin || 0;

  if (propPrice <= maxBudget) {
    if (minBudget > 0 && propPrice >= minBudget) {
      score += 35;
      reasons.push('Price falls within preferred budget range');
    } else {
      score += 30;
      reasons.push('Price is below client maximum budget limit');
    }
  } else if (propPrice <= maxBudget * 1.1) {
    score += 15;
    reasons.push('Price is within 10% negotiation margin of budget');
  }

  // 2. Size Match (Up to 25 pts)
  const prefSizeStr = (lead.preferredSize || '').toLowerCase();
  const propSizeStr = `${property.size} ${property.sizeUnit}`.toLowerCase();

  if (prefSizeStr && propSizeStr.includes(prefSizeStr)) {
    score += 25;
    reasons.push(`Exact size match (${property.size} ${property.sizeUnit})`);
  } else if (prefSizeStr.includes(`${property.size}`)) {
    score += 20;
    reasons.push(`Size value matches preferred ${property.size}`);
  }

  // 3. Society Match (Up to 25 pts)
  const prefSoc = (lead.preferredSociety || '').toLowerCase();
  const propSoc = (property.society?.name || property.city || '').toLowerCase();

  if (prefSoc && propSoc && (propSoc.includes(prefSoc) || prefSoc.includes(propSoc))) {
    score += 25;
    reasons.push(`Target society match (${property.society?.name || property.city})`);
  }

  // 4. Property Type Match (Up to 15 pts)
  const prefType = (lead.preferredType || '').toLowerCase();
  const propType = (property.propertyType || '').toLowerCase();

  if (prefType && propType && (prefType.includes(propType) || propType.includes(prefType))) {
    score += 15;
    reasons.push(`Property type matches (${property.propertyType})`);
  }

  return {
    property,
    score: Math.min(100, score),
    reasons,
  };
}
