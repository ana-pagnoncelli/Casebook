import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { api } from './src/api/client';
import type { components } from './src/api/schema';

type Item = components['schemas']['ChecklistItemResponse'];

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    return api
      .GET('/checklist-items')
      .then(({ data }) => {
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
    const { data } = await api.POST('/checklist-items', { body: { text: next } });
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
    const { data } = await api.PATCH('/checklist-items/{item_id}', {
      params: { path: { item_id: id } },
      body: { text: next },
    });
    if (!data) {
      setError('API unavailable');
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? data : item)));
    setEditingId(null);
    setError(null);
  }

  async function completeItem(id: number) {
    const { data } = await api.POST('/checklist-items/{item_id}/complete', {
      params: { path: { item_id: id } },
    });
    if (!data) {
      setError('API unavailable');
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? data : item)));
    setError(null);
  }

  async function removeItem(id: number) {
    const { error: apiError, response } = await api.DELETE('/checklist-items/{item_id}', {
      params: { path: { item_id: id } },
    });
    if (apiError || !response.ok) {
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
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="New item"
          onSubmitEditing={() => {
            void addItem();
          }}
        />
        <Pressable style={styles.button} onPress={() => void addItem()}>
          <Text>Add</Text>
        </Pressable>
      </View>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text>{error}</Text> : null}
      <ScrollView style={styles.list}>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            {editingId === item.id ? (
              <TextInput style={styles.input} value={draft} onChangeText={setDraft} />
            ) : (
              <Text style={item.completed ? styles.completed : styles.itemText}>{item.text}</Text>
            )}
            <View style={styles.row}>
              {editingId === item.id ? (
                <Pressable style={styles.button} onPress={() => void saveItem(item.id)}>
                  <Text>Save</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setEditingId(item.id);
                    setDraft(item.text);
                  }}
                >
                  <Text>Update</Text>
                </Pressable>
              )}
              {item.completed ? null : (
                <Pressable style={styles.button} onPress={() => void completeItem(item.id)}>
                  <Text>Complete</Text>
                </Pressable>
              )}
              <Pressable style={styles.button} onPress={() => void removeItem(item.id)}>
                <Text>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  list: {
    marginTop: 16,
  },
  item: {
    marginBottom: 12,
    gap: 8,
  },
  itemText: {
    fontSize: 16,
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
});
