// screens/CourseDetail.tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import lessons from '../data/lessons';
import { getColors, Typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetail({ route, navigation }: Props) {
  const { courseId } = route.params;
  const screenLessons = lessons[courseId] || [];
  const scheme = useColorScheme();
  const Colors = getColors(scheme);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  // Load completed lessons
  useEffect(() => {
    AsyncStorage.getItem(`completed-${courseId}`).then(raw => {
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    });
  }, [courseId]);

  // Refresh on focus
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      AsyncStorage.getItem(`completed-${courseId}`).then(raw => {
        if (raw) setCompleted(new Set(JSON.parse(raw)));
      });
    });
    return unsub;
  }, [navigation, courseId]);

  const goToLesson = (idx: number) =>
    navigation.navigate('Lesson', { courseId, lessonId: String(idx + 1) });

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[styles.lessonCard, { backgroundColor: Colors.card }]}
      activeOpacity={0.8}
      onPress={() => goToLesson(index)}
    >
      <View style={styles.lessonLeft}>
        <Text style={[Typography.body, { color: Colors.text, fontWeight: '600' }]}>
          Lesson {index + 1}
        </Text>
        <Text
          style={[Typography.body, { color: Colors.subtext, marginTop: 4 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.replace(/^#\s*/, '').split('\n')[0]}
        </Text>
      </View>
      {completed.has(index) ? (
        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={Colors.subtext} />
      )}
    </TouchableOpacity>
  );

  // Friendly titles
  const titleMap: Record<string,string> = {
    'js-basics': 'JavaScript Basics',
    'py-intro':  'Python 101',
    'ds-algos':  'Data Structures & Algos'
  };
  const courseTitle = titleMap[courseId] || 'Course';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={[styles.header, { color: Colors.primary }]}>
          {courseTitle}
        </Text>
      </View>

      {/* Lessons Roadmap */}
      <FlatList
        data={screenLessons}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  titleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingTop:     48,
    paddingHorizontal: 24,
    marginBottom:   20
  },
  backButton: {
    marginRight: 16
  },
  header: {
    fontSize:   24,
    fontWeight: '600'
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom:     120
  },
  lessonCard: {
    flexDirection:    'row',
    alignItems:       'center',
    padding:          16,
    borderRadius:     12,
    shadowColor:      '#000',
    shadowOpacity:    0.05,
    shadowOffset:     { width: 0, height: 4 },
    shadowRadius:     8,
    elevation:        2
  },
  lessonLeft: {
    flex: 1
  }
});
