// screens/CourseList.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import coursesData from '../data/courses.json';
import { RootStackParamList } from '../App';
import { getColors, Typography } from '../theme';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Courses'>;

export default function CourseList({ navigation }: Props) {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);
  const styles = getStyles(Colors);

  const [progress, setProgress] = useState<Record<string, number>>({});
  const [query, setQuery]       = useState('');
  const [filtered, setFiltered] = useState(coursesData);

  useEffect(() => {
    AsyncStorage.getItem('courseProgress').then(raw => {
      if (raw) setProgress(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setFiltered(
      coursesData.filter(c => c.title.toLowerCase().includes(q))
    );
  }, [query]);

  const renderItem = ({ item }: { item: typeof coursesData[0] }) => {
    const pct = progress[item.id] ?? 0;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('CourseDetail', { courseId: item.id })
        }
      >
        <Text style={[Typography.h2, { color: Colors.text }]}>{item.title}</Text>
        <Text style={[Typography.small, { color: Colors.subtext, marginTop: 4 }]}>
          {pct}% complete
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%`, backgroundColor: Colors.primary }
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Centered header like the Home logo */}
          <Text style={[styles.header, { color: Colors.primary }]}>
            Courses
          </Text>

          {/* Search bar */}
          <TextInput
            style={[
              styles.search,
              {
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.text
              }
            ]}
            placeholder="Search courses..."
            placeholderTextColor={Colors.subtext}
            value={query}
            onChangeText={setQuery}
          />

          {/* Course list */}
          <FlatList
            data={filtered}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text style={[Typography.body, { color: Colors.subtext }]}>
                  No courses found.
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Custom bottom nav */}
      <BottomNav />
    </View>
  );
}

const getStyles = (Colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safe: {
      flex: 1
    },
    container: {
      paddingTop: 48,
      paddingHorizontal: 24,
      paddingBottom: 120
    },
    header: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20
    },
    search: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 20,
      ...Typography.body
    },
    list: {
      paddingBottom: 16
    },
    card: {
      backgroundColor: Colors.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3
    },
    progressBar: {
      height: 6,
      backgroundColor: Colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 12
    },
    progressFill: {
      height: '100%'
    },
    empty: {
      alignItems: 'center',
      marginTop: 40
    }
  });
