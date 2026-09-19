import { config } from '../../config.js';
import type { QuotaResponse } from '@sovereign/contracts';

const usage = new Map<string, { date: string; count: number }>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const quotaService = {
  async check(userId: string): Promise<QuotaResponse> {
    const entry = usage.get(userId);
    const t = today();
    const used = entry && entry.date === t ? entry.count : 0;
    const limit = config.quota.dailyLimit;
    return {
      allowed: used < limit,
      limit,
      remaining: Math.max(0, limit - used),
      used,
    };
  },

  async increment(userId: string) {
    const t = today();
    const entry = usage.get(userId);
    if (!entry || entry.date !== t) {
      usage.set(userId, { date: t, count: 1 });
    } else {
      entry.count += 1;
    }
  },
};
