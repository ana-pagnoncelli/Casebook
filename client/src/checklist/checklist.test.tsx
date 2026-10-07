import { expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Checklist } from './checklist';
import { completeChecklistItem, listChecklistItems } from './functions';
import type { ChecklistItem } from './item';

jest.mock('./functions', () => ({
  listChecklistItems: jest.fn(),
  addChecklistItem: jest.fn(),
  updateChecklistItem: jest.fn(),
  completeChecklistItem: jest.fn(),
  removeChecklistItem: jest.fn(),
}));

const listChecklistItemsMock = jest.mocked(listChecklistItems);
const completeChecklistItemMock = jest.mocked(completeChecklistItem);

const item: ChecklistItem = { id: 1, text: 'Buy milk', completed: false };

it('strikes through a completed item and hides Complete', async () => {
  listChecklistItemsMock.mockResolvedValue([item]);
  completeChecklistItemMock.mockResolvedValue({ ...item, completed: true });

  await render(<Checklist />);

  expect(await screen.findByText('Buy milk')).toBeTruthy();
  await fireEvent.press(screen.getByText('Complete'));

  await waitFor(() => {
    expect(screen.queryByText('Complete')).toBeNull();
  });
  expect(StyleSheet.flatten(screen.getByText('Buy milk').props.style)).toEqual(
    expect.objectContaining({ textDecorationLine: 'line-through' }),
  );
});
