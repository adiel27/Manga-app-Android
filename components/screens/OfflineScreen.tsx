import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  OfflineScreen: undefined;
  PageViewer: { pages: string[]; startIndex: number };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'OfflineScreen'>;
};

type OfflineItem = {
  dirName: string;
  displayName: string;
  pageCount: number;
};

export default function OfflineScreen({ navigation }: Props) {
  const [offlineChapters, setOfflineChapters] = useState<OfflineItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 🔎 Parse nama folder jadi ramah + timestamp
  const parseName = (folder: string): string => {
    if (folder.startsWith('manga-')) {
      const parts = folder.split('-');
      const mangaId = parts[1] || 'Unknown';
      const chapterId = parts[3] || 'Unknown';

      // ambil timestamp (gabungan sisa parts setelah index 4)
      const timestampRaw = parts.slice(4).join('-');
      let savedAt = '';
      try {
        const date = new Date(timestampRaw.replace(/-/g, ':')); // convert balik
        savedAt = date.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        savedAt = timestampRaw;
      }

      return `Manga ${mangaId} - Chapter ${chapterId} (saved ${savedAt})`;
    } else if (folder.startsWith('chapter-')) {
      return `Chapter ${folder.replace('chapter-', '')}`;
    }
    return folder;
  };

  const loadOffline = async () => {
    try {
      const dir = (FileSystem as any).documentDirectory || '';
      const files = await FileSystem.readDirectoryAsync(dir);

      const chapters: OfflineItem[] = [];
      for (const f of files) {
        if (f.startsWith('chapter-') || f.startsWith('manga-')) {
          const folderPath = dir + f + '/';
          const pageFiles = await FileSystem.readDirectoryAsync(folderPath);
          const pageCount = pageFiles.filter(
            (pf: string) => pf.endsWith('.jpg') || pf.endsWith('.png')
          ).length;

          chapters.push({
            dirName: f,
            displayName: parseName(f),
            pageCount,
          });
        }
      }

      chapters.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setOfflineChapters(chapters);
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOffline();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOffline();
    setRefreshing(false);
  };

  const openChapter = async (chapterDir: string) => {
    try {
      const dir = (FileSystem as any).documentDirectory + chapterDir + '/';
      const files = await FileSystem.readDirectoryAsync(dir);

      const pages = files
        .filter((f: string) => f.endsWith('.jpg') || f.endsWith('.png'))
        .sort()
        .map((f: string) => dir + f);

      if (pages.length === 0) {
        Alert.alert('Error', 'Tidak ada halaman di folder offline ini.');
        return;
      }

      navigation.navigate('PageViewer', { pages, startIndex: 0 });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Gagal membuka chapter offline.');
    }
  };

  const clearCache = async () => {
    Alert.alert('Confirm', 'Yakin mau hapus semua cache offline?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const dir = (FileSystem as any).documentDirectory || '';
            const files = await FileSystem.readDirectoryAsync(dir);

            for (const f of files) {
              if (f.startsWith('chapter-') || f.startsWith('manga-')) {
                await FileSystem.deleteAsync(dir + f, { idempotent: true });
              }
            }

            setOfflineChapters([]);
            Alert.alert('Cache cleared', 'Semua chapter offline sudah dihapus.');
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Gagal hapus cache.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Chapters</Text>

      <TouchableOpacity style={styles.clearButton} onPress={clearCache}>
        <Text style={styles.clearText}>🗑️ Clear Offline Cache</Text>
      </TouchableOpacity>

      <FlatList
        data={offlineChapters}
        keyExtractor={(item) => item.dirName}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChapter(item.dirName)}>
            <Text style={styles.itemText}>
              {item.displayName} ({item.pageCount} pages)
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
            Belum ada chapter offline
          </Text>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1b2e', padding: 12 },
  title: { color: '#fff', fontSize: 18, marginBottom: 12 },
  clearButton: {
    padding: 10,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  clearText: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 12, backgroundColor: '#333', marginBottom: 8, borderRadius: 6 },
  itemText: { color: '#fff' },
});
