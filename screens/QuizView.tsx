// screens/QuizView.tsx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quizzes, { Question } from '../data/quizzes';
import { getColors, Typography } from '../theme';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizView({ route, navigation }: Props) {
  const { courseId, lessonId } = route.params;
  const lessonIndex = Number(lessonId) - 1;
  const questions: Question[] = quizzes[courseId]?.[lessonIndex] || [];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const Colors   = getColors(useColorScheme());
  const styles   = getStyles(Colors);

  // If no quiz available
  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
        <Text style={[Typography.h2, { color: Colors.text, textAlign: 'center', marginTop: 48 }]}>
          No quiz for this lesson.
        </Text>
      </SafeAreaView>
    );
  }

  const question  = questions[current];
  const isLast    = current === questions.length - 1;
  const progressW = (width - 48) * ((current + 1) / questions.length);

  // Advance or finish
  const finishQuiz = async () => {
    // update progress
    const raw = await AsyncStorage.getItem('courseProgress');
    const prog = raw ? JSON.parse(raw) : {};
    const totalLessons = quizzes[courseId]?.length || 1;
    prog[courseId] = Math.min(100, Math.round(((prog[courseId] || 0) + 1) / totalLessons * 100));
    await AsyncStorage.setItem('courseProgress', JSON.stringify(prog));

    // log date
    const today = new Date().toISOString().split('T')[0];
    const datesRaw = await AsyncStorage.getItem('studyDates');
    const dates: string[] = datesRaw ? JSON.parse(datesRaw) : [];
    if (!dates.includes(today)) {
      dates.push(today);
      await AsyncStorage.setItem('studyDates', JSON.stringify(dates));
    }

    navigation.popToTop();
  };

  // Handle Next/Finish
  const handleNext = () => {
    if (selected === null) {
      Alert.alert('Please select an answer first.');
      return;
    }
    const correct = selected === question.answerIndex;
    Alert.alert(
      correct ? '✅ Correct!' : '❌ Incorrect',
      '',
      [
        {
          text: isLast ? 'Finish' : 'Next',
          onPress: () => {
            if (isLast) {
              finishQuiz();
            } else {
              setCurrent(c => c + 1);
              setSelected(null);
            }
          }
        }
      ]
    );
  };

  // Go back one question
  const handlePrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
      {/* Header */}
      <View style={styles.titleRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={[styles.titleText, { color: Colors.primary }]}>Quiz</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressWrapper}>
        <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
          <View style={[styles.progressFill, { width: progressW, backgroundColor: Colors.primary }]} />
        </View>
      </View>

      {/* Questions */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.prompt, { color: Colors.text }]}>
          {`Q${current + 1}. ${question.prompt}`}
        </Text>

        {question.options.map((opt, i) => (
          <Pressable
            key={i}
            onPress={() => setSelected(i)}
            style={[
              styles.option,
              {
                backgroundColor: selected === i ? Colors.primary : Colors.card,
                borderColor:     selected === i ? Colors.primary : Colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: selected === i ? Colors.card : Colors.text }
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}

        {/* spacer so content never hides behind FABs */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Arrows at bottom */}
      <View style={styles.fabContainer}>
        {current > 0 && (
          <Pressable
            onPress={handlePrev}
            style={[styles.fab, { backgroundColor: Colors.primary }]}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.card} />
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={[styles.fab, { backgroundColor: Colors.primary }]}
        >
          <Ionicons
            name={isLast ? 'checkmark' : 'chevron-forward'}
            size={24}
            color={Colors.card}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (Colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safe:            { flex: 1, position: 'relative' },
    flex:            { flex: 1 },
    titleRow:        {
                      flexDirection: 'row',
                      alignItems:    'center',
                      paddingTop:    48,
                      paddingHorizontal: 24,
                      marginBottom:  16
                    },
    backButton:      { marginRight: 12 },
    titleText:       { ...Typography.h2 },

    progressWrapper: { paddingHorizontal: 24, marginBottom: 16 },
    progressBar:     { width: '100%', height: 4, borderRadius: 2 },
    progressFill:    { height: '100%' },

    scrollContent:   { paddingHorizontal: 24 },
    prompt:          { ...Typography.h2, marginBottom: 24 },

    option:          {
                      borderWidth:      1,
                      borderRadius:     8,
                      paddingVertical:  14,
                      paddingHorizontal:16,
                      marginBottom:     12
                    },
    optionText:      { ...Typography.body },

    fabContainer:    {
                      position:      'absolute',
                      bottom:        24,
                      left:          0,
                      right:         0,
                      flexDirection: 'row',
                      justifyContent:'center',
                      alignItems:    'center'
                    },
    fab:             {
                      width:           48,
                      height:          48,
                      marginHorizontal:12,
                      borderRadius:    24,
                      alignItems:      'center',
                      justifyContent:  'center',
                      shadowColor:     '#000',
                      shadowOpacity:   0.15,
                      shadowOffset:    { width: 0, height: 4 },
                      shadowRadius:    8,
                      elevation:       4
                    }
  });
