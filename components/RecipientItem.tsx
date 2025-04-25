import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Link } from 'expo-router';
import { Recipient } from './RecipientList';
import { EditIcon, ChevronIcon, CrossIcon } from '../assets/icons';

interface RecipientItemProps {
  recipient: Recipient;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isEditingModeOn: boolean;
  avatarUrl: string;
}

export default function RecipientItem({
  avatarUrl,
  isEditingModeOn,
  onDelete,
  onEdit,
  recipient,
}: RecipientItemProps) {
  const handleDelete = () => {
    Alert.alert('Delete Recipient', 'Are you sure you want to delete this recipient?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(recipient.id),
      },
    ]);
  };

  return (
    <View className="flex-row items-center justify-between bg-white rounded-lg shadow-md mb-2">
      {isEditingModeOn && (
        <View className="flex-row h-full">
          <TouchableOpacity
            onPress={() => onEdit(recipient.id)}
            className="bg-blue-50 border-l border-gray-200 rounded-tl-lg rounded-bl-lg px-3 items-center justify-center"
          >
            <EditIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-50 border-l border-gray-200 px-4 items-center justify-center"
          >
            <CrossIcon />
          </TouchableOpacity>
        </View>
      )}
      <Link href={`/recipients/${recipient.id}`} asChild>
        <TouchableOpacity className="flex-row items-center flex-1 p-4 ">
          <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full" />
          <View className="flex-1 ml-3">
            <Text className="text-lg font-medium">{recipient.name}</Text>
            <Text className="text-gray-500">
              {recipient.birthday ? recipient.birthday : 'No birthday set'}
            </Text>
          </View>
          <ChevronIcon direction="right" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
