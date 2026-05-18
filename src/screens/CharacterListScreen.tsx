import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  AppState,
  type AppStateStatus,
  StatusBar,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  fetchCharacters,
  setSearchQuery,
  setStatusFilter,
  resetCharacters,
} from '../features/characters/charactersSlice';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import {useDebounce} from '../hooks/useDebounce';
import {SEARCH_DEBOUNCE_MS} from '../utils/constants';
import type {Character} from '../features/characters/types';
import type {HomeStackScreenProps} from '../navigation/types';
import {Colors} from '../theme/colors';
import CharacterCard, {CARD_ITEM_HEIGHT} from '../components/CharacterCard';
import SearchBar from '../components/SearchBar';
import StatusFilter from '../components/StatusFilter';
import LoadingFooter from '../components/LoadingFooter';
import EmptyState from '../components/EmptyState';

type Props = HomeStackScreenProps<'CharacterList'>;

const CharacterListScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {
    characters,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
    searchQuery,
    statusFilter,
    refreshing,
  } = useAppSelector(state => state.characters);
  const favoriteIds = useAppSelector(state => state.favorites.ids);
  const favoriteIdsSet = useRef(new Set<number>());

  // Keep a Set of favorite IDs for O(1) lookup
  useEffect(() => {
    favoriteIdsSet.current = new Set(favoriteIds);
  }, [favoriteIds]);

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Fetch on mount & when search/filter changes
  useEffect(() => {
    dispatch(resetCharacters());
    dispatch(
      fetchCharacters({
        page: 1,
        name: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [debouncedSearch, statusFilter, dispatch]);

  // App lifecycle: refresh stale data when returning from background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Silently refresh first page when app returns to foreground
        dispatch(
          fetchCharacters({
            page: 1,
            name: debouncedSearch,
            status: statusFilter,
          }),
        );
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [debouncedSearch, statusFilter, dispatch]);

  // Load next page for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      dispatch(
        fetchCharacters({
          page: page + 1,
          name: debouncedSearch,
          status: statusFilter,
        }),
      );
    }
  }, [loadingMore, hasMore, loading, page, debouncedSearch, statusFilter, dispatch]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    dispatch(resetCharacters());
    dispatch(
      fetchCharacters({
        page: 1,
        name: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [debouncedSearch, statusFilter, dispatch]);

  // Navigate to detail
  const handlePressCharacter = useCallback(
    (character: Character) => {
      navigation.navigate('CharacterDetail', {characterId: character.id});
    },
    [navigation],
  );

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    (character: Character) => {
      dispatch(toggleFavorite(character));
    },
    [dispatch],
  );

  // Search handler
  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch],
  );

  // Status filter handler
  const handleStatusChange = useCallback(
    (status: string) => {
      dispatch(setStatusFilter(status));
    },
    [dispatch],
  );

  // Render item with stable callbacks
  const renderItem = useCallback(
    ({item}: {item: Character}) => (
      <CharacterCard
        character={item}
        isFavorite={favoriteIdsSet.current.has(item.id)}
        onPress={handlePressCharacter}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [handlePressCharacter, handleToggleFavorite],
  );

  const keyExtractor = useCallback(
    (item: Character) => String(item.id),
    [],
  );

  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: CARD_ITEM_HEIGHT,
      offset: CARD_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // Render list header (search + filters)
  const ListHeaderComponent = useCallback(
    () => (
      <View>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Rick & Morty</Text>
          <Text style={styles.subtitle}>Explorer</Text>
        </View>
        <SearchBar value={searchQuery} onChangeText={handleSearchChange} />
        <StatusFilter
          selectedStatus={statusFilter}
          onSelectStatus={handleStatusChange}
        />
      </View>
    ),
    [searchQuery, handleSearchChange, statusFilter, handleStatusChange],
  );

  // Render empty / error states
  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading characters...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          message={error}
          actionLabel="Retry"
          onAction={handleRefresh}
        />
      );
    }

    return (
      <EmptyState
        icon="🔍"
        title="No characters found"
        message="Try adjusting your search or filters."
      />
    );
  }, [loading, error, handleRefresh]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<LoadingFooter loading={loadingMore} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        removeClippedSubviews={true}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        contentContainerStyle={
          characters.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
    marginTop: -2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
});

export default CharacterListScreen;
