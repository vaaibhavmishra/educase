import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, StyleSheet, View} from 'react-native';
import HomeStack from './HomeStack';
import FavoritesStack from './FavoritesStack';
import type {RootTabParamList} from './types';
import {Colors} from '../theme/colors';
import {useAppSelector} from '../app/hooks';

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Custom tab bar icon component — uses emoji/text icons
 * to avoid third-party icon library dependencies.
 */
const TabIcon: React.FC<{label: string; focused: boolean; badge?: number}> = ({
  label,
  focused,
  badge,
}) => {
  const icon = label === 'Explore' ? '🌀' : '❤️';

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badge > 99 ? '99+' : String(badge)}
          </Text>
        </View>
      )}
    </View>
  );
};

const RootNavigator: React.FC = () => {
  const favoritesCount = useAppSelector(state => state.favorites.ids.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Explore',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Explore" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favorites',
          tabBarIcon: ({focused}) => (
            <TabIcon
              label="Favorites"
              focused={focused}
              badge={favoritesCount}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBarBackground,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    paddingTop: 4,
    height: 88,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default RootNavigator;
