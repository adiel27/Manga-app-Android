import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const mangaList = [ /* ... daftar manga ... */ ];

export default function Homescreen({ navigation }: any) {
  const handleLogout = () => navigation.replace('Login');
  const openManga = (manga: any) =>
    navigation.navigate('MangaReader', { title: manga.title, pages: manga.pages });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top','left','right']}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          {/* ✅ langsung navigate ke ProfileScreen */}
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Ionicons name="person-circle" size={32} color="#a78bfa" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image source={require('../../assets/apothecary.jpg')} style={styles.bannerImage} />
          <Text style={styles.bannerTitle}>Today's Recommendation</Text>
          <Text style={styles.mangaTitle}>The Apothecary Diaries</Text>
          <TouchableOpacity
            style={styles.readButton}
            onPress={() =>
              openManga({
                title: 'The Apothecary Diaries',
                pages: [
                  'https://via.placeholder.com/1080x1600/1e1b2e/ffffff?text=Apothecary+Page+1',
                  'https://via.placeholder.com/1080x1600/1e1b2e/ffffff?text=Apothecary+Page+2',
                ],
              })
            }
          >
            <Text style={styles.readText}>Read</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Release */}
        <Text style={styles.sectionTitle}>Latest Release</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {mangaList.map((manga, index) => (
            <TouchableOpacity key={index} style={styles.mangaItem} onPress={() => openManga(manga)}>
              <Image source={manga.image} style={styles.mangaImage} />
              <Text style={styles.mangaLabel}>{manga.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Comic List */}
        <Text style={styles.sectionTitle}>Comic List</Text>
        <View style={styles.comicList}>
          <Text style={styles.subTitle}>Recommendations</Text>
          <TouchableOpacity
            onPress={() =>
              openManga({
                title: 'The Apothecary Diaries',
                pages: [
                  'https://via.placeholder.com/1080x1600/1e1b2e/ffffff?text=Apothecary+Page+1',
                  'https://via.placeholder.com/1080x1600/1e1b2e/ffffff?text=Apothecary+Page+2',
                ],
              })
            }
          >
            <Text style={styles.comicItem}>• The Apothecary Diaries</Text>
          </TouchableOpacity>

          <Text style={styles.subTitle}>Latest</Text>
          {mangaList.map((manga, index) => (
            <TouchableOpacity key={index} onPress={() => openManga(manga)}>
              <Text style={styles.comicItem}>• {manga.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1b2e' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  banner: { alignItems: 'center', marginBottom: 24 },
  bannerImage: { width: '100%', height: 180, borderRadius: 12 },
  bannerTitle: { color: '#aaa', fontSize: 14, marginTop: 8 },
  mangaTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  readButton: { backgroundColor: '#a78bfa', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 20 },
  readText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  horizontalScroll: { marginBottom: 24 },
  mangaItem: { marginRight: 12, width: 100 },
  mangaImage: { width: 100, height: 140, borderRadius: 8 },
  mangaLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  comicList: { backgroundColor: '#2a2540', padding: 12, borderRadius: 8 },
  subTitle: { color: '#a78bfa', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  comicItem: { color: '#fff', fontSize: 14, marginVertical: 2 },
  logoutButton: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
