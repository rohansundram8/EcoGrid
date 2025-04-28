import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import GridBackground from '../screens/GridBackground';

const BedroomScreen = () => {
  const navigation = useNavigation();

  const handleApplianceClick = (applianceName: string) => {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        console.warn('No logged in user');
        return;
      }
    
      navigation.navigate('ApplianceModal', {
        userId: user.uid,
        appliance: applianceName,
      });
    };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  const bounce1 = useRef(new Animated.Value(1)).current;
  const bounce2 = useRef(new Animated.Value(1)).current;
  const bounce3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = (val: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(val, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(bounce1);
    animate(bounce2);
    animate(bounce3);
  }, []);

  return (
    <View style={styles.container}>
            <GridBackground/>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bedroom</Text>

      <View style={styles.bedroomWrapper}>
        <Image
          source={require('../assets/bedroom.png')}
          style={styles.bedroomImage}
        />
        <TouchableOpacity onPress={() => handleApplianceClick("Air Conditioner")} style={styles.airconditionerTouchableArea}>
          <View style={styles.transparentOverlay} />
          <Animated.View style={[styles.circle, { transform: [{ scale: bounce1 }] }]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleApplianceClick("TV")} style={styles.tvTouchableArea}>
          <View style={styles.transparentOverlay} />
          <Animated.View style={[styles.circle, { transform: [{ scale: bounce2 }] }]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleApplianceClick("Lamp")} style={styles.lampTouchableArea}>
          <View style={styles.transparentOverlay} />
          <Animated.View style={[styles.circle, { transform: [{ scale: bounce3 }] }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bad2ff', // Blue background like HomeScreen
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#BAD2FF',
    fontWeight: '500',
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    color: '#BAD2FF',
    position: 'absolute',
    top: 90,
    left: 20,
  },
  bedroomWrapper: {
    alignSelf: 'center',
    width: 360,
    height: 500,
    position: 'relative',
    top: 120,
  },
  bedroomImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  airconditionerTouchableArea: {
    position: 'absolute',
    top: 125,
    left: 50,
    width: 90,
    height: 50,
  },
  tvTouchableArea: {
    position: 'absolute',
    top: 190,
    left: 40,
    width: 100,
    height: 60,
  },
  lampTouchableArea: {
    position: 'absolute',
    top: 170,
    left: 145,
    width: 30,
    height: 60,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    marginTop: 5,
  },
});

export default BedroomScreen;
