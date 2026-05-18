import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';

/**
 * Home tab stack param list
 */
export type HomeStackParamList = {
  CharacterList: undefined;
  CharacterDetail: {characterId: number};
};

/**
 * Favorites tab stack param list
 */
export type FavoritesStackParamList = {
  FavoritesList: undefined;
  CharacterDetail: {characterId: number};
};

/**
 * Root bottom tab param list
 */
export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
};

/**
 * Screen props types for type-safe navigation
 */
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;

export type FavoritesStackScreenProps<T extends keyof FavoritesStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FavoritesStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;
