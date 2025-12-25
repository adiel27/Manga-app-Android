import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import config from '../../utils/config';

export default function LightNovelEditor({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Judul dan isi novel wajib diisi');
      return;
    }

    try {
      const response = await fetch(config.CREATE_LIGHTNOVEL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, cover, content }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Sukses', 'Light novel berhasil dibuat');
        navigation.goBack();
      } else {
        Alert.alert('Gagal', result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak bisa terhubung ke server');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#1e1b2e' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tulis Light Novel</Text>

        <TextInput
          style={styles.input}
          placeholder="Judul"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Link Cover (opsional)"
          placeholderTextColor="#888"
          value={cover}
          onChangeText={setCover}
        />

        <TextInput
          style={styles.editor}
          placeholder="Isi cerita..."
          placeholderTextColor="#888"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          scrollEnabled
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#2a2540', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  editor: { backgroundColor: '#2a2540', color: '#fff', padding: 12, borderRadius: 8, minHeight: 250, marginBottom: 12 },
  button: { backgroundColor: '#a78bfa', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
