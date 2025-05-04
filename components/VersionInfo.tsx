import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

const VersionInfo: React.FC<{ version: string }> = ({ version }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {version}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 10,
    marginBottom: Platform.OS === 'android' || Platform.OS === 'ios' ? 20 : 0,
  },
  text: {
    color: '#999',
    fontSize: 12,
  },
});

export default VersionInfo;