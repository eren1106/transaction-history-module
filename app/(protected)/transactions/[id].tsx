import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

export default function TransactionDetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className='flex-1 items-center justify-center p-4'>
      <View className='items-center space-y-2'>
        <Text className='text-xl font-bold'>Transaction Detail</Text>
        <Text className='text-lg'>ID - {id}</Text>
      </View>
    </View>
  )
}