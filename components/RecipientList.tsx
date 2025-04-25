import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipientItem from './RecipientItem';
import getAvatarUrl from 'helpers/getAvatarUrl';
import RecipientModal from './RecipientModal';
import formatDate from 'helpers/formatDate';

export interface Recipient {
  id: string;
  name: string;
  completed: boolean;
  birthday: string | null;
  avatarSeed: string;
  avatarStyle: string;
}

export default function RecipientList() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const storedRecipients = await AsyncStorage.getItem('recipients');
      if (storedRecipients) {
        setRecipients(JSON.parse(storedRecipients));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipients');
    }
  };

  const saveRecipients = async (updatedRecipients: Recipient[]) => {
    try {
      await AsyncStorage.setItem('recipients', JSON.stringify(updatedRecipients));
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipients');
    }
  };

  const editRecipient = (id: string) => {
    setIsModalVisible(true);
    const recipient = recipients.find(recipient => recipient.id === id);
    if (recipient) {
      setEditingRecipient(recipient);
    }
  };

  const deleteRecipient = (id: string) => {
    const updatedRecipients = recipients.filter(recipient => recipient.id !== id);
    setRecipients(updatedRecipients);
    saveRecipients(updatedRecipients);
  };

  const handleSaveRecipient = (recipientData: Partial<Recipient>) => {
    if (editingRecipient) {
      // Update existing recipient
      const updatedRecipients = recipients.map(recipient => {
        if (recipient.id === editingRecipient.id) {
          return {
            ...recipient,
            ...recipientData,
          };
        }
        return recipient;
      });
      setRecipients(updatedRecipients);
      saveRecipients(updatedRecipients);
    } else {
      // Add new recipient
      const newRecipientItem: Recipient = {
        id: Date.now().toString(),
        name: recipientData.name || '',
        birthday: recipientData.birthday || null,
        avatarSeed: recipientData.avatarSeed || '',
        avatarStyle: recipientData.avatarStyle || '',
        completed: false,
      };
      const updatedRecipients = [...recipients, newRecipientItem];
      setRecipients(updatedRecipients);
      saveRecipients(updatedRecipients);
    }
    setIsModalVisible(false);
    setEditingRecipient(null);
  };

  return (
    <View className="flex-1 bg-background pt-5">
      <View className="flex-row justify-between px-5 mb-5">
        <Text className="text-xl font-semibold text-textheader">Giftees</Text>
        {recipients.length > 0 && (
          <TouchableOpacity
            className="bg-buttonsecondary px-4 py-2 rounded-lg"
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text className="text-gray-700 font-medium">{isEditMode ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!recipients.length && (
        <Text className="text-gray-500 px-5">
          Keep track of your gift ideas for your friends and family! Start adding some people first!
        </Text>
      )}
      {(isEditMode && editingRecipient) || (!isEditMode && !editingRecipient) ? (
        <RecipientModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingRecipient(null);
          }}
          onSave={handleSaveRecipient}
          editingRecipient={editingRecipient ?? undefined}
          isEditMode={isEditMode}
        />
      ) : null}
      <FlatList
        data={recipients}
        keyExtractor={recipient => recipient.id}
        renderItem={({ item: recipient }) => (
          <RecipientItem
            recipient={{
              ...recipient,
              birthday: formatDate(recipient.birthday),
            }}
            onDelete={deleteRecipient}
            onEdit={editRecipient}
            isEditingModeOn={isEditMode}
            avatarUrl={getAvatarUrl(recipient.avatarSeed, recipient.avatarStyle)}
          />
        )}
        className="px-5"
      />

      <TouchableOpacity
        className="bg-button p-4 mx-5 mb-7 rounded-2xl shadow-lg"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white font-medium text-lg text-center">+ Add New Giftee</Text>
      </TouchableOpacity>
    </View>
  );
}
