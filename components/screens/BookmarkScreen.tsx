import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface BookmarkItem {
  mangaId?: string;
  chapterId?: string;
  title: string;
  cover?: string;
  pages: string[];
  savedAt: number;
}

export default function BookmarkScreen() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const navigation = useNavigation<any>();

  const loadBookmarks = async () => {
    try {
      const data = await AsyncStorage.getItem('bookmarks');
      if (data) {
        setBookmarks(JSON.parse(data));
      } else {
        setBookmarks([]);
      }
    } catch (e) {
      console.log('Error loading bookmarks', e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const removeBookmark = async (index: number) => {
    try {
      const updated = [...bookmarks];
      updated.splice(index, 1);
      setBookmarks(updated);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
      Alert.alert('Info', 'Bookmark dihapus');
    } catch (e) {
      Alert.alert('Error', 'Gagal menghapus bookmark');
    }
  };

  const renderItem = ({ item, index }: { item: BookmarkItem; index: number }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.content}
        onPress={() =>
          navigation.navigate('PageViewer', {
            title: item.title,
            pages: item.pages,   // ✅ kirim pages
            cover: item.cover,
            mangaId: item.mangaId,
            chapterId: item.chapterId,
            startIndex: 0,
          })
        }
      >
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.cover} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>
            {new Date(item.savedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeBookmark(index)}
      >
        <Text style={styles.deleteText}>❌</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {bookmarks.length === 0 ? (
        <Text style={styles.empty}>No bookmarks yet</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e19', padding: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1b2e',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: { flexDirection: 'row', flex: 1, padding: 12 },
  cover: { width: 60, height: 80, borderRadius: 4, marginRight: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  date: { color: '#aaa', fontSize: 12, marginTop: 4 },
  deleteButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  deleteText: { color: '#fff', fontSize: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 32 },
});
