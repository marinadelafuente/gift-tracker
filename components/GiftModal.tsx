import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not supported', 'Camera is not available on web.');
        return;
      }
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
    } catch (e) {
      console.error('Camera error:', e);
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
    if (Platform.OS !== 'web') Keyboard.dismiss();
  };

  const isNameValid = name.trim().length > 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center">
        <Pressable className="absolute inset-0 bg-black/50" onPress={handleClose} />
        <View className="bg-white p-5 rounded-lg w-11/12 max-h-[80%]">
          <Text className="text-xl font-bold mb-4 text-gray-900">
            {editingGift ? 'Edit Gift Idea' : 'Add New Gift Idea'}
          </Text>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TextInput
              className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4 text-gray-900"
              value={name}
              onChangeText={setName}
              placeholder="Gift name *"
              placeholderTextColor="#666"
              autoFocus
            />

            <TextInput
              className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4 text-gray-900"
              value={price}
              onChangeText={setPrice}
              placeholder="Price (optional)"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              inputMode="numeric"
            />

            <TextInput
              className="h-20 border border-gray-300 rounded-lg px-2.5 mb-4 text-gray-900"
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              multiline
            />

            <TextInput
              className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4 text-gray-900"
              value={store}
              onChangeText={setStore}
              placeholder="Store/Brand (optional)"
              placeholderTextColor="#666"
            />

            <TextInput
              className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4 text-gray-900"
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
                <Text className="text-center text-gray-900">Choose Image (optional)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-100 px-4 py-2 rounded-lg bg-buttonsecondary"
                onPress={takePhoto}
              >
                <Text className="text-center text-gray-900">Take Photo (optional)</Text>
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
          </ScrollView>
          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              className="bg-gray-100 px-6 py-2.5 rounded-lg active:bg-gray-200"
              onPress={handleClose}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-6 py-2.5 rounded-lg ${
                isNameValid ? 'bg-button active:bg-textheader' : 'bg-gray-300'
              }`}
              onPress={handleSave}
              disabled={!isNameValid}
            >
              <Text className="text-white font-semibold">{editingGift ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
