import clsx from 'clsx';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckIcon, CrossIcon, UndoIcon } from '../assets/icons';
import { Gift } from './GiftList';

interface GiftItemProps {
  gift: Gift;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleCompleted: (id: string) => void;
}

export default function GiftItem({ gift, onDelete, onEdit, onToggleCompleted }: GiftItemProps) {
  return (
    <View
      testID={`gift-item-${gift.id}`}
      className={clsx(
        'flex-row items-center justify-between bg-white rounded-lg border border-gray-50 mb-2',
        gift.completed ? 'shadow-sm' : 'shadow-md shadow-black/5'
      )}
    >
      <TouchableOpacity
        className="flex-row items-center flex-1 p-3"
        onPress={() => onEdit(gift.id)}
      >
        <View className="flex-row items-center">
          {gift.imageUri && (
            <Image source={{ uri: gift.imageUri }} className="w-12 h-12 rounded-lg" />
          )}
          <View className="pl-3">
            <Text className="text-lg font-medium">{gift.name}</Text>
            {gift.price && <Text className="text-sm text-gray-500">${gift.price}</Text>}

            {gift.completed && (
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-green-800 font-medium">Bought</Text>
              </View>
            )}

            {gift.description && !gift.completed && (
              <Text className="text-sm text-gray-600" numberOfLines={1}>
                {gift.description}
              </Text>
            )}
            {gift.store && <Text className="text-sm text-gray-500">{gift.store}</Text>}
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-row h-full">
        <TouchableOpacity
          onPress={() => onToggleCompleted(gift.id)}
          accessibilityLabel={gift.completed ? 'Mark as not bought' : 'Mark as bought'}
          className=" bg-green-50 border-l border-gray-200 px-4 items-center justify-center"
        >
          {gift.completed ? <UndoIcon /> : <CheckIcon />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(gift.id)}
          accessibilityLabel="Delete gift"
          className="bg-red-50 border-l border-gray-200 px-4 items-center justify-center rounded-tr-lg rounded-br-lg"
        >
          <CrossIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}
