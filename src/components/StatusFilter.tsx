import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {STATUS_OPTIONS} from '../utils/constants';
import {Colors} from '../theme/colors';

interface StatusFilterProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {STATUS_OPTIONS.map(status => {
          const isSelected = selectedStatus === status;
          return (
            <StatusChip
              key={status}
              label={status}
              isSelected={isSelected}
              onPress={onSelectStatus}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

interface StatusChipProps {
  label: string;
  isSelected: boolean;
  onPress: (status: string) => void;
}

const StatusChip: React.FC<StatusChipProps> = React.memo(
  ({label, isSelected, onPress}) => {
    const handlePress = useCallback(() => {
      onPress(label);
    }, [label, onPress]);

    const dotColor =
      label === 'Alive'
        ? Colors.statusAlive
        : label === 'Dead'
        ? Colors.statusDead
        : label === 'Unknown'
        ? Colors.statusUnknown
        : undefined;

    return (
      <TouchableOpacity
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{selected: isSelected}}
        accessibilityLabel={`Filter by ${label}`}>
        {dotColor && (
          <View style={[styles.chipDot, {backgroundColor: dotColor}]} />
        )}
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.primary,
  },
});

export default React.memo(StatusFilter);
