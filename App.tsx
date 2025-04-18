// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { getColors } from './theme';
import Home from './screens/Home';
import CourseList from './screens/CourseList';
import CourseDetail from './screens/CourseDetail';
import LessonView from './screens/LessonView';
import QuizView from './screens/QuizView';
import Profile from './screens/Profile';

export type RootStackParamList = {
  Home: undefined;
  Courses: undefined;
  CourseDetail: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
  Quiz:   { courseId: string; lessonId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

function CoursesStack() {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  return (
    <Stack.Navigator
      initialRouteName="Courses"
      screenOptions={{
        headerShown:   false,
        contentStyle:  { backgroundColor: Colors.bg }
      }}
    >
      <Stack.Screen name="Courses"      component={CourseList} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} />
      <Stack.Screen name="Lesson"       component={LessonView} />
      <Stack.Screen name="Quiz"         component={QuizView} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  const [fontsLoaded] = useFonts({
    Manrope:          require('./assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Bold':   require('./assets/fonts/Manrope-Bold.ttf'),
    'Manrope-Medium': require('./assets/fonts/Manrope-Medium.ttf'),
    'Manrope-Light':  require('./assets/fonts/Manrope-Light.ttf')
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.bg,
      card:       Colors.card,
      text:       Colors.text,
      border:     Colors.border,
      primary:    Colors.primary
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,        // we use custom headers in each screen
          tabBarStyle: { display: 'none' }
        }}
      >
        <Tab.Screen name="Home"    component={Home} />
        <Tab.Screen name="Courses" component={CoursesStack} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
