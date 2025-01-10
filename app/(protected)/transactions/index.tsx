import TransactionService from "@/services/TransactionService";
import BiometricService from "@/services/BiometricService";
import { Transaction } from "@/types/transaction";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, SafeAreaView, Text, View } from "react-native";
import { Alert } from "react-native";
import SkeletonEffect from "~/components/skeleton-effect";
import { Ionicons } from "@expo/vector-icons";
import { useRevealedTransactions } from "@/hooks/useRevealedTransactions";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { revealTransaction, isRevealed } = useRevealedTransactions();

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
        revealTransaction(transactionId);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to authenticate biometrics');
    }
  };

  const renderAmount = (transaction: Transaction) => {
    if (isRevealed(transaction.id)) {
      return (
        <Text className={`text-xl font-bold ${transaction.type === 'debit' ? 'text-destructive' : 'text-primary'}`}>
          {transaction.type === "debit" ? "-" : "+"} RM {transaction.amount.toFixed(2)}
        </Text>
      );
    }
    return (
      <Pressable onPress={() => handleRevealAmount(transaction.id)} className="self-start">
        <Text className={`text-xl font-bold ${transaction.type === 'debit' ? 'text-destructive' : 'text-primary'}`}>
          RM ***.**
        </Text>
        <View className="flex-row items-center space-x-2">
          <Ionicons name="eye-outline" size={20} color="hsl(215.4 16.3% 46.9%)" />
          <Text className="text-sm text-muted-foreground"> (Tap to reveal)</Text>
        </View>
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
        <Text className="text-destructive mb-4">{error}</Text>
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
        contentContainerStyle={{ paddingBottom: 20 }}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleNavigateToDetail(item.id)}
            className={`active:opacity-70`}
          >
            <View className="flex-row items-center gap-3 p-4 mb-2 rounded-lg shadow-md bg-background">
              <View className={`flex justify-center items-center ${item.type === "credit" ? "bg-primary/10" : "bg-destructive/10"} rounded-full size-14`}>
                <Ionicons name={item.type === "credit" ? "arrow-up" : "arrow-down"} size={24} color={item.type === "credit" ? "hsl(221.2 83.2% 53.3%)" : "hsl(0 84.2% 60.2%)"} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold">{item.description}</Text>
                <Text className="text-muted-foreground">{item.date}</Text>
              </View>
              {renderAmount(item)}
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