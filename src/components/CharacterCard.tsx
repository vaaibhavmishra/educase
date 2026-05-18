import React, {memo, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type {Character} from '../features/characters/types';
import {Colors} from '../theme/colors';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onPress: (character: Character) => void;
  onToggleFavorite: (character: Character) => void;
}

const CARD_HEIGHT = 120;

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

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  const handlePress = useCallback(() => {
    onPress(character);
  }, [character, onPress]);

  const handleFavorite = useCallback(() => {
    onToggleFavorite(character);
  }, [character, onToggleFavorite]);

  const statusColor = getStatusColor(character.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.species}, ${character.status}`}>
      <Image
        source={{uri: character.image}}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {character.name}
          </Text>
          <TouchableOpacity
            onPress={handleFavorite}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }>
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.species} numberOfLines={1}>
          {character.species}
          {character.type ? ` · ${character.type}` : ''}
        </Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
          <Text style={[styles.statusText, {color: statusColor}]}>
            {character.status}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.gender}>{character.gender}</Text>
        </View>

        <Text style={styles.location} numberOfLines={1}>
          📍 {character.location.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const CARD_ITEM_HEIGHT = CARD_HEIGHT + 12; // card + marginBottom

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  favoriteActive: {
    transform: [{scale: 1.1}],
  },
  species: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    color: Colors.textTertiary,
    marginHorizontal: 6,
    fontSize: 12,
  },
  gender: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  location: {
    color: Colors.textTertiary,
    fontSize: 11,
    marginTop: 4,
  },
});

export default memo(CharacterCard);
