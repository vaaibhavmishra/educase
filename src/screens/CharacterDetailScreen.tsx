import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import {fetchCharacterByIdApi} from '../api/rickAndMortyApi';
import type {Character} from '../features/characters/types';
import type {HomeStackScreenProps} from '../navigation/types';
import {Colors} from '../theme/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.85;

type Props = HomeStackScreenProps<'CharacterDetail'>;

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'alive':
      return Colors.statusAlive;
    case 'dead':
      return Colors.statusDead;
    default:
      return Colors.statusUnknown;
  }
};

const CharacterDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {characterId} = route.params;
  const dispatch = useAppDispatch();

  // Try to find character in existing Redux state first (avoids extra API call)
  const cachedCharacter = useAppSelector(state =>
    state.characters.characters.find(c => c.id === characterId),
  );
  const favoriteCharacter = useAppSelector(
    state => state.favorites.byId[characterId],
  );

  const [character, setCharacter] = useState<Character | null>(
    cachedCharacter || favoriteCharacter || null,
  );
  const [loading, setLoading] = useState(!character);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = useAppSelector(state =>
    state.favorites.ids.includes(characterId),
  );

  // Fetch character if not in cache
  useEffect(() => {
    if (!character) {
      setLoading(true);
      fetchCharacterByIdApi(characterId)
        .then(data => {
          setCharacter(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message || 'Failed to load character');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [characterId, character]);

  const handleToggleFavorite = useCallback(() => {
    if (character) {
      dispatch(toggleFavorite(character));
    }
  }, [character, dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !character) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'Character not found'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(character.status);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{uri: character.image}}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          {/* Name & Favorite */}
          <View style={styles.nameRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{character.name}</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
                <Text style={[styles.statusText, {color: statusColor}]}>
                  {character.status}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive,
              ]}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }>
              <Text style={styles.favoriteEmoji}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <InfoItem label="Species" value={character.species} icon="🧬" />
            <InfoItem label="Gender" value={character.gender} icon="⚡" />
            <InfoItem
              label="Origin"
              value={character.origin.name}
              icon="🌍"
            />
            <InfoItem
              label="Location"
              value={character.location.name}
              icon="📍"
            />
            {character.type ? (
              <InfoItem label="Type" value={character.type} icon="🏷️" />
            ) : null}
            <InfoItem
              label="Episodes"
              value={`${character.episode.length} episodes`}
              icon="📺"
            />
          </View>

          {/* Episode list preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearances</Text>
            <Text style={styles.sectionSubtitle}>
              Featured in {character.episode.length} episode
              {character.episode.length !== 1 ? 's' : ''}
            </Text>
            <View style={styles.episodeGrid}>
              {character.episode.slice(0, 12).map((ep, index) => {
                const epNumber = ep.split('/').pop();
                return (
                  <View key={ep} style={styles.episodeBadge}>
                    <Text style={styles.episodeBadgeText}>EP {epNumber}</Text>
                  </View>
                );
              })}
              {character.episode.length > 12 && (
                <View style={[styles.episodeBadge, styles.episodeBadgeMore]}>
                  <Text style={styles.episodeBadgeTextMore}>
                    +{character.episode.length - 12}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Created date */}
          <Text style={styles.createdDate}>
            Created: {new Date(character.created).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Sub-component for info items
const InfoItem: React.FC<{
  label: string;
  value: string;
  icon: string;
}> = ({label, value, icon}) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT * 0.4,
    backgroundColor: 'transparent',
    // Gradient effect via multiple overlapping views
    borderTopWidth: 0,
  },
  contentCard: {
    backgroundColor: Colors.background,
    marginTop: -32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 28,
    minHeight: 400,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nameContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.errorMuted,
    borderColor: Colors.error,
  },
  favoriteEmoji: {
    fontSize: 24,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 28,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: Colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 14,
  },
  episodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  episodeBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  episodeBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  episodeBadgeMore: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.border,
  },
  episodeBadgeTextMore: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  createdDate: {
    color: Colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CharacterDetailScreen;
