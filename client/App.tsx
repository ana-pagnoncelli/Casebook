import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { api } from './src/api/client';

export default function App() {
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .GET('/health')
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setCheckedAt(data.checked_at);
        else setError('API unavailable');
      })
      .catch(() => {
        if (!cancelled) setError('API unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casebook</Text>
      {checkedAt ? <Text>API ok · {checkedAt}</Text> : error ? <Text>{error}</Text> : <ActivityIndicator />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 12,
  },
});
