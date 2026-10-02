export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'PROPERTIES' | 'SOCIETIES' | 'PAYMENT_PLANS' | 'FAQS' | 'COMPANY_INFO' | 'INVESTMENT_GUIDES' | 'CONSTRUCTION_BOQ' | 'POLICIES';
  content: string;
  source: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    title: 'Wah Cantt Real Rates Pricing Benchmark 2026',
    category: 'POLICIES',
    content: 'Asad Land Holdings operates strictly on real transaction rates. Non-existent file rates or portal paper prices are strictly prohibited.',
    source: 'Executive Board Directive 2026',
    updatedAt: '2026-09-01',
    status: 'ACTIVE',
  },
  {
    id: 'kb-2',
    title: 'Kohistan Enclave Block A Possession & Gas Meters',
    category: 'SOCIETIES',
    content: 'Block A Executive has 100% underground gas, electricity, and water connections active. On-ground plots are ready for immediate map approval.',
    source: 'Kohistan Enclave Masterplan Record',
    updatedAt: '2026-09-10',
    status: 'ACTIVE',
  },
  {
    id: 'kb-3',
    title: 'Faisal Hills Executive Block 5 & 10 Marla Rates',
    category: 'PROPERTIES',
    content: '5 Marla plots range from 48 to 55 Lakhs on-ground. 10 Marla plots range from 95 Lakhs to 1.15 Crore near 225ft Boulevard.',
    source: 'Zedem International Transfer Register',
    updatedAt: '2026-09-14',
    status: 'ACTIVE',
  },
  {
    id: 'kb-4',
    title: 'Turnkey Construction Cost Baseline 2026',
    category: 'CONSTRUCTION_BOQ',
    content: 'Standard Grey Structure: PKR 2,450-2,750 per SqFt. A+ Luxury Finishing: PKR 4,800-5,600 per SqFt based on Wah Cement Works OPC and Grade 60 Steel.',
    source: 'Engineering Division BOQ Standard',
    updatedAt: '2026-09-05',
    status: 'ACTIVE',
  },
];

let memoryKnowledgeBase: KnowledgeItem[] = [...INITIAL_KNOWLEDGE_BASE];

export function getActiveKnowledgeItems(): KnowledgeItem[] {
  return memoryKnowledgeBase.filter(k => k.status === 'ACTIVE');
}

export function getAllKnowledgeItems(): KnowledgeItem[] {
  return memoryKnowledgeBase;
}

export function addKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'updatedAt'>): KnowledgeItem {
  const newItem: KnowledgeItem = {
    ...item,
    id: `kb-${Date.now()}`,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  memoryKnowledgeBase.push(newItem);
  return newItem;
}

export function updateKnowledgeItemStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): KnowledgeItem | null {
  const found = memoryKnowledgeBase.find(k => k.id === id);
  if (found) {
    found.status = status;
    found.updatedAt = new Date().toISOString().split('T')[0];
    return found;
  }
  return null;
}
