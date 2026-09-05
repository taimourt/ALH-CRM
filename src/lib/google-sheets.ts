import { prisma } from '@/lib/db';
import { triggerWorkflow } from '@/lib/automation';
import { recordAuditLog } from '@/lib/audit';
import { assignLeadRoundRobin } from '@/lib/lead-assignment';

export const DEFAULT_GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1jzScCXsAxB4DXCp5-69zh0M002T5xXDupOO9tch7zes/edit?resourcekey=&gid=308492530#gid=308492530';

export interface ParsedSheetLead {
  name: string;
  phone: string;
  email?: string;
  preferredSociety?: string;
  preferredSize?: string;
  budgetMax?: number;
  source?: string;
  notes?: string;
  timestamp?: string;
}

export interface SheetInfo {
  sheetId: string;
  gid?: string;
}

/**
 * Extract Sheet ID and gid from Google Sheet URLs
 */
export function extractSheetInfo(urlOrId: string): SheetInfo {
  if (!urlOrId) return { sheetId: '' };
  const trimmed = urlOrId.trim();

  let sheetId = trimmed;
  let gid: string | undefined = undefined;

  const sheetIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetIdMatch) {
    sheetId = sheetIdMatch[1];
  }

  const gidMatch = trimmed.match(/gid=([0-9]+)/);
  if (gidMatch) {
    gid = gidMatch[1];
  }

  return { sheetId, gid };
}

export function extractSheetId(urlOrId: string): string {
  return extractSheetInfo(urlOrId).sheetId;
}

/**
 * Robust CSV Line Tokenizer that handles commas inside quotes and escaped quotes
 */
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Clean phone numbers to standard Pakistani format 03XXXXXXXXX
 */
export function cleanPhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[^0-9+]/g, '');

  if (cleaned.startsWith('+92')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('92')) {
    cleaned = '0' + cleaned.substring(2);
  } else if (cleaned.startsWith('0092')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.length === 10 && cleaned.startsWith('3')) {
    cleaned = '0' + cleaned;
  }

  cleaned = cleaned.replace(/[^0-9]/g, '');
  return cleaned;
}

/**
 * Parse budget numbers or text e.g. "2.5 Crore", "50 Lacs", "25,000,000"
 */
function parseBudgetValue(raw: string): number {
  if (!raw) return 18500000;
  const cleaned = raw.toLowerCase().trim();

  if (cleaned.includes('crore') || cleaned.includes('cr')) {
    const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return num * 10000000;
  }
  if (cleaned.includes('lac') || cleaned.includes('lakh')) {
    const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return num * 100000;
  }

  const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  return !isNaN(num) && num > 0 ? num : 18500000;
}

/**
 * Fetch Google Sheet CSV data with multiple fallback endpoints
 */
