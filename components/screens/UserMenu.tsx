import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
  userName: string;
  isGuest: boolean;
};

export default function UserMenu({
  visible,
  onClose,
  onLogout,
  onChangePassword,
  userName,
  isGuest,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>👤 User: {isGuest ? 'Guest' : userName}</Text>
          <Text style={styles.infoText}>🔑 Status: {isGuest ? 'Guest Mode' : 'Logged In'}</Text>

          <TouchableOpacity
            style={[styles.menuButton, isGuest && styles.disabledButton]}
            onPress={!isGuest ? onChangePassword : undefined}
            disabled={isGuest}
          >
            <Text style={[styles.menuText, isGuest && styles.disabledText]}>🔒 Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={onLogout}>
            <Text style={styles.menuText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 8,
    width: 280,
  },
  close: { color: '#fff', textAlign: 'right', marginBottom: 10 },
  infoText: { color: '#fff', fontSize: 16, marginVertical: 4 },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#444',
    borderRadius: 6,
    marginTop: 12,
  },
  menuText: { color: '#fff', fontSize: 16 },
  disabledButton: { backgroundColor: '#555' },
  disabledText: { color: '#aaa' },
});
