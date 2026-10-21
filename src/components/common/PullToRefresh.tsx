import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
}

export function usePullToRefresh({ onRefresh }: UsePullToRefreshOptions) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.surface}
    />
  );

  return { refreshing, handleRefresh, refreshControl };
}

interface PullToRefreshScrollViewProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  style?: object;
  contentContainerStyle?: object;
}

export function PullToRefreshScrollView({
  onRefresh,
  children,
  style,
  contentContainerStyle,
}: PullToRefreshScrollViewProps) {
  const { refreshControl } = usePullToRefresh({ onRefresh });

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

interface PullToRefreshFlatListProps<T> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  onRefresh: () => Promise<void>;
  keyExtractor: (item: T, index: number) => string;
  numColumns?: number;
  columnWrapperStyle?: object;
  contentContainerStyle?: object;
  ListEmptyComponent?: React.ComponentType | React.ReactElement;
  style?: object;
}

export function PullToRefreshFlatList<T>({
  data,
  renderItem,
  onRefresh,
  keyExtractor,
  numColumns,
  columnWrapperStyle,
  contentContainerStyle,
  ListEmptyComponent,
  style,
}: PullToRefreshFlatListProps<T>) {
  const { refreshControl } = usePullToRefresh({ onRefresh });

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={ListEmptyComponent}
      style={style}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    />
  );
}
