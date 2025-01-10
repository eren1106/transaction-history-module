import { View, Text, Pressable, Alert, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types/transaction';
import BiometricService from '@/services/BiometricService';
import { Ionicons } from '@expo/vector-icons';
import LoadingEffect from '@/components/loading-effect';
import { useRevealedTransactions } from '@/hooks/useRevealedTransactions';
import { cn, convertFirstLetterToUpperCase } from '~/lib/utils';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { revealTransaction, isRevealed } = useRevealedTransactions();

  const loadTransaction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TransactionService.getTransactionById(id as string);
      setTransaction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transaction');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const handleRevealAmount = async () => {
    try {
      const result = await BiometricService.authenticate();
      if (result.success) {
        revealTransaction(transaction?.id as string);
      }
    } catch (err) {
      Alert.alert(
        'Authentication Failed',
        'Unable to verify your identity. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-secondary justify-center items-center p-4">
        <LoadingEffect />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-secondary justify-center items-center p-4">
        <Text className="text-destructive mb-4">{error}</Text>
        <Pressable
          onPress={loadTransaction}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!transaction) return null;

  return (
    <SafeAreaView className='flex-1 bg-secondary'>
      <View className='p-4'>
        <View className='p-6 rounded-xl shadow-md bg-background'>
          <View className='items-center mb-6'>
            {isRevealed(transaction.id) ? (
              <Text className={`text-3xl font-bold ${transaction.type === 'debit' ? 'text-destructive' : 'text-primary'
                }`}>
                {transaction.type === "debit" ? "-" : "+"} RM{transaction.amount.toFixed(2)}
              </Text>
            ) : (
              <Pressable
                onPress={handleRevealAmount}
                className="items-center gap-1"
              >
                <Text className={`text-3xl font-bold ${transaction.type === 'debit' ? 'text-destructive' : 'text-primary'}`}>RM ***.**</Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="eye-outline" size={20} color="gray" />
                  <Text className="text-muted-foreground">Tap to reveal amount</Text>
                </View>
              </Pressable>
            )}
          </View>

          <View className='gap-3'>
            <TransactionInfo label='Transaction ID' value={transaction.id} />
            <TransactionInfo label='Description' value={transaction.description} />
            <TransactionInfo
              label='Type'
              value={convertFirstLetterToUpperCase(transaction.type)}
              valueClassName={`px-2 rounded-full ${transaction.type === "credit" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
            />
            <TransactionInfo label='Date' value={transaction.date} />
            <TransactionInfo label='Category' value={transaction.category} />
            <TransactionInfo label='Status' value={convertFirstLetterToUpperCase(transaction.status)} />
            <TransactionInfo label='Merchant' value={transaction.merchant} />
            <TransactionInfo label='Location' value={transaction.location} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface TransactionInfoProps {
  label: string;
  value: string,
  valueClassName?: string
}

const TransactionInfo = ({ label, value, valueClassName }: TransactionInfoProps) => (
  <View className='self-start'>
    <Text className='text-muted-foreground'>{label}</Text>
    <Text className={cn('text-lg font-medium', valueClassName)}>{value}</Text>
  </View>
);