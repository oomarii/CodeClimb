import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import coursesData from '../data/courses.json';
import { RootStackParamList } from '../navigation';
import { getColors } from '../theme';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Courses'>;

export default function CourseList({ navigation }: Props) {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);
  const styles = getStyles(Colors);

  const [progress, setProgress] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
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
          navigation.navigate('Lesson', {
            courseId: item.id,
            lessonId: '1'
          })
        }
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{pct}% complete</Text>
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
      <View style={[styles.safe, { backgroundColor: Colors.bg }]}>
        <Text style={styles.header}>Courses</Text>

        <TextInput
          style={styles.search}
          placeholder="Search courses..."
          placeholderTextColor={Colors.subtext}
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.subtitle}>No courses found.</Text>
            </View>
          )}
        />
      </View>
      <BottomNav />
    </View>
  );
}

const getStyles = (Colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      paddingTop: 48,
      paddingHorizontal: 24,
      paddingBottom: 100
    },
    header: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      color: Colors.primary,
      marginBottom: 20
    },
    search: {
      backgroundColor: Colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 20,
      fontSize: 16,
      color: Colors.text
    },
    list: {
      paddingBottom: 20
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
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text
    },
    subtitle: {
      fontSize: 14,
      color: Colors.subtext,
      marginTop: 4
    },
    progressBar: {
      height: 6,
      backgroundColor: Colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 10
    },
    progressFill: {
      height: '100%'
    },
    empty: {
      alignItems: 'center',
      marginTop: 40
    }
  });
