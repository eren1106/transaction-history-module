import TransactionService from "@/services/TransactionService";
import { Transaction } from "@/types/transaction";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, Text, View } from "react-native";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    const data = await TransactionService.getAllTransactions();
    setTransactions(data);
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

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View className="p-4 bg-white mb-2 rounded-lg shadow">
      <Text className="text-lg font-medium text-gray-800">{item.description}</Text>
      <Text className={`text-xl font-bold ${item.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
        {item.type === "debit" ? "-" : "+"} ${item.amount.toFixed(2)}
      </Text>
      <Text className="text-sm text-gray-500 mt-1">{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        className="px-4"
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}