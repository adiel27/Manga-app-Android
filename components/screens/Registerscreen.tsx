import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import config from '../../utils/config'; // path ke config.js

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username dan password wajib diisi');
      return;
    }

    try {
      const response = await fetch(config.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Sukses', 'Akun berhasil dibuat');
        navigation.replace('Login'); // setelah register, balik ke login
      } else {
        Alert.alert('Register gagal', result.error || 'Username sudah dipakai');
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak bisa terhubung ke server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1b2e', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#2a2540', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#a78bfa', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#a78bfa', marginTop: 16, textAlign: 'center' },
});
