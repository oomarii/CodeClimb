// screens/Home.tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import coursesData from '../data/courses.json';
import { getColors } from '../theme';
import BottomNav from './BottomNav';

const getLastNDates = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const computeStreak = (dates: string[]): number => {
  const set = new Set(dates);
  let count = 0;
  const today = new Date();
  while (true) {
    const key = today.toISOString().split('T')[0];
    if (set.has(key)) {
      count++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
};

export default function Home() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [studyDates, setStudyDates] = useState<string[]>([]);

  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  useEffect(() => {
    AsyncStorage.getItem('courseProgress').then(raw => {
      if (raw) setProgress(JSON.parse(raw));
    });
    AsyncStorage.getItem('studyDates').then(raw => {
      if (raw) setStudyDates(JSON.parse(raw));
    });
  }, []);

  const overall = Math.round(
    coursesData.reduce((sum, c) => sum + (progress[c.id] ?? 0), 0) / coursesData.length
  );
  const streak = computeStreak(studyDates);
  const calendar = getLastNDates(28);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.welcome, { color: Colors.text }]}>Welcome back!</Text>

          <View style={[styles.card, { backgroundColor: Colors.card }]}>
            <Text style={[styles.label, { color: Colors.subtext }]}>Overall Progress</Text>
            <Text style={[styles.value, { color: Colors.primary }]}>
              {overall > 0 ? `${overall}% Complete` : '--'}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: Colors.card }]}>
            <Text style={[styles.label, { color: Colors.subtext }]}>Current Streak</Text>
            <Text style={[styles.value, { color: Colors.text }]}>
              {streak > 0 ? `${streak} Day${streak > 1 ? 's' : ''}` : '--'}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: Colors.card }]}>
            <Text style={[styles.label, { color: Colors.subtext }]}>4-Week Calendar</Text>
            <View style={styles.calendar}>
              {calendar.map((date, idx) => {
                const done = studyDates.includes(date);
                return (
                  <View
                    key={idx}
                    style={[
                      styles.day,
                      {
                        backgroundColor: done ? Colors.primary : Colors.border
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 120,
    alignItems: 'center'
  },
  logo: {
    width: 450,
    height: 175,
    marginBottom: 0,
    marginTop: 0
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'Manrope-Medium',
    marginBottom: 16
  },
  card: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontFamily: 'Manrope-Medium',
    marginBottom: 8,
    textAlign: 'center'
  },
  value: {
    fontSize: 28,
    fontFamily: 'Manrope-Bold',
    textAlign: 'center'
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    justifyContent: 'center'
  },
  day: {
    width: 22,
    height: 22,
    margin: 4,
    borderRadius: 6
  }
});
