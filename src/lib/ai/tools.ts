import { PROPERTIES_DATA, SOCIETIES_DATA, INVESTMENT_REPORTS, AGENTS_DATA, PropertyItem, SocietyItem } from '../website-data';
import { extractRequirementFromText, scoreLeadRequirement, LeadScoreResult } from './lead-extractor';
import { logAuditEntry } from './audit-logger';
import { getActiveKnowledgeItems } from './knowledge-service';

export interface ToolCallResult<T = unknown> {
  toolName: string;
  success: boolean;
  data: T;
  message?: string;
}

export const aiTools = {
  // 1. Search Properties
  search_properties: (params: {
    society?: string;
    city?: string;
    propertyType?: string;
    purpose?: string;
    minPrice?: number;
    maxPrice?: number;
    sizeMarla?: number;
  }): ToolCallResult<PropertyItem[]> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'search_properties', details: params });

    const results = PROPERTIES_DATA.filter((p) => {
      if (params.society && !p.society.toLowerCase().includes(params.society.toLowerCase())) return false;
      if (params.city && !p.city.toLowerCase().includes(params.city.toLowerCase())) return false;
      if (params.propertyType && p.propertyType !== params.propertyType) return false;
      if (params.purpose && p.purpose !== params.purpose) return false;
      if (params.minPrice && p.demandPrice < params.minPrice) return false;
      if (params.maxPrice && p.demandPrice > params.maxPrice) return false;
      if (params.sizeMarla && p.sizeMarla !== params.sizeMarla) return false;
      return true;
    });

    return {
      toolName: 'search_properties',
      success: true,
      data: results,
      message: `Found ${results.length} verified real-rate listings matching criteria.`,
    };
  },

  // 2. Get Single Property
  get_property: (params: { id?: string; slug?: string }): ToolCallResult<PropertyItem | null> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'get_property', details: params });
    const property = PROPERTIES_DATA.find((p) => p.id === params.id || p.slug === params.slug) || null;
    return {
      toolName: 'get_property',
      success: !!property,
      data: property,
      message: property ? `Retrieved property ${property.title}` : 'Property not found',
    };
  },

  // 3. Search Societies
  search_societies: (params: { city?: string; name?: string }): ToolCallResult<SocietyItem[]> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'search_societies', details: params });
    const results = SOCIETIES_DATA.filter((s) => {
      if (params.city && !s.city.toLowerCase().includes(params.city.toLowerCase())) return false;
      if (params.name && !s.name.toLowerCase().includes(params.name.toLowerCase())) return false;
      return true;
    });
    return {
      toolName: 'search_societies',
      success: true,
      data: results,
      message: `Found ${results.length} covered societies.`,
    };
  },

  // 4. Get Single Society
  get_society: (params: { id?: string; slug?: string }): ToolCallResult<SocietyItem | null> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'get_society', details: params });
    const society = SOCIETIES_DATA.find((s) => s.id === params.id || s.slug === params.slug) || null;
    return {
      toolName: 'get_society',
      success: !!society,
      data: society,
      message: society ? `Retrieved society ${society.name}` : 'Society not found',
    };
  },

  // 5. Search Available Inventory
  search_available_inventory: (params: { location?: string; budgetMax?: number }): ToolCallResult<PropertyItem[]> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'search_available_inventory', details: params });
    const results = PROPERTIES_DATA.filter((p) => {
      if (p.availabilityStatus !== 'AVAILABLE' && p.availabilityStatus !== 'HOT_OPPORTUNITY') return false;
      if (params.location && !p.location.toLowerCase().includes(params.location.toLowerCase()) && !p.society.toLowerCase().includes(params.location.toLowerCase())) return false;
      if (params.budgetMax && p.demandPrice > params.budgetMax) return false;
      return true;
    });
    return {
      toolName: 'search_available_inventory',
      success: true,
      data: results,
      message: `Found ${results.length} available inventory items.`,
    };
  },

  // 6. Compare Properties
  compare_properties: (params: { propertyIds: string[] }): ToolCallResult<PropertyItem[]> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'compare_properties', details: params });
    const items = PROPERTIES_DATA.filter((p) => params.propertyIds.includes(p.id));
    return {
      toolName: 'compare_properties',
      success: true,
      data: items,
      message: `Comparing ${items.length} properties.`,
    };
  },

  // 7. Calculate Installment
  calculate_installment: (params: { totalPrice: number; downPaymentPct?: number; durationMonths?: number }): ToolCallResult<{
    totalPrice: number;
    downPaymentAmount: number;
    remainingAmount: number;
    monthlyInstallment: number;
    quarterlyInstallment: number;
  }> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'calculate_installment', details: params });
    const pct = params.downPaymentPct || 25;
    const months = params.durationMonths || 36;
    const downPaymentAmount = (params.totalPrice * pct) / 100;
    const remainingAmount = params.totalPrice - downPaymentAmount;
    const monthlyInstallment = remainingAmount / months;
    const quarterlyInstallment = remainingAmount / (months / 3);

    return {
      toolName: 'calculate_installment',
      success: true,
      data: {
        totalPrice: params.totalPrice,
        downPaymentAmount,
        remainingAmount,
        monthlyInstallment,
        quarterlyInstallment,
      },
      message: 'Calculated installment schedule.',
    };
  },

  // 8. Calculate ROI
  calculate_roi: (params: { purchasePrice: number; holdingYears?: number; growthRate?: number }): ToolCallResult<{
    purchasePrice: number;
    holdingYears: number;
    growthRate: number;
    projectedFutureValue: number;
    estimatedCapitalGain: number;
    annualRentalFlow: number;
  }> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'calculate_roi', details: params });
    const years = params.holdingYears || 3;
    const rate = params.growthRate || 18.4;
    const projectedFutureValue = params.purchasePrice * Math.pow(1 + rate / 100, years);
    const estimatedCapitalGain = projectedFutureValue - params.purchasePrice;
    const annualRentalFlow = params.purchasePrice * 0.078;

    return {
      toolName: 'calculate_roi',
      success: true,
      data: {
        purchasePrice: params.purchasePrice,
        holdingYears: years,
        growthRate: rate,
        projectedFutureValue,
        estimatedCapitalGain,
        annualRentalFlow,
      },
      message: 'Calculated ROI & appreciation projection.',
    };
  },

  // 9. Schedule Site Visit
  schedule_site_visit: (params: { leadId?: string; propertyId?: string; conversationId?: string; scheduledAt: string; notes?: string }): ToolCallResult<{
    visitId: string;
    scheduledAt: string;
    status: string;
  }> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'schedule_site_visit', details: params });
    return {
      toolName: 'schedule_site_visit',
      success: true,
      data: {
        visitId: `visit-${Date.now()}`,
        scheduledAt: params.scheduledAt,
        status: 'SCHEDULED_CONFIRMED',
      },
      message: `Site visit scheduled for ${params.scheduledAt}.`,
    };
  },

  // 10. Handoff to Agent
  handoff_to_agent: (params: { conversationId: string; reason?: string }): ToolCallResult<{
    conversationId: string;
    handoffState: string;
    assignedAgent: string;
  }> => {
    logAuditEntry({ actor: 'ASAD_AI', action: 'handoff_to_agent', details: params });
    return {
      toolName: 'handoff_to_agent',
      success: true,
      data: {
        conversationId: params.conversationId,
        handoffState: 'HUMAN_HANDOFF_ACTIVE',
        assignedAgent: AGENTS_DATA[0].name,
      },
      message: `Conversation ${params.conversationId} handed off to ${AGENTS_DATA[0].name}.`,
    };
  },
};
