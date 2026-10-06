import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Checklist } from './src/checklist/checklist';

export default function App() {
  return (
    <View style={styles.container}>
      <Checklist />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
