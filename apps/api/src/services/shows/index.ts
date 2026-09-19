import { v4 as uuidv4 } from 'uuid';
import type { Show } from '@sovereign/contracts';

const shows = new Map<string, Show>();

export const showsService = {
  async create(data: Omit<Show, 'id' | 'createdAt'>): Promise<Show> {
    const show: Show = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    shows.set(show.id, show);
    return show;
  },

  async list(userId: string): Promise<Show[]> {
    return Array.from(shows.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string, userId: string): Promise<Show | null> {
    const show = shows.get(id);
    if (!show || show.userId !== userId) return null;
    return show;
  },

  async getByShareId(shareId: string): Promise<Show | null> {
    return Array.from(shows.values()).find((s) => s.shareId === shareId) || null;
  },

  async delete(id: string, userId: string) {
    const show = shows.get(id);
    if (show?.userId === userId) shows.delete(id);
  },

  async createShare(id: string, userId: string): Promise<string> {
    const show = shows.get(id);
    if (!show || show.userId !== userId) throw new Error('Not found');
    const shareId = uuidv4().slice(0, 8);
    show.shareId = shareId;
    return shareId;
  },
};
