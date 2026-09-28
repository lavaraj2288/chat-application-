import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { COLORS } from '../theme/colors';

export const PollCreationModal = ({ visible, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const handleOptionChange = (text, index) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
    if (error) setError('');
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      setError('Please enter a poll question');
      return;
    }
    const validOptions = options.filter((o) => o.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 poll options');
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions.map((opt, idx) => ({ id: idx, text: opt.trim(), votes: 0 }))
    });

    setQuestion('');
    setOptions(['', '']);
    setError('');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>📊 Create a Poll</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}

            <Text style={styles.label}>Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Ask a question..."
              placeholderTextColor={COLORS.textMuted}
              value={question}
              onChangeText={setQuestion}
            />

            <Text style={styles.label}>Options</Text>
            {options.map((opt, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`+ Add option ${index + 1}`}
                placeholderTextColor={COLORS.textMuted}
                value={opt}
                onChangeText={(text) => handleOptionChange(text, index)}
              />
            ))}

            {options.length < 5 && (
              <TouchableOpacity style={styles.addBtn} onPress={handleAddOption}>
                <Text style={styles.addBtnText}>+ Add Option</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create Poll ➤</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 20, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#1F2C34',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  content: {
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E9EDEF',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#111B21',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#E9EDEF',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  errorText: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  addBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
