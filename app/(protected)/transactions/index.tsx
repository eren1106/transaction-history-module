import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function TransactionsPage() {
  const router = useRouter();

  const handleNavigateToDetail = () => {
    router.push("/transactions/123");
  };

  return (
    <View
      className="flex-1 justify-center items-center"
    >
      <Text className="font-bold text-3xl">Transaction History Page</Text>
      <Button title="View Transaction Detail" onPress={handleNavigateToDetail} />
    </View>
  );
}
