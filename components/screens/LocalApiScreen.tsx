import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import config from '../../utils/config';

export default function LocalApiScreen({ navigation }: any) {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(config.READ)
      .then(res => res.json())
      .then(data => {
        setMangaList(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Gagal mengambil data dari PHP API');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color="#a78bfa" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Local Collection (PHP API)</Text>

      {/* Manga Section */}
      <Text style={styles.subTitle}>📚 Manga</Text>
      {mangaList.map((manga, index) => (
        <TouchableOpacity
          key={manga.id ?? index}
          style={styles.mangaItem}
          onPress={() =>
            navigation.navigate('MangaReader', {
              title: manga.title,
              pages: manga.pages,
            })
          }
        >
          <Image source={{ uri: manga.cover }} style={styles.mangaImage} />
          <Text style={styles.mangaLabel}>{manga.title}</Text>
        </TouchableOpacity>
      ))}

      {/* Shortcut ke Light Novel Screen */}
      <Text style={styles.subTitle}>📖 Light Novel</Text>
      <TouchableOpacity
        style={styles.shortcutButton}
        onPress={() => navigation.navigate('LightNovelScreen')}
      >
        <Text style={styles.shortcutText}>Buka Koleksi Light Novel</Text>
      </TouchableOpacity>

      {/* Shortcut ke Light Novel Editor */}
      <TouchableOpacity
        style={[styles.shortcutButton, { backgroundColor: '#a78bfa' }]}
        onPress={() => navigation.navigate('LightNovelEditorScreen')}
      >
        <Text style={styles.shortcutText}>✍️ Buat / Edit Light Novel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e1b2e', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  subTitle: { color: '#a78bfa', fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  mangaItem: { marginBottom: 16 },
  mangaImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#2a2540' },
  mangaLabel: { color: '#fff', fontSize: 14, marginTop: 8 },
  shortcutButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#2a2540',
    borderRadius: 8,
    alignItems: 'center',
  },
  shortcutText: { color: '#fff', fontSize: 14 },
});
