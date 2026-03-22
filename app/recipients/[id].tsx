import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GiftList from '@/components/GiftList';
import { Recipient } from '@/components/RecipientList';
import getAvatarUrl from '@/helpers/getAvatarUrl';

export default function RecipientDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipientId = id ?? '';
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipient = async () => {
      try {
        if (!id) {
          setError('No recipient ID provided');
          return;
        }

        const storedRecipients = await AsyncStorage.getItem('recipients');
        if (storedRecipients) {
          const recipients: Recipient[] = JSON.parse(storedRecipients);
          const foundRecipient = recipients.find(r => r.id === id);
          if (foundRecipient) {
            setRecipient(foundRecipient);
          } else {
            setError('Recipient not found');
          }
        } else {
          setError('No recipients found');
        }
      } catch (e) {
        console.error('Error loading recipient:', e);
        setError('Failed to load recipient details');
      }
    };

    loadRecipient();
  }, [id]);

  if (error) {
    return (
      <View className="flex-1 p-4 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  if (!recipient) {
    return (
      <View className="flex-1 p-4 justify-center items-center">
        <Text className="text-lg">Loading giftee details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />
      <View className="flex-1 px-4 pt-5 bg-background">
        <View className="flex-row rounded-lg shadow-lg mb-2 border-2 border-button bg-white p-2">
          <TouchableOpacity className="rounded-xl w-[20%] aspect-square">
            <Image
              source={{
                uri: getAvatarUrl(recipient.avatarSeed, recipient.avatarStyle),
              }}
              className="w-full h-full rounded-full"
            />
          </TouchableOpacity>
          <View className="pl-2">
            <Text className="text-xl font-bold pt-2">{recipient.name}</Text>
            {recipient.birthday && (
              <Text className="text-lg text-gray-600">
                Birthday: {new Date(recipient.birthday).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
        <GiftList recipientId={recipientId} />
      </View>
    </SafeAreaView>
  );
}

