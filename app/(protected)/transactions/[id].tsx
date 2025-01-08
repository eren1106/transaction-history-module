import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types/transaction';
import BiometricService from '@/services/BiometricService';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetailPage() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAmountVisible, setIsAmountVisible] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const data = await TransactionService.getTransactionById(id as string);
        setTransaction(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadTransaction();
  }, [id]);

  const handleRevealAmount = async () => {
    const result = await BiometricService.authenticate();
    if (result.success) {
      setIsAmountVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!transaction) return null;

  return (
    <View className='flex-1 bg-gray-100'>
      <View className='p-4'>
        <View className='bg-white p-6 rounded-xl shadow-lg'>
          <View className='items-center mb-6'>
            {isAmountVisible ? (
              <Text className={`text-3xl font-bold ${
                transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === "debit" ? "-" : "+"} ${transaction.amount.toFixed(2)}
              </Text>
            ) : (
              <Pressable 
                onPress={handleRevealAmount}
                className="items-center space-y-2"
              >
                <Text className="text-3xl font-bold">$ ***.**</Text>
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="eye-outline" size={20} color="gray" />
                  <Text className="text-gray-500">Tap to reveal amount</Text>
                </View>
              </Pressable>
            )}
          </View>

          <View className='space-y-4'>
            <View>
              <Text className='text-gray-500'>Description</Text>
              <Text className='text-lg font-medium'>{transaction.description}</Text>
            </View>

            <View>
              <Text className='text-gray-500'>Type</Text>
              <Text className='text-lg font-medium capitalize'>{transaction.type}</Text>
            </View>

            <View>
              <Text className='text-gray-500'>Date</Text>
              <Text className='text-lg font-medium'>{transaction.date}</Text>
            </View>

            <View>
              <Text className='text-gray-500'>Transaction ID</Text>
              <Text className='text-lg font-medium'>{transaction.id}</Text>
            </View>
            </View>
        </View>
      </View>
    </View>
  );
}