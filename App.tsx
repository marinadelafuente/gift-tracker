import React from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecipientList from '@components/RecipientList';
import 'expo-router/entry';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />
      <RecipientList />
    </SafeAreaView>
  );
} 