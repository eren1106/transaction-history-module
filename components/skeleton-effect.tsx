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
        // <View key={index} className={cn("p-4 pb-1 rounded-lg w-full", className)}>
        //   <Skeleton className="h-5 w-[70%] mb-3" />
        //   <Skeleton className="h-6 w-[80%] mb-3" />
        //   <Skeleton className="h-4 w-[55%]" />
        // </View>
        <Skeleton key={index} className={cn("h-20 rounded-lg w-full mb-4", className)} />
      ))}
    </View>
  );
}