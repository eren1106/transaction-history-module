import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types/transaction';

export default function TransactionDetailPage() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        {/* <Pressable 
          onPress={() => router.back()}
          className='mb-4'
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable> */}

        <View className='bg-white p-6 rounded-xl shadow-lg'>
          <View className='items-center mb-6'>
            <Text className={`text-3xl font-bold ${
              transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.type === "debit" ? "-" : "+"} ${transaction.amount.toFixed(2)}
            </Text>
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