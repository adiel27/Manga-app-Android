import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen({ navigation }: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match!');
      return;
    }
    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
      );
      return;
    }
    // TODO: Integrasi ke backend untuk update password
    console.log('Password changed:', { oldPassword, newPassword });
    Alert.alert('Success', 'Password successfully changed!');
    navigation.goBack(); // kembali ke ProfileScreen
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top','left','right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Old Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1b2e' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#2a2540',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#a78bfa',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
