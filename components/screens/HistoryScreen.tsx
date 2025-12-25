import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface HistoryItem {
  title: string;
  lastIndex: number;
  updatedAt: number;
  pages?: string[];
  mangaId?: string;
  chapterId?: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigation = useNavigation<any>();

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('history');
      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.log('Error loading history', e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setHistory([]);
      Alert.alert('Info', 'History cleared');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear history');
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('PageViewer', {
          title: item.title,
          pages: item.pages,
          startIndex: item.lastIndex,
          mangaId: item.mangaId,
          chapterId: item.chapterId,
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.detail}>Last page: {item.lastIndex + 1}</Text>
      <Text style={styles.date}>{new Date(item.updatedAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.empty}>No history yet</Text>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={renderItem}
          />
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearText}>🗑 Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e19', padding: 16 },
  item: {
    padding: 16,
    backgroundColor: '#1e1b2e',
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  detail: { color: '#ccc', fontSize: 14, marginTop: 4 },
  date: { color: '#aaa', fontSize: 12, marginTop: 2 },
  empty: { color: '#888', textAlign: 'center', marginTop: 32 },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: { color: '#fff', fontWeight: 'bold' },
});
