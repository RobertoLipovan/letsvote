import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Config from 'react-native-config';

const CommitInfo: React.FC = () => {
  const commitInfo = Config.COMMIT_INFO || '';
  const [commitHash, commitMessage] = commitInfo.split(':');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {/* test */}
        {commitHash && commitMessage ? `${commitHash.substring(0, 7)}: ${commitMessage}` : 'No commit info'}
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
    borderRadius: 4,
  },
  text: {
    color: '#999',
    fontSize: 10,
  },
});

export default CommitInfo;