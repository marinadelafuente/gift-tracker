import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Recipient } from './RecipientList';
import ChevronIcon from '@/assets/icons/ChevronIcon';
import formatDate from '@/helpers/formatDate';
import getAvatarUrl from '@/helpers/getAvatarUrl';

interface RecipientModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (recipient: Partial<Recipient>) => void;
  editingRecipient?: Recipient;
  isEditMode?: boolean;
}

const DEFAULT_AVATAR_STYLE = 'avataaars';

const AVATARS_PER_PAGE = 4;
const TOTAL_AVATARS = 30;
const TOTAL_PAGES = Math.ceil(TOTAL_AVATARS / AVATARS_PER_PAGE);

export default function RecipientModal({
  isVisible,
  onClose,
  onSave,
  editingRecipient,
  isEditMode,
}: RecipientModalProps) {
  if (isEditMode && !editingRecipient) {
    throw new Error('editingRecipient is required when isEditMode is true');
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState(editingRecipient?.name ?? '');

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    editingRecipient?.birthday ? new Date(editingRecipient.birthday) : null,
  );

  const [selectedAvatar, setSelectedAvatar] = useState<{ seed: string; style: string }>({
    seed: editingRecipient?.avatarSeed || name.trim() || 'X',
    style: editingRecipient?.avatarStyle || 'initials',
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [loadedAvatars, setLoadedAvatars] = useState<
    Array<{ id: string; name: string; seed: string; style: string }>
  >([]);

  useEffect(() => {
    loadInitialAvatars();
  }, []);

  const loadInitialAvatars = () => {
    const currentAvatar = editingRecipient
      ? {
          id: 'current-avatar',
          name: editingRecipient.name,
          seed: editingRecipient.avatarSeed,
          style: editingRecipient.avatarStyle,
        }
      : null;

    const initialsAvatar = {
      id: 'avatar-initials',
      name: 'X',
      seed: name.trim() || 'X',
      style: 'initials',
    };

    const generateRandomAvatar = () => {
      const seed = Math.random().toString(36).substring(7);
      const style = DEFAULT_AVATAR_STYLE;

      // Avoid duplicates of the current selection.
      if (currentAvatar && seed === currentAvatar.seed && style === currentAvatar.style) {
        return generateRandomAvatar();
      }

      return {
        id: `avatar-${seed}`,
        name: `Avatar ${seed}`,
        seed,
        style,
      };
    };

    const randomAvatars = Array.from(
      { length: AVATARS_PER_PAGE * 2 - 1 - (currentAvatar ? 1 : 0) },
      () => generateRandomAvatar(),
    );

    const initialAvatars = [
      ...(currentAvatar && currentAvatar.style !== 'initials' ? [currentAvatar] : []),
      initialsAvatar,
      ...randomAvatars,
    ];

    setLoadedAvatars(initialAvatars);
  };

  const loadMoreAvatars = () => {
    if (loadedAvatars.length < TOTAL_AVATARS + 1) {
      const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const style = DEFAULT_AVATAR_STYLE;

        if (loadedAvatars.some(avatar => avatar.seed === seed && avatar.style === style)) {
          return generateRandomAvatar();
        }

        return {
          id: `avatar-${seed}`,
          name: `Avatar ${seed}`,
          seed,
          style,
        };
      };

      const newAvatars = Array.from({ length: AVATARS_PER_PAGE }, () => generateRandomAvatar());
      setLoadedAvatars([...loadedAvatars, ...newAvatars]);
    }
  };

  // Update avatars when name changes.
  useEffect(() => {
    if (isVisible) {
      const updatedAvatars = [...loadedAvatars];

      if (updatedAvatars.length > 0 && updatedAvatars[0].id === 'avatar-initials') {
        updatedAvatars[0] = {
          ...updatedAvatars[0],
          seed: name.trim() || 'X',
        };
        setLoadedAvatars(updatedAvatars);
      }
    }
  }, [name, isVisible]);

  const getCurrentPageAvatars = () => {
    if (currentPage === 0) {
      return loadedAvatars.slice(0, AVATARS_PER_PAGE);
    }

    const start = (currentPage - 1) * AVATARS_PER_PAGE + 1;
    const end = start + AVATARS_PER_PAGE;
    return loadedAvatars.slice(start, end);
  };

  const nextPage = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1);
      if ((currentPage + 2) * AVATARS_PER_PAGE > loadedAvatars.length) {
        loadMoreAvatars();
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        birthday: selectedDate ? selectedDate.toISOString() : null,
        avatarSeed: selectedAvatar.seed,
        avatarStyle: selectedAvatar.style,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedDate(null);
    setShowDatePicker(false);
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
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white p-5 rounded-lg w-11/12 max-h-[80%]">
              <Text className="text-xl font-bold mb-4">
                {editingRecipient ? 'Edit' : 'Add New'} Giftee
              </Text>

              <TextInput
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4"
                value={name}
                onChangeText={setName}
                placeholder="Giftee's name"
                placeholderTextColor="text-gray-600"
              />

              <Text className="text-gray-700 mb-2">Choose Avatar:</Text>

              <View className="flex-row items-center mb-4">
                {currentPage > 0 && (
                  <TouchableOpacity onPress={prevPage} className="p-2">
                    <ChevronIcon direction="left" />
                  </TouchableOpacity>
                )}

                <View className="flex-1 flex-row flex-wrap justify-between">
                  {getCurrentPageAvatars().map(avatar => (
                    <TouchableOpacity
                      key={avatar.id}
                      onPress={() => setSelectedAvatar({ seed: avatar.seed, style: avatar.style })}
                      className={`w-[22%] aspect-square mb-2 rounded-xl border-2 ${
                        selectedAvatar.seed === avatar.seed
                          ? 'border-button'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        source={{
                          uri: getAvatarUrl(avatar.seed, avatar.style),
                        }}
                        className="w-full h-full rounded-lg"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {currentPage < TOTAL_PAGES - 1 && (
                  <TouchableOpacity onPress={nextPage} className="p-2">
                    <ChevronIcon direction="right" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                className="h-10 border border-gray-300 rounded-lg px-2.5 mb-4 justify-center"
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker(true);
                }}
              >
                <Text className={selectedDate ? 'text-gray-600' : 'text-gray-400'}>
                  {selectedDate
                    ? formatDate(selectedDate.toISOString())
                    : 'Select birthday (optional)'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <View className="mb-4">
                  <DateTimePicker
                    value={selectedDate === null ? new Date() : selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    textColor="#000000"
                    themeVariant="light"
                  />
                </View>
              )}

              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  className="bg-gray-100 px-6 py-2.5 rounded-lg"
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
                  <Text className="text-white font-semibold">
                    {editingRecipient ? 'Save' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

