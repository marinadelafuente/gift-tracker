import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 text-lg">Something went wrong:</Text>
      <Text className="text-red-500 mt-2">{error.message}</Text>
    </View>
  );
}

export default function Layout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF9F5',
          },
          headerTintColor: '#2F2F2F',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: 'Poppins-Bold',
          },
          headerBackTitleStyle: {
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
        },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Gift Tracker',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="recipients/[id]" 
          options={{ 
            title: 'Gift Tracker',
            headerBackButtonDisplayMode: 'minimal',
            headerShown: true 
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
} 