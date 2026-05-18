import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';
import type {FavoritesStackParamList} from './types';
import {Colors} from '../theme/colors';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

const FavoritesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Colors.surface},
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {fontWeight: '700'},
        contentStyle: {backgroundColor: Colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default FavoritesStack;
