import ChevronIcon from 'assets/icons/ChevronIcon';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  count: number;
}

export default function Accordion({ title, children, count }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <View className="bg-gray-50 rounded-lg border border-gray-200">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center justify-between py-3 px-4"
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-gray-700 font-medium">{title}</Text>
            <View className="bg-gray-200 rounded-full px-2 py-0.5">
              <Text className="text-gray-600 text-xs font-medium">{count}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-lg">
            <ChevronIcon direction={isOpen ? 'down' : 'right'} />
          </Text>
        </TouchableOpacity>

        {isOpen && <View className="border-t border-gray-200 px-4 py-3">{children}</View>}
      </View>
    </View>
  );
}
