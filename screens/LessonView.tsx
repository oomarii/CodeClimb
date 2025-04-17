import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import lessons from '../data/lessons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

export default function LessonView({ route, navigation }: Props) {
  const { courseId, lessonId } = route.params;
  const idx = parseInt(lessonId, 10) - 1;
  const courseLessons = lessons[courseId] || [];
  const content = courseLessons[idx] || '# Lesson not found';
  const total = courseLessons.length;
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  const [note, setNote] = useState('');
  const noteKey = `note-${courseId}-${lessonId}`;

  useEffect(() => {
    AsyncStorage.getItem(noteKey).then(saved => {
      if (saved !== null) setNote(saved);
    });
  }, [noteKey]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const saveNote = async () => {
    await AsyncStorage.setItem(noteKey, note);
  };

  const hasPrev = !isFirst;
  const footerJustify = hasPrev ? 'space-between' : 'center';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: Colors.bg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={[Typography.small, styles.lessonInfo, { color: Colors.primary }]}>
          Lesson {idx + 1} of {total}
        </Text>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: Colors.primary, width: width * ((idx + 1) / total) }
          ]}
        />
      </View>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Markdown style={getMdStyles(Colors)}>{content}</Markdown>

        <View style={[styles.notesContainer, { borderColor: Colors.border }]}>
          <Text style={[Typography.h2, { color: Colors.text }]}>Your Notes</Text>
          <TextInput
            style={[styles.notesInput, { color: Colors.text }]}
            multiline
            placeholder="Write your notes here..."
            placeholderTextColor={Colors.subtext}
            value={note}
            onChangeText={setNote}
            onBlur={saveNote}
          />
        </View>
      </ScrollView>

      {/* Footer nav */}
      <View style={[styles.footer, { backgroundColor: Colors.bg, borderTopColor: Colors.border, justifyContent: footerJustify }]}>
        {hasPrev && (
          <Pressable
            style={[styles.btn, styles.btnSecondary, { borderColor: Colors.primary }]}
            onPress={() =>
              navigation.replace('Lesson', {
                courseId,
                lessonId: String(idx)
              })
            }
          >
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            <Text style={[styles.btnText, { color: Colors.primary }]}>Prev</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.btn, isLast ? styles.btnAccent : styles.btnPrimary]}
          onPress={() => {
            if (isLast) {
              navigation.navigate('Quiz', { courseId, lessonId });
            } else {
              navigation.replace('Lesson', {
                courseId,
                lessonId: String(idx + 2)
              });
            }
          }}
        >
          <Text style={[styles.btnText, { color: Colors.card }]}>{isLast ? 'Take Quiz' : 'Next'}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.card} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20
  },
  lessonInfo: {
    marginBottom: 8
  },
  progressBar: {
    height: 3,
    borderRadius: 2
  },
  scroll: {
    padding: 16,
    paddingBottom: 120
  },
  notesContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    ...Typography.body
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center'
  },
  btnPrimary: { backgroundColor: '#2D9CDB' },
  btnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1
  },
  btnAccent: { backgroundColor: '#F2C94C' },
  btnText: {
    ...Typography.body,
    marginHorizontal: 8
  }
});

const getMdStyles = (Colors: ReturnType<typeof getColors>) => ({
  heading1: { ...Typography.h1, color: Colors.text, marginBottom: 12 },
  heading2: { ...Typography.h2, color: Colors.text, marginBottom: 8 },
  body:     { ...Typography.body, lineHeight: 24, color: Colors.text },
  code_inline: {
    backgroundColor: Colors.card,
    padding: 4,
    borderRadius: 4,
    color: Colors.text
  },
  code_block: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 6,
    fontFamily: 'Courier',
    color: Colors.text
  },
  list_item_text: { ...Typography.body, color: Colors.text }
});
