import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';

interface LoadingFooterProps {
  loading: boolean;
}

const LoadingFooter: React.FC<LoadingFooterProps> = ({loading}) => {
  if (!loading) {
    return <View style={styles.spacer} />;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 24,
  },
});

export default React.memo(LoadingFooter);
