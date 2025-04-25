import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GiftItem from './GiftItem';
import Accordion from './Accordion';
import GiftModal from './GiftModal';

export interface Gift {
  id: string;
  name: string;
  price?: string;
  description?: string;
  url?: string;
  imageUri?: string | null;
  store?: string;
  completed: boolean;
}

interface GiftListProps {
  recipientId: string;
}

export default function GiftList({ recipientId }: GiftListProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    loadGifts();
  }, [recipientId]);

  const loadGifts = async () => {
    try {
      setIsLoading(true);
      const storedGifts = await AsyncStorage.getItem(`gifts_${recipientId}`);
      if (storedGifts) {
        const parsedGifts = JSON.parse(storedGifts);
        setGifts(parsedGifts);
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load gifts');
      setIsLoading(false);
    }
  };

  const saveGifts = async (updatedGifts: Gift[]) => {
    try {
      await AsyncStorage.setItem(`gifts_${recipientId}`, JSON.stringify(updatedGifts));
    } catch (error) {
      Alert.alert('Error', 'Failed to save gifts');
    }
  };

  const handleSaveGift = (giftData: Partial<Gift>) => {
    if (editingGift) {
      // Update existing gift
      const updatedGifts = gifts.map(gift => {
        if (gift.id === editingGift.id) {
          return {
            ...gift,
            ...giftData,
          };
        }
        return gift;
      });
      setGifts(updatedGifts);
      saveGifts(updatedGifts);
    } else {
      // Add new gift idea
      const newGift: Gift = {
        id: Date.now().toString(),
        name: giftData.name || '',
        price: giftData.price,
        description: giftData.description,
        url: giftData.url,
        imageUri: giftData.imageUri,
        completed: false,
      };
      const updatedGifts = [...gifts, newGift];
      setGifts(updatedGifts);
      saveGifts(updatedGifts);
    }
    setIsModalVisible(false);
    setEditingGift(undefined);
    setIsEditMode(false);
  };

  const editGift = (id: string) => {
    const gift = gifts.find(gift => gift.id === id);
    if (gift) {
      setEditingGift(gift);
      setIsEditMode(true);
      setIsModalVisible(true);
    }
  };

  const deleteGift = (id: string) => {
    Alert.alert(
      'Delete Gift',
      'Are you sure you want to delete this gift?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedGifts = gifts.filter(gift => gift.id !== id);
            setGifts(updatedGifts);
            saveGifts(updatedGifts);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleGift = (id: string) => {
    const updatedGifts = gifts.map(gift => {
      if (gift.id === id) {
        return {
          ...gift,
          completed: !gift.completed,
        };
      }
      return gift;
    });
    setGifts(updatedGifts);
    saveGifts(updatedGifts);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading gifts...</Text>
      </View>
    );
  }

  const activeGifts = gifts.filter(gift => !gift.completed);
  const completedGifts = gifts.filter(gift => gift.completed);

  return (
    <View className="flex-1">
      <Text className="text-xl font-semibold text-textheader my-5">Gift Ideas</Text>
      {(isEditMode && editingGift) || (!isEditMode && !editingGift) ? (
        <GiftModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingGift(undefined);
          }}
          onSave={handleSaveGift}
          editingGift={editingGift}
          recipientId={recipientId}
        />
      ) : null}

      <FlatList
        data={activeGifts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <GiftItem
            gift={item}
            onDelete={deleteGift}
            onEdit={editGift}
            onToggleCompleted={toggleGift}
          />
        )}
        ListEmptyComponent={
          <View className="p-4 items-center">
            <Text className="text-gray-500">
              No gifts added yet. Tap the button below to add one!
            </Text>
          </View>
        }
      />
      {completedGifts.length > 0 && (
        <Accordion title="Past Gifts" count={completedGifts.length}>
          <FlatList
            data={completedGifts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="opacity-60">
                <GiftItem
                  gift={item}
                  onDelete={deleteGift}
                  onEdit={editGift}
                  onToggleCompleted={toggleGift}
                />
              </View>
            )}
          />
        </Accordion>
      )}
      <TouchableOpacity
        className="bg-button p-4 rounded-2xl shadow-lg"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white font-medium text-lg text-center">+ Add Gift Idea</Text>
      </TouchableOpacity>
    </View>
  );
}
