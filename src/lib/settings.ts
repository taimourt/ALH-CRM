import { prisma } from './db';

export const SYSTEM_SETTING_KEYS = {
  ROUND_ROBIN_LEAD_DISTRIBUTION: 'ROUND_ROBIN_LEAD_DISTRIBUTION',
} as const;

export interface RoundRobinSettingValue {
  enabled: boolean;
  mode?: 'FAIR_ROTATION' | 'UNASSIGNED_POOL';
  updatedAt?: string;
  updatedBy?: string;
}

/**
 * Fetch a typed system setting with fallback
 */
export async function getSystemSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!setting || !setting.value) {
      return defaultValue;
    }

    try {
      return JSON.parse(setting.value) as T;
    } catch {
      return setting.value as unknown as T;
    }
  } catch (err) {
    console.error(`[SystemSetting] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Save or update a system setting
 */
export async function setSystemSetting<T>(
  key: string,
  value: T,
  description?: string,
  updatedBy?: string
): Promise<void> {
  const stringified = typeof value === 'string' ? value : JSON.stringify(value);
  const now = new Date();

  await prisma.systemSetting.upsert({
    where: { key },
    update: {
      value: stringified,
      description: description || undefined,
      updatedBy: updatedBy || undefined,
      updatedAt: now,
    },
    create: {
      key,
      value: stringified,
      description: description || undefined,
      updatedBy: updatedBy || undefined,
      createdAt: now,
      updatedAt: now,
    },
  });
}

/**
 * Check whether automated Round-Robin lead distribution is enabled
 * Defaults to true if not explicitly disabled.
 */
export async function isRoundRobinEnabled(): Promise<boolean> {
  try {
    const setting = await getSystemSetting<RoundRobinSettingValue | boolean>(
      SYSTEM_SETTING_KEYS.ROUND_ROBIN_LEAD_DISTRIBUTION,
      { enabled: true }
    );

    if (typeof setting === 'boolean') {
      return setting;
    }

    if (setting && typeof setting === 'object' && 'enabled' in setting) {
      return Boolean(setting.enabled);
    }

    return true;
  } catch (err) {
    console.error('[Settings] Failed to check Round-Robin status, fallback to true:', err);
    return true;
  }
}

/**
 * Enable or disable Round-Robin lead distribution
 */
export async function setRoundRobinEnabled(
  enabled: boolean,
  actorName?: string
): Promise<{ enabled: boolean; updatedAt: Date; updatedBy?: string }> {
  const now = new Date();
  const payload: RoundRobinSettingValue = {
    enabled,
    mode: enabled ? 'FAIR_ROTATION' : 'UNASSIGNED_POOL',
    updatedAt: now.toISOString(),
    updatedBy: actorName || 'System Admin',
  };

  await setSystemSetting(
    SYSTEM_SETTING_KEYS.ROUND_ROBIN_LEAD_DISTRIBUTION,
    payload,
    'Master toggle controlling whether inbound leads are auto-distributed via Round-Robin or held in unassigned pool.',
    actorName
  );

  return {
    enabled,
    updatedAt: now,
    updatedBy: actorName,
  };
}

/**
 * Get detailed metadata about the current Round-Robin setting
 */
export async function getRoundRobinSettingDetails(): Promise<{
  enabled: boolean;
  updatedAt: Date | null;
  updatedBy: string | null;
}> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: SYSTEM_SETTING_KEYS.ROUND_ROBIN_LEAD_DISTRIBUTION },
    });

    if (!setting) {
      return { enabled: true, updatedAt: null, updatedBy: null };
    }

    let isEnabled = true;
    try {
      const parsed = JSON.parse(setting.value);
      if (typeof parsed === 'boolean') isEnabled = parsed;
      else if (parsed && typeof parsed.enabled === 'boolean') isEnabled = parsed.enabled;
    } catch {
      isEnabled = setting.value === 'true' || setting.value === '1';
    }

    return {
      enabled: isEnabled,
      updatedAt: setting.updatedAt,
      updatedBy: setting.updatedBy || null,
    };
  } catch (err) {
    console.error('[Settings] Error fetching Round-Robin details:', err);
    return { enabled: true, updatedAt: null, updatedBy: null };
  }
}
