import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipientList from '@/components/RecipientList';

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <RecipientList />
    </SafeAreaView>
  );
}

