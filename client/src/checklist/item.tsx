import { Feather } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { components } from '../api/schema';

import { styles } from './styles';

export type ChecklistItem = components['schemas']['ChecklistItemResponse'];

type ChecklistItemProps = {
  item: ChecklistItem;
  editing: boolean;
  draft: string;
  onDraftChange: (text: string) => void;
  onUpdate: () => void;
  onSave: () => void;
  onComplete: () => void;
  onRemove: () => void;
};

export function ChecklistItemView({
  item,
  editing,
  draft,
  onDraftChange,
  onUpdate,
  onSave,
  onComplete,
  onRemove,
}: ChecklistItemProps) {
  return (
    <View style={styles.item}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={item.completed ? 'Completed' : 'Complete'}
        accessibilityState={{ checked: item.completed }}
        disabled={item.completed}
        onPress={onComplete}
        style={[styles.checkbox, item.completed ? styles.checkboxChecked : null]}
      >
        {item.completed ? <Feather name="check" size={14} color="#fff" /> : null}
      </Pressable>
      {editing ? (
        <TextInput style={styles.itemInput} value={draft} onChangeText={onDraftChange} />
      ) : (
        <Text style={item.completed ? styles.completed : styles.itemText}>{item.text}</Text>
      )}
      {editing ? (
        <Pressable accessibilityLabel="Save" onPress={onSave} style={styles.iconButton}>
          <Feather name="check" size={18} color="#2FCB8A" />
        </Pressable>
      ) : (
        <Pressable accessibilityLabel="Edit" onPress={onUpdate} style={styles.iconButton}>
          <Feather name="edit-2" size={18} color="#98A2B3" />
        </Pressable>
      )}
      <Pressable accessibilityLabel="Delete" onPress={onRemove} style={styles.iconButton}>
        <Feather name="trash-2" size={18} color="#E15B64" />
      </Pressable>
    </View>
  );
}
