import React, {useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import type {Character} from '../features/characters/types';
import type {FavoritesStackScreenProps} from '../navigation/types';
import {Colors} from '../theme/colors';
import CharacterCard, {CARD_ITEM_HEIGHT} from '../components/CharacterCard';
import EmptyState from '../components/EmptyState';

type Props = FavoritesStackScreenProps<'FavoritesList'>;

const FavoritesScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.ids);
  const favoritesById = useAppSelector(state => state.favorites.byId);

  // Derive ordered list from IDs + lookup map
  const favorites: Character[] = favoriteIds
    .map(id => favoritesById[id])
    .filter(Boolean);

  const handlePressCharacter = useCallback(
    (character: Character) => {
      navigation.navigate('CharacterDetail', {characterId: character.id});
    },
    [navigation],
  );

  const handleToggleFavorite = useCallback(
    (character: Character) => {
      dispatch(toggleFavorite(character));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}: {item: Character}) => (
      <CharacterCard
        character={item}
        isFavorite={true}
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

  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.headerSection}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} character{favorites.length !== 1 ? 's' : ''} saved
        </Text>
      </View>
    ),
    [favorites.length],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon="💚"
        title="No favorites yet"
        message="Start exploring characters and tap the heart icon to save your favorites!"
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={
          favorites.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
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
    fontSize: 14,
    marginTop: 2,
  },
});

export default FavoritesScreen;
