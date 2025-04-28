import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const GridBackground = () => {
  const numVerticalLines = Math.ceil(width / 30);
  const numHorizontalLines = Math.ceil(height / 30);

  const verticalLines = Array.from({ length: numVerticalLines }, (_, i) => (
    <View key={`v-${i}`} style={[styles.line, { left: i * 30 }]} />
  ));
  const horizontalLines = Array.from({ length: numHorizontalLines }, (_, i) => (
    <View key={`h-${i}`} style={[styles.lineHorizontal, { top: i * 30 }]} />
  ));

  return (
    <View style={styles.background}>
      {verticalLines}
      {horizontalLines}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0046B5', // 💙 set solid blue background!
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)', // Light white grid lines
  },
  lineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default GridBackground;