import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../utils/config';

export default function ProfileScreen({ navigation }: any) {
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const username = storedUsername ?? 'adiel'; // fallback untuk test

        const res = await fetch(`${config.PROFILE}?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (data.success) {
          setUserName(data.username);
        } else {
          setError(data.message || 'Gagal mengambil profil');
        }
      } catch (err) {
        setError('Gagal koneksi ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['username', 'token']);
    navigation.replace('Login');
  };

  const handleChangePassword = () => navigation.navigate('ChangePasswordScreen');

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Konfirmasi',
      'Yakin mau hapus akun ini? Data tidak bisa dikembalikan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedUsername = await AsyncStorage.getItem('username');
              const username = storedUsername ?? userName;

              const res = await fetch(config.DELETE_ACCOUNT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}`
              });

              const data = await res.json();
              if (data.success) {
                await AsyncStorage.multiRemove(['username', 'token']);
                Alert.alert('Berhasil', 'Akun sudah dihapus.');
                navigation.replace('Login');
              } else {
                Alert.alert('Error', data.message || 'Gagal hapus akun');
              }
            } catch (err) {
              Alert.alert('Error', 'Gagal koneksi ke server');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top','left','right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#a78bfa" />
        ) : error ? (
          <View style={styles.infoBox}>
            <Text style={styles.info}>⚠️ {error}</Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.info}>👤 User: {userName}</Text>
            <Text style={styles.info}>🔑 Status: Logged In</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>🔒 Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#ef4444' }]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>🗑️ Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1b2e' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  infoBox: { marginBottom: 20, padding: 12, backgroundColor: '#2a2540', borderRadius: 8 },
  info: { color: '#fff', fontSize: 16, marginVertical: 4 },
  button: { backgroundColor: '#444', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});
