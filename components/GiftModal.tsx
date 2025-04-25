import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Gift } from './GiftList';

interface GiftModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (gift: Partial<Gift>) => void;
  editingGift?: Gift;
  recipientId: string;
}

export default function GiftModal({
  isVisible,
  onClose,
  onSave,
  editingGift,
  recipientId,
}: GiftModalProps) {
  const [name, setName] = useState(editingGift?.name ?? '');
  const [price, setPrice] = useState(editingGift?.price ?? '');
  const [description, setDescription] = useState(editingGift?.description ?? '');
  const [store, setStore] = useState(editingGift?.store ?? '');
  const [url, setUrl] = useState(editingGift?.url ?? '');
  const [imageUri, setImageUri] = useState<string | null>(editingGift?.imageUri ?? null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please grant camera roll permissions to add images to gifts.'
        );
      }
    })();
  }, [recipientId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Error',
        'Failed to access camera. Please check your camera permissions and try again.'
      );
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        price: price || undefined,
        description: description?.trim() || undefined,
        url: url?.trim() || undefined,
        imageUri,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setStore('');
    setUrl('');
    setImageUri(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
    Keyboard.dismiss();
  };

  const isNameValid = name.trim().length > 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/50 items-center pt-20">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white p-5 rounded-b-lg w-full">
              <Text className="text-xl font-bold mb-4">
                {editingGift ? 'Edit Gift Idea' : 'Add New Gift Idea'}
              </Text>

              <TextInput
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={name}
                onChangeText={setName}
                placeholder="Gift name *"
                placeholderTextColor="#666"
              />

              <TextInput
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={price}
                onChangeText={setPrice}
                placeholder="Price (optional)"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                inputMode="numeric"
              />

              <TextInput
                className="h-20 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={description}
                onChangeText={setDescription}
                placeholder="Description (optional)"
                placeholderTextColor="#666"
                multiline
              />

              <TextInput
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={store}
                onChangeText={setStore}
                placeholder="Store/Brand (optional)"
                placeholderTextColor="#666"
              />

              <TextInput
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={url}
                onChangeText={setUrl}
                placeholder="URL (optional)"
                placeholderTextColor="#666"
                keyboardType="url"
              />

              <View className="flex-row space-x-2 mb-4">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 px-4 py-2 rounded-lg bg-buttonsecondary"
                  onPress={pickImage}
                >
                  <Text className="text-center">Choose Image (optional)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-100 px-4 py-2 rounded-lg bg-buttonsecondary"
                  onPress={takePhoto}
                >
                  <Text className="text-center">Take Photo (optional)</Text>
                </TouchableOpacity>
              </View>

              {imageUri && (
                <View className="mb-4">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-40 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              )}

              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  className="bg-gray-100 px-6 py-2.5 rounded-lg active:bg-gray-200"
                  onPress={handleClose}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-6 py-2.5 rounded-lg ${isNameValid ? 'bg-button active:bg-textheader' : 'bg-gray-300'}`}
                  onPress={handleSave}
                  disabled={!isNameValid}
                >
                  <Text className="text-white font-semibold">{editingGift ? 'Save' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
