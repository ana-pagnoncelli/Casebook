import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import {
  addChecklistItem,
  completeChecklistItem,
  listChecklistItems,
  removeChecklistItem,
  updateChecklistItem,
} from './functions';
import { ChecklistItemView } from './item';
import type { ChecklistItem } from './item';
import { styles } from './styles';

const mockedItemCount = 4;

export function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    return listChecklistItems()
      .then((data) => {
        if (data) {
          setItems(data);
          setError(null);
        } else {
          setError('API unavailable');
        }
      })
      .catch(() => setError('API unavailable'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function addItem() {
    const next = text.trim();
    if (!next) return;
    const data = await addChecklistItem(next);
    if (!data) {
      setError('API unavailable');
      return;
    }
    setText('');
    setItems((current) => [...current, data]);
    setError(null);
  }

  async function saveItem(id: number) {
    const next = draft.trim();
    if (!next) return;
    const data = await updateChecklistItem(id, next);
    if (!data) {
      setError('API unavailable');
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? data : item)));
    setEditingId(null);
    setError(null);
  }

  async function completeItem(id: number) {
    const data = await completeChecklistItem(id);
    if (!data) {
      setError('API unavailable');
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? data : item)));
    setError(null);
  }

  async function removeItem(id: number) {
    const removed = await removeChecklistItem(id);
    if (!removed) {
      setError('API unavailable');
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
    setError(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checklist</Text>
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>Anytime</Text>
          </View>
          <Text style={styles.count}>{mockedItemCount} items</Text>
        </View>
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            value={text}
            onChangeText={setText}
            placeholder="Add a new item..."
            placeholderTextColor="#A0A8B4"
            onSubmitEditing={() => {
              void addItem();
            }}
          />
          <Pressable accessibilityLabel="Add" onPress={() => void addItem()} style={styles.iconButton}>
            <Feather name="plus" size={18} color="#98A2B3" />
          </Pressable>
        </View>
        {loading ? <ActivityIndicator /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ScrollView style={styles.list}>
          {items.map((item) => (
            <ChecklistItemView
              key={item.id}
              item={item}
              editing={editingId === item.id}
              draft={draft}
              onDraftChange={setDraft}
              onUpdate={() => {
                setEditingId(item.id);
                setDraft(item.text);
              }}
              onSave={() => void saveItem(item.id)}
              onComplete={() => void completeItem(item.id)}
              onRemove={() => void removeItem(item.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
