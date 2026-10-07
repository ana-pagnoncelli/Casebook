import { beforeEach, expect, it, jest } from '@jest/globals';

import {
  addChecklistItem,
  completeChecklistItem,
  listChecklistItems,
  removeChecklistItem,
  updateChecklistItem,
} from './functions';
import type { ChecklistItem } from './item';

const item: ChecklistItem = { id: 1, text: 'Buy milk', completed: false };
const fetchMock = jest.mocked(globalThis.fetch);

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function respondWith(response: Response): void {
  fetchMock.mockResolvedValue(response);
}

function requestOf(): Request {
  const request = fetchMock.mock.calls[0]?.[0];
  if (!(request instanceof Request)) {
    throw new Error('expected fetch to be called with a Request');
  }
  return request;
}

beforeEach(() => {
  fetchMock.mockReset();
});

it('lists items', async () => {
  respondWith(jsonResponse(200, [item]));

  await expect(listChecklistItems()).resolves.toEqual([item]);
});

it('returns null when the list request fails', async () => {
  respondWith(jsonResponse(500, { detail: 'unavailable' }));

  await expect(listChecklistItems()).resolves.toBeNull();
});

it('adds an item', async () => {
  respondWith(jsonResponse(201, item));

  await expect(addChecklistItem('Buy milk')).resolves.toEqual(item);
  const request = requestOf();
  expect(request.method).toBe('POST');
  expect(new URL(request.url).pathname).toBe('/checklist-items');
});

it('returns null when adding fails', async () => {
  respondWith(jsonResponse(422, { detail: 'invalid' }));

  await expect(addChecklistItem('')).resolves.toBeNull();
});

it('updates an item', async () => {
  const updated: ChecklistItem = { ...item, text: 'Buy oats' };
  respondWith(jsonResponse(200, updated));

  await expect(updateChecklistItem(1, 'Buy oats')).resolves.toEqual(updated);
  const request = requestOf();
  expect(request.method).toBe('PATCH');
  expect(new URL(request.url).pathname).toBe('/checklist-items/1');
});

it('returns null when updating fails', async () => {
  respondWith(jsonResponse(404, { detail: 'not found' }));

  await expect(updateChecklistItem(99, 'Buy oats')).resolves.toBeNull();
});

it('completes an item', async () => {
  const completed: ChecklistItem = { ...item, completed: true };
  respondWith(jsonResponse(200, completed));

  await expect(completeChecklistItem(1)).resolves.toEqual(completed);
  const request = requestOf();
  expect(request.method).toBe('POST');
  expect(new URL(request.url).pathname).toBe('/checklist-items/1/complete');
});

it('returns null when completing fails', async () => {
  respondWith(jsonResponse(404, { detail: 'not found' }));

  await expect(completeChecklistItem(99)).resolves.toBeNull();
});

it('removes an item', async () => {
  respondWith(new Response(null, { status: 204 }));

  await expect(removeChecklistItem(1)).resolves.toBe(true);
  const request = requestOf();
  expect(request.method).toBe('DELETE');
  expect(new URL(request.url).pathname).toBe('/checklist-items/1');
});

it('returns false when removing fails', async () => {
  respondWith(jsonResponse(404, { detail: 'not found' }));

  await expect(removeChecklistItem(99)).resolves.toBe(false);
});
