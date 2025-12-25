import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../utils/config';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Username dan password wajib diisi');
      return;
    }

    try {
      const response = await fetch(config.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // simpan session ke AsyncStorage
        await AsyncStorage.setItem('user_id', String(data.user_id));
        await AsyncStorage.setItem('username', data.username);

        navigation.replace('MainTabs');
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (error) {
      alert('Terjadi error koneksi ke server');
    }
  };

  const handleAnonymousLogin = async () => {
    // simpan status guest
    await AsyncStorage.setItem('username', 'Guest');
    await AsyncStorage.setItem('user_id', '0');
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnon} onPress={handleAnonymousLogin}>
        <Text style={styles.buttonText}>Login as Guest</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1b2e', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#a78bfa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonAnon: {
    backgroundColor: '#4ade80',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#a78bfa', textAlign: 'center', marginTop: 12 },
});
