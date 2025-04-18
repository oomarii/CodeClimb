// screens/LessonView.tsx

import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  useColorScheme
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import lessons from '../data/lessons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, Typography } from '../theme';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

export default function LessonView({ route, navigation }: Props) {
  const { courseId, lessonId } = route.params;
  const idx = Number(lessonId) - 1;
  const courseLessons = lessons[courseId] || [];
  const content = courseLessons[idx] || '# Lesson not found';
  const total = courseLessons.length;
  const isFirst = idx === 0;
  const isLast  = idx === total - 1;

  const { width } = useWindowDimensions();
  const Colors   = getColors(useColorScheme());
  const styles   = getStyles(Colors);
  const mdStyles = getMdStyles(Colors);

  const [note, setNote] = useState('');
  const noteKey = `note-${courseId}-${lessonId}`;

  useEffect(() => {
    AsyncStorage.getItem(noteKey).then(saved => {
      if (saved !== null) setNote(saved);
    });
  }, [noteKey]);

  const saveNote = async () => {
    await AsyncStorage.setItem(noteKey, note);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handlePrev = () => {
    if (!isFirst) {
      navigation.replace('Lesson', {
        courseId,
        lessonId: String(idx)
      });
    }
  };
  const handleNext = () => {
    if (isLast) {
      navigation.navigate('Quiz', { courseId, lessonId });
    } else {
      navigation.replace('Lesson', {
        courseId,
        lessonId: String(idx + 2)
      });
    }
  };

  const progressWidth = (width - 48) * ((idx + 1) / total);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}>
      {/* Title + Back */}
      <View style={styles.titleRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={[styles.titleText, { color: Colors.primary }]}>
          Lesson {idx + 1} of {total}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressWrapper}>
        <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: progressWidth, backgroundColor: Colors.primary }
            ]}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        style={styles.contentWrapper}
        behavior={Platform.select({ ios: 'padding' })}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Markdown style={mdStyles}>{content}</Markdown>

          <View style={styles.notesSection}>
            <Text style={[Typography.h2, { color: Colors.text, marginBottom: 8 }]}>
              Your Notes
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                { borderColor: Colors.border, color: Colors.text }
              ]}
              multiline
              placeholder="Jot down key ideas…"
              placeholderTextColor={Colors.subtext}
              value={note}
              onChangeText={setNote}
              onBlur={saveNote}
            />
          </View>

          {/* Spacer so nothing hides under the buttons */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.fabContainer}>
        {!isFirst && (
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
    titleRow:        {
                      flexDirection:     'row',
                      alignItems:        'center',
                      paddingTop:        48,
                      paddingHorizontal: 24,
                      marginBottom:      20
                    },
    backButton:      { marginRight: 16 },
    titleText:       { ...Typography.body, fontWeight: '600' },

    progressWrapper: { paddingHorizontal: 24, marginBottom: 16 },
    progressBar:     { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden' },
    progressFill:    { height: '100%' },

    contentWrapper:  { flex: 1 },
    flex:            { flex: 1 },
    scrollContent:   { paddingHorizontal: 24 },

    notesSection:    { marginTop: 24 },
    notesInput:      {
                      minHeight:         80,
                      textAlignVertical: 'top',
                      borderWidth:       1,
                      borderRadius:      8,
                      padding:           12,
                      ...Typography.body
                    },

    fabContainer:    {
                      position:       'absolute',
                      bottom:         24,
                      left:           0,
                      right:          0,
                      flexDirection:  'row',
                      justifyContent: 'center',
                      alignItems:     'center'
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

const getMdStyles = (Colors: ReturnType<typeof getColors>) => ({
  heading1:    { 
                  ...Typography.h1, 
                  color: Colors.primary, 
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: Colors.primary,
                  paddingLeft: 8
                },
  heading2:    {
                  ...Typography.h2,
                  color: Colors.secondary,
                  marginBottom: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: Colors.secondary,
                  paddingLeft: 8
                },
  body:        { ...Typography.body, color: Colors.text, lineHeight: 24 },
  code_inline: { 
                  backgroundColor: Colors.border, 
                  padding: 4, 
                  borderRadius: 4, 
                  fontFamily: 'Courier' 
                },
  code_block:  {
                  backgroundColor: Colors.card,
                  padding: 12,
                  borderRadius: 6,
                  fontFamily: 'Courier',
                  color: Colors.text
                },
  list_item_text: { ...Typography.body, color: Colors.text }
});
