import { Stack } from 'expo-router';
import '../global.css';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF9F5',
        },
        headerTintColor: '#2F2F2F',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Gift Tracker',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="recipients/[id]"
        options={{
          title: 'Gift Tracker',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
