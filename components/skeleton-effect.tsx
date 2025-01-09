import * as React from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';
import { Skeleton } from './ui/skeleton';

interface SkeletonEffectProps {
  count?: number;
  className?: string;
  containerClassName?: string;
}

export default function SkeletonEffect({
  count = 5,
  className,
  containerClassName,
}: SkeletonEffectProps) {
  return (
    <View className={cn("w-full", containerClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className={cn("p-4 rounded-lg w-full", className)}>
          <Skeleton className="h-6 w-[50%] mb-3" />
          <Skeleton className="h-7 w-[60%] mb-3" />
          <Skeleton className="h-5 w-[35%]" />
        </View>
      ))}
    </View>
  );
}