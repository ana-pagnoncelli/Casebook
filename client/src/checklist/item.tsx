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
      {editing ? (
        <TextInput style={styles.input} value={draft} onChangeText={onDraftChange} />
      ) : (
        <Text style={item.completed ? styles.completed : styles.itemText}>{item.text}</Text>
      )}
      <View style={styles.row}>
        {editing ? (
          <Pressable style={styles.button} onPress={onSave}>
            <Text>Save</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={onUpdate}>
            <Text>Update</Text>
          </Pressable>
        )}
        {item.completed ? null : (
          <Pressable style={styles.button} onPress={onComplete}>
            <Text>Complete</Text>
          </Pressable>
        )}
        <Pressable style={styles.button} onPress={onRemove}>
          <Text>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}
