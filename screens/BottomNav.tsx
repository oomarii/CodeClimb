// BottomNav.tsx

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  useColorScheme,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../theme';
import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NAV_WIDTH = SCREEN_WIDTH * 0.85;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function BottomNav() {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);
  const navigation = useNavigation<NavProp>();
  const route = useRoute();

  const active = (name: keyof RootStackParamList) =>
    route.name === name ? Colors.primary : Colors.subtext;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 32 : 20,
      alignSelf: 'center',
      width: NAV_WIDTH,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.card,
      borderRadius: 40,
      paddingHorizontal: 32,
      paddingVertical: 14,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 20,
      elevation: 16,
      zIndex: 10
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    }
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={26} color={active('Home')} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Courses')}
      >
        <Ionicons name="book" size={26} color={active('Courses')} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person" size={26} color={active('Profile')} />
      </Pressable>
    </View>
  );
}