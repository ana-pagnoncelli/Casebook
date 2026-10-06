import { api } from '../api/client';
import type { ChecklistItem } from './item';

export async function listChecklistItems(): Promise<ChecklistItem[] | null> {
  const { data } = await api.GET('/checklist-items');
  return data ?? null;
}

export async function addChecklistItem(text: string): Promise<ChecklistItem | null> {
  const { data } = await api.POST('/checklist-items', { body: { text } });
  return data ?? null;
}

export async function updateChecklistItem(id: number, text: string): Promise<ChecklistItem | null> {
  const { data } = await api.PATCH('/checklist-items/{item_id}', {
    params: { path: { item_id: id } },
    body: { text },
  });
  return data ?? null;
}

export async function completeChecklistItem(id: number): Promise<ChecklistItem | null> {
  const { data } = await api.POST('/checklist-items/{item_id}/complete', {
    params: { path: { item_id: id } },
  });
  return data ?? null;
}

export async function removeChecklistItem(id: number): Promise<boolean> {
  const { error, response } = await api.DELETE('/checklist-items/{item_id}', {
    params: { path: { item_id: id } },
  });
  return !error && response.ok;
}
