import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CharacterListScreen from '../screens/CharacterListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';
import type {HomeStackParamList} from './types';
import {Colors} from '../theme/colors';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
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
        name="CharacterList"
        component={CharacterListScreen}
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

export default HomeStack;
