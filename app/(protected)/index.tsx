import { Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center p-4">
      <Button onPress={() => {
        router.push('/transactions')
      }}>
        <Text>View Transactions History</Text>
      </Button>
    </SafeAreaView>
  )
}