import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
  useColorScheme,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quizzes, { Question } from '../data/quizzes';
import { getColors, Typography } from '../theme';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizView({ route, navigation }: Props) {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  const { courseId, lessonId } = route.params;
  const lessonIndex = parseInt(lessonId, 10) - 1;
  const questions: Question[] = quizzes[courseId]?.[lessonIndex] || [];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const { width } = useWindowDimensions();

  if (questions.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: Colors.bg }]}>
        <Text style={[Typography.h2, { color: Colors.text }]}>
          No quiz for this lesson.
        </Text>
      </View>
    );
  }

  const question = questions[current];
  const isLast = current === questions.length - 1;
  const progressWidth = ((current + 1) / questions.length) * width;

  const finishQuiz = async () => {
    const rawProg = await AsyncStorage.getItem('courseProgress');
    const prog = rawProg ? JSON.parse(rawProg) : {};
    const totalLessons = quizzes[courseId]?.length || 1;
    prog[courseId] = Math.min(
      100,
      Math.round(((prog[courseId] ?? 0) + 1) / totalLessons * 100)
    );
    await AsyncStorage.setItem('courseProgress', JSON.stringify(prog));

    const today = new Date().toISOString().split('T')[0];
    const rawDates = await AsyncStorage.getItem('studyDates');
    const dates: string[] = rawDates ? JSON.parse(rawDates) : [];
    if (!dates.includes(today)) {
      dates.push(today);
      await AsyncStorage.setItem('studyDates', JSON.stringify(dates));
    }

    navigation.popToTop();
  };

  const handleSubmit = () => {
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
          text: isLast ? 'Finish Quiz' : 'Next',
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={[styles.progressBarContainer, { backgroundColor: Colors.bg }]}>
        <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: Colors.primary, width: progressWidth }
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.bg }]}>
        <Text style={[styles.prompt, { color: Colors.text }]}>
          {`Q${current + 1}. ${question.prompt}`}
        </Text>

        {question.options.map((opt, i) => (
          <Pressable
            key={i}
            style={[
              styles.option,
              {
                backgroundColor: selected === i ? Colors.secondary : Colors.card,
                borderColor: selected === i ? Colors.secondary : Colors.border
              }
            ]}
            onPress={() => setSelected(i)}
          >
            <Text style={[styles.optionText, { color: Colors.text }]}>{opt}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: Colors.border, backgroundColor: Colors.bg }]}>
        <Pressable
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                selected === null ? Colors.border : Colors.primary
            }
          ]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitText, { color: Colors.card }]}>
            {isLast ? 'Finish Quiz' : 'Submit Answer'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.card} style={{ marginLeft: 6 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  progressBar: {
    height: 4,
    borderRadius: 2
  },
  progressFill: {
    height: '100%',
    borderRadius: 2
  },
  prompt: {
    ...Typography.h2,
    marginBottom: 24
  },
  option: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14
  },
  optionText: {
    ...Typography.body
  },
  footer: {
    padding: 16,
    borderTopWidth: 1
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10
  },
  submitText: {
    ...Typography.body,
    fontWeight: '600'
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
