// screens/Profile.tsx

import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors, Typography } from '../theme';
import BottomNav from './BottomNav';

export default function Profile() {
  const scheme = useColorScheme();
  const Colors = getColors(scheme);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.bg }]}> 
        <View style={styles.container}>
          <View style={[styles.avatar, { backgroundColor: Colors.primary }]}> 
            <Ionicons name="person" size={40} color={Colors.card} />
          </View>
          <Text style={[Typography.h1, { color: Colors.text, marginTop: 12 }]}>Your Name</Text>
        </View>
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
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});