import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';

type Manga = {
  id: string;
  title: string;
  cover: string | null;
};

export default function MangaDexScreen({ navigation }: any) {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // debounce pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setOffset(0);
      setMangaList([]);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // ambil cover dari coverId
  const fetchCover = async (mangaId: string, coverId: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://api.mangadex.org/cover/${coverId}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      const fileName = data.data?.attributes?.fileName;
      return fileName
        ? `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
        : null;
    } catch {
      return null;
    }
  };

  // ambil daftar manga
  const fetchManga = async (searchTitle?: string, offsetValue: number = 0) => {
    setLoading(true);
    try {
      const baseUrl = 'https://api.mangadex.org/manga';
      const url = searchTitle
        ? `${baseUrl}?title=${encodeURIComponent(searchTitle)}&limit=10&offset=${offsetValue}`
        : `${baseUrl}?limit=10&offset=${offsetValue}`;

      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();

      const parsed: Manga[] = await Promise.all(
        data.data.map(async (item: any) => {
          const coverRel = item.relationships?.find((rel: any) => rel.type === 'cover_art');
          const coverUrl = coverRel?.id ? await fetchCover(item.id, coverRel.id) : null;

          // ✅ ambil judul multi-bahasa
          const titleObj = item.attributes.title || {};
          const title =
            titleObj.en ||
            titleObj['en-us'] ||
            titleObj['ja'] ||
            titleObj['jp-ro'] ||
            Object.values(titleObj)[0] ||
            'No Title';

          return {
            id: item.id,
            title,
            cover: coverUrl,
          };
        })
      );

      setMangaList(prev => {
        if (offsetValue === 0) return parsed;
        const merged = [...prev, ...parsed];
        // ✅ filter unik berdasarkan id
        const unique = merged.filter(
          (item, index, self) => index === self.findIndex(t => t.id === item.id)
        );
        return unique;
      });

      setHasMore(parsed.length > 0);
      setError(null);
    } catch (err) {
      console.error('Fetch MangaDex error:', err);
      setError('Gagal mengambil data dari MangaDex');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga(debouncedQuery, 0);
  }, [debouncedQuery]);

  const loadMore = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    fetchManga(debouncedQuery, newOffset);
  };

  const renderItem = ({ item }: { item: Manga }) => (
    <TouchableOpacity
      style={styles.mangaItem}
      onPress={() =>
        navigation.navigate('MangaReader', {
          mangaId: item.id,
          title: item.title,
        })
      }
    >
      {item.cover ? (
        <Image source={{ uri: item.cover }} style={styles.mangaImage} />
      ) : (
        <View style={styles.mangaImagePlaceholder}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}
      <Text style={styles.mangaLabel}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MangaDex Online</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari manga..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color="#a78bfa" />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && mangaList.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.noResultText}>No results found</Text>
        </View>
      )}

      <FlatList
        data={mangaList}
        keyExtractor={(item, index) => item.id + '-' + index} // ✅ key unik
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={
          !loading && hasMore ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load more</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1b2e', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  searchContainer: { marginBottom: 12 },
  searchInput: {
    backgroundColor: '#2a2540',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  mangaItem: { marginBottom: 16 },
  mangaImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#2a2540' },
  mangaImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#2a2540',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#aaa' },
  mangaLabel: { color: '#fff', fontSize: 14, marginTop: 8 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 8 },
  errorText: { color: 'red' },
  noResultText: { color: '#fff', marginTop: 8, fontStyle: 'italic' },
  loadMoreButton: {
    backgroundColor: '#a78bfa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  loadMoreText: { color: '#fff', fontWeight: 'bold' },
});
