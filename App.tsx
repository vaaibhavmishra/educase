/**
 * EduCase — Rick & Morty Explorer
 * React Native CLI App with TypeScript, Redux, and Offline Persistence
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/app/store';
import RootNavigator from './src/navigation/RootNavigator';
import {Colors} from './src/theme/colors';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.background}
          />
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: Colors.primary,
                background: Colors.background,
                card: Colors.surface,
                text: Colors.textPrimary,
                border: Colors.border,
                notification: Colors.error,
              },
              fonts: {
                regular: {fontFamily: 'System', fontWeight: '400'},
                medium: {fontFamily: 'System', fontWeight: '500'},
                bold: {fontFamily: 'System', fontWeight: '700'},
                heavy: {fontFamily: 'System', fontWeight: '900'},
              },
            }}>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