export async function fetchGoogleSheetCSV(urlOrId: string): Promise<{ csv: string; source: string; status: number }> {
  const { sheetId, gid } = extractSheetInfo(urlOrId || DEFAULT_GOOGLE_SHEET_URL);

  if (!sheetId) {
    throw new Error('Invalid Google Sheet ID or URL');
  }

  const endpoints = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${gid ? `&gid=${gid}` : ''}`,
    `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv${gid ? `&gid=${gid}` : ''}`,
  ];

  let lastStatus = 0;
  let lastErrorMsg = '';

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AsadCRM-SheetsSync/1.0',
        },
        cache: 'no-store',
      });

      lastStatus = res.status;
      if (res.ok) {
        const text = await res.text();
        // Ensure it returned actual CSV and not an HTML login page
        if (!text.includes('<!DOCTYPE html>') && !text.includes('<html') && text.includes(',')) {
          return { csv: text, source: url, status: res.status };
        }
      }
    } catch (err: any) {
      lastErrorMsg = err.message;
      console.warn(`[Google Sheets Fetch Failed on ${url}]:`, err.message);
    }
  }

  // If Google returned 401/403 or redirect to login (private sheet)
  const isPrivate = lastStatus === 401 || lastStatus === 403 || lastStatus === 302;
  const errorMsg = isPrivate
    ? `Google Sheet is private or requires permission. Please open the Google Sheet -> Click "Share" -> Change to "Anyone with the link can view", or use the real-time Apps Script Webhook.`
    : `Could not fetch Google Sheet CSV (Status: ${lastStatus || 'Failed'}). Error: ${lastErrorMsg || 'Please verify sheet sharing settings.'}`;

  throw new Error(errorMsg);
}

/**
 * Dynamic Column Matching CSV Parser for any Google Form or Custom Sheet headers
 */
export function parseCSVToLeads(csvText: string): ParsedSheetLead[] {
  const rawLines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (rawLines.length <= 1) return [];

  const headers = parseCSVLine(rawLines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ' '));

  // Intelligent column index mapping
  let nameCol = headers.findIndex((h) => /name|naam|client|customer|applicant|full\s*name/i.test(h));
  let phoneCol = headers.findIndex((h) => /phone|mobile|cell|contact|number|whatsapp|raabta/i.test(h));
  let emailCol = headers.findIndex((h) => /email|e\s*mail|mail/i.test(h));
  let societyCol = headers.findIndex((h) => /society|project|location|scheme|sector|interested\s*in|property/i.test(h));
  let sizeCol = headers.findIndex((h) => /size|marla|kanal|area|dimension|category/i.test(h));
  let budgetCol = headers.findIndex((h) => /budget|price|range|amount|investment|max\s*budget/i.test(h));
  let notesCol = headers.findIndex((h) => /note|comment|remark|message|query|inquiry|detail/i.test(h));
  let timeCol = headers.findIndex((h) => /timestamp|time|date/i.test(h));

  // Positional fallbacks if headers couldn't be detected
  if (nameCol === -1) nameCol = 0;
  if (phoneCol === -1) phoneCol = 1;
  if (emailCol === -1) emailCol = 2;
  if (societyCol === -1) societyCol = 3;
  if (sizeCol === -1) sizeCol = 4;
  if (budgetCol === -1) budgetCol = 5;
  if (notesCol === -1) notesCol = 6;

  const leads: ParsedSheetLead[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const cols = parseCSVLine(rawLines[i]);
    if (cols.length < 2) continue;

    const rawName = cols[nameCol] || cols[0] || '';
    const rawPhone = cols[phoneCol] || cols[1] || '';

    if (!rawName.trim() && !rawPhone.trim()) continue;

    const cleanedPhone = cleanPhoneNumber(rawPhone);
    const name = rawName.trim() || `Lead ${cleanedPhone.slice(-4)}`;

    leads.push({
      name,
      phone: cleanedPhone || rawPhone.trim(),
      email: emailCol !== -1 && cols[emailCol] ? cols[emailCol].trim() : undefined,
      preferredSociety: societyCol !== -1 && cols[societyCol] ? cols[societyCol].trim() : 'Kohistan Enclave',
      preferredSize: sizeCol !== -1 && cols[sizeCol] ? cols[sizeCol].trim() : '10 MARLA',
      budgetMax: budgetCol !== -1 && cols[budgetCol] ? parseBudgetValue(cols[budgetCol]) : 18500000,
      source: 'GOOGLE_SHEETS',
      notes: notesCol !== -1 && cols[notesCol] ? cols[notesCol].trim() : 'Ingested from Google Sheets Lead Form',
      timestamp: timeCol !== -1 && cols[timeCol] ? cols[timeCol].trim() : undefined,
    });
  }

  return leads;
}

/**
 * Main Sync Engine: Fetches, deduplicates, creates leads, assigns agents, and creates notifications
 */
export async function syncGoogleSheetsLeads(sheetUrlOrId?: string) {
  const targetUrl = sheetUrlOrId || DEFAULT_GOOGLE_SHEET_URL;
  const { sheetId, gid } = extractSheetInfo(targetUrl);

  if (!sheetId) {
    return { success: false, error: 'Invalid Google Sheets URL or ID' };
  }

  console.log(`[GOOGLE SHEETS SYNC] Synchronizing Sheet ID: "${sheetId}" (gid: ${gid || 'default'})`);

  let csvContent = '';
  try {
    const fetchResult = await fetchGoogleSheetCSV(targetUrl);
    csvContent = fetchResult.csv;
  } catch (err: any) {
    console.error('[Google Sheets Fetch Error]:', err.message);
    return {
      success: false,
      error: err.message,
      sheetId,
      gid,
      helpUrl: targetUrl,
      instruction:
        'Please ensure the Google Sheet permissions are set to "Anyone with the link can view", or use the real-time Google Apps Script trigger.',
    };
  }

  const parsedLeads = parseCSVToLeads(csvContent);

  if (parsedLeads.length === 0) {
    return {
      success: true,
      sheetId,
      importedCount: 0,
      skippedDuplicates: 0,
      totalParsed: 0,
      message: 'No lead rows found in the sheet.',
    };
  }

  let importedCount = 0;
  let skippedDuplicates = 0;
  const newLeadIds: string[] = [];
  const importedLeadsList: any[] = [];

  for (const item of parsedLeads) {
    if (!item.phone) {
      continue;
    }

    // Deduplicate against existing database phone numbers
    const existing = await prisma.lead.findFirst({
      where: { phone: item.phone },
    });

    if (existing) {
      skippedDuplicates++;
      continue;
    }

    // 1. Create Lead in CRM Database
    const createdLead = await prisma.lead.create({
      data: {
        name: item.name,
        phone: item.phone,
        email: item.email || null,
        source: 'GOOGLE_SHEETS',
        stage: 'NEW',
        score: 75,
        preferredSociety: item.preferredSociety || 'Kohistan Enclave',
        preferredSize: item.preferredSize || '10 MARLA',
        budgetMax: item.budgetMax || 18500000,
        notes: item.notes || 'Imported via Google Sheets Integration',
        assignedAgentId: null,
        assignedAt: null,
        slaStatus: 'ON_TRACK',
      },
    });

    // 2. Auto-distribute fairly via Round-Robin
    try {
      await assignLeadRoundRobin(createdLead.id);
    } catch (assignErr) {
      console.error('Round-robin assignment error for Google Sheets lead:', assignErr);
    }

    // 3. Trigger NEW_LEAD_CREATED Automation Workflow (WhatsApp greeting + 24h task)
    await triggerWorkflow('NEW_LEAD_CREATED', { leadId: createdLead.id });

    importedCount++;
    newLeadIds.push(createdLead.id);
    importedLeadsList.push({ id: createdLead.id, name: createdLead.name, phone: createdLead.phone });
  }

  // 4. Record Audit Trail
  await recordAuditLog({
    action: 'GOOGLE_SHEETS_LEADS_SYNCED',
    targetType: 'INTEGRATION',
    afterValue: {
      sheetId,
      gid,
      importedCount,
      skippedDuplicates,
      totalParsed: parsedLeads.length,
    },
  });

  return {
    success: true,
    sheetId,
    gid,
    importedCount,
    skippedDuplicates,
    totalParsed: parsedLeads.length,
    newLeadIds,
    importedLeads: importedLeadsList,
  };
}
