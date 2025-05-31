import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { router } from "expo-router";

const VersionInfo: React.FC<{ version: string }> = ({ version }) => {

  const goToTest = () => {
    router.navigate('/test')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={goToTest}>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 10,
    marginBottom: Platform.OS === 'android' || Platform.OS === 'ios' ? 20 : 0,
    zIndex: 9999,
  },
  text: {
    color: '#999',
    fontSize: 12,
  },
});

export default VersionInfo;