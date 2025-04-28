import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import GridBackground from '../screens/GridBackground';

const LivingRoomScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

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
    const animate = (ref: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ref, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(ref, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(bounce1);
    animate(bounce2);
    animate(bounce3);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <GridBackground/>

      <Text style={styles.title}>Living Room</Text>

      <View style={styles.livingRoomWrapper}>
        <Image
          source={require('../assets/livingroom.png')}
          style={styles.livingRoomImage}
        />

        <TouchableOpacity onPress={() => handleApplianceClick("Lamp")} style={styles.lampTouchableArea}>
          <View style={styles.transparentOverlay} />
          <Animated.View style={[styles.circle, { transform: [{ scale: bounce1 }] }]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleApplianceClick("TV")} style={styles.tvTouchableArea}>
          <View style={styles.transparentOverlay} />
          <Animated.View style={[styles.circle, { transform: [{ scale: bounce2 }] }]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleApplianceClick("Air Conditioner")} style={styles.airconditionerTouchableArea}>
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
    backgroundColor: '#bad2ff', // Updated to match HomeScreen background
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
    color: '#BAD2FF', // Consistent brown text
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
  livingRoomWrapper: {
    alignSelf: 'center',
    width: 360,
    height: 500,
    position: 'relative',
    top: 120,
  },
  livingRoomImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  lampTouchableArea: {
    position: 'absolute',
    top: 140,
    left: 140,
    width: 42,
    height: 45,
  },
  tvTouchableArea: {
    position: 'absolute',
    top: 154,
    left: 220,
    width: 100,
    height: 80,
  },
  airconditionerTouchableArea: {
    position: 'absolute',
    top: 140,
    left: 60,
    width: 70,
    height: 45,
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
  popupContainer: {
    position: 'absolute',
    top: 140,
    left: 50,
    zIndex: 20,
    alignItems: 'flex-end',
  },
  popupImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  closeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2C1D',
  },
});

export default LivingRoomScreen;
