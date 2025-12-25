import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import config from '../../utils/config';

export default function LightNovelScreen({ navigation }: any) {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(config.READ_LIGHTNOVEL)
      .then(res => res.json())
      .then(data => {
        setNovels(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal mengambil data light novel');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#a78bfa" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Light Novel Collection</Text>
      {novels.map((novel) => (
        <TouchableOpacity
          key={novel.id}
          style={styles.novelItem}
          onPress={() => navigation.navigate('NovelReader', { novel })}
        >
          <Text style={styles.novelTitle}>{novel.title}</Text>
          <Text style={styles.novelPreview}>
            {novel.content && novel.content.length > 120
              ? novel.content.substring(0, 120) + '...'
              : novel.content}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e1b2e', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  novelItem: { marginBottom: 16, padding: 12, backgroundColor: '#2a2540', borderRadius: 8 },
  novelTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  novelPreview: { color: '#aaa', fontSize: 12, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1b2e' },
});
