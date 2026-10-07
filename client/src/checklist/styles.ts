import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
