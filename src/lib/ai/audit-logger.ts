export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  actor: 'ASAD_AI' | 'SYSTEM' | 'HUMAN_AGENT' | 'CUSTOMER';
  conversationId?: string;
  channel?: string;
  action: string;
  result?: string;
  details?: Record<string, unknown>;
}

export function logAuditEntry(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const fullLog: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[ALH Audit Log]:', JSON.stringify(fullLog));
  }

  return fullLog;
}
