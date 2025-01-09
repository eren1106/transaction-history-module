import React from 'react'
import { ActivityIndicator } from 'react-native'

export default function LoadingEffect() {
  return (
    <ActivityIndicator size="large" className='text-primary scale-[1.5]' />
  )
}