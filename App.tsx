import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import LessonView from './screens/LessonView';
import QuizView   from './screens/QuizView';
import Profile    from './screens/Profile';

export type RootStackParamList = {
  Courses: undefined;
  Lesson:  { courseId: string; lessonId: string };
  Quiz:    { courseId: string; lessonId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Courses">
        <Stack.Screen 
          name="Courses" 
          component={CourseList} 
          options={{ title: 'Courses' }}
        />
        <Stack.Screen 
          name="Lesson" 
          component={LessonView} 
          options={{ title: 'Lesson' }}
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizView} 
          options={{ title: 'Quiz' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
