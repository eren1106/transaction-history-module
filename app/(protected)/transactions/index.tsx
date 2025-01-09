import TransactionService from "@/services/TransactionService";
import BiometricService from "@/services/BiometricService";
import { Transaction } from "@/types/transaction";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, SafeAreaView, Text, View } from "react-native";
import { Alert } from "react-native";
import SkeletonEffect from "~/components/skeleton-effect";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [revealedAmounts, setRevealedAmounts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  // Handle revealing amount with biometric auth
  const handleRevealAmount = async (transactionId: string) => {
    try {
      const authResult = await BiometricService.authenticate();
      if (authResult.success) {
        setRevealedAmounts(prev => new Set([...prev, transactionId]));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to authenticate biometrics');
    }
  };

  const renderAmount = (transaction: Transaction) => {
    const isRevealed = revealedAmounts.has(transaction.id);
    if (isRevealed) {
      return (
        <Text className={`text-xl font-bold ${transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
          {transaction.type === "debit" ? "-" : "+"} RM {transaction.amount.toFixed(2)}
        </Text>
      );
    }
    return (
      <Pressable onPress={() => handleRevealAmount(transaction.id)} className="self-start">
        <Text className="text-xl font-bold text-gray-600">
          RM ***.**
          <Text className="text-sm text-blue-600"> (Tap to reveal)</Text>
        </Text>
      </Pressable>
    );
  };

  const handleNavigateToDetail = async (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-secondary">
        <SkeletonEffect count={5} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-red-600 mb-4">{error}</Text>
        <Pressable 
          onPress={loadTransactions}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <FlatList
        className="p-4"
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleNavigateToDetail(item.id)}
            className={`active:opacity-70`}
          >
            <View className="p-4 mb-2 rounded-lg shadow-md bg-background">
              <Text className="text-lg font-medium text-gray-800">{item.description}</Text>
              {renderAmount(item)}
              <Text className="text-sm text-gray-500 mt-1">{item.date}</Text>
            </View>
          </Pressable>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}