import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import TaskBar from '../components/taskbar';
import { Feather, FontAwesome, Entypo } from '@expo/vector-icons';
import GridBackground from '../screens/GridBackground';
import { Asset } from 'expo-asset'; // Add this if you're using Expo!

// Removed redundant local declaration of auth

const HomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);


useEffect(() => {
  const preloadImages = async () => {
    try {
      await Asset.loadAsync([
        require('../assets/ac.png'),
        require('../assets/bedroom.png'),
        require('../assets/blender.png'),
        require('../assets/ceilinglamp.png'),
        require('../assets/dryer.png'),
        require('../assets/fridge.png'),
        require('../assets/fridgepopup.png'),
        require('../assets/home.png'),
        require('../assets/kitchen.png'),
        require('../assets/kitchen2.png'),
        require('../assets/lamp.png'),
        require('../assets/laundryroom.png'),
        require('../assets/livingroom.png'),
        require('../assets/oven.png'),
        require('../assets/search.png'),
        require('../assets/taskbar.png'),
        require('../assets/toaster.png'),
        require('../assets/tv.png'),
        require('../assets/washer.png'),
        require('../assets/Component 17.orig.png'),
        require('../assets/Component 18.orig.png'),
      ]);
    } catch (error) {
      console.warn('Error preloading images:', error);
    }
  };

  preloadImages();
}, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleRoomClick = (room: string) => {
    navigation.navigate(room);
  };

  const handleProfileClick = () => {
    if (user) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <GridBackground />
      <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
        <Feather name="user" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Home</Text>
      <Text style={styles.subtitle}>Tap to manage rooms & appliances</Text>

      <Image
        source={require('../assets/home.png')}
        style={styles.homeImage}
      />

      <View style={styles.taskbarWrapper}>
        <TaskBar />
      </View>

      <TouchableOpacity onPress={() => handleRoomClick("KitchenScreen")} style={styles.kitchenTouchableArea}>
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRoomClick("LivingRoomScreen")} style={styles.livingroomTouchableArea}>
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRoomClick("WashingRoomScreen")} style={styles.washingroomTouchableArea}>
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRoomClick("BedroomScreen")} style={styles.bedroomTouchableArea}>
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bad2ff',
  },
  profileButton: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 10,
    backgroundColor: '#4F85DE',
    borderRadius: 20,
    padding: 10,
  },
  profileText: {
    fontSize: 18,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#BAD2FF',
    marginTop: 75,
    marginLeft: 25,
    marginRight: 100,
  },
  subtitle: {
    fontSize: 18,
    color: '#BAD2FF',
    fontFamily: 'Roboto Mono',
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 20,
  },
  homeImage: {
    top: 50,
    width: '100%',
    height: 350,
    right: 0,
    color: '#0046B5',
    resizeMode: 'contain',
  },
  taskBar: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    width: '90%',
    height: 120, // Increased height
    paddingBottom: 20, // Slightly more padding
    resizeMode: 'contain',
  },
  kitchenTouchableArea: {
    position: 'absolute',
    top: 440,
    left: 35,
    width: 130,
    height: 100,
  },
  bedroomTouchableArea: {
    position: 'absolute',
    top: 370,
    left: 170,
    width: 150,
    height: 80,
  },
  livingroomTouchableArea: {
    position: 'absolute',
    top: 480,
    left: 200,
    width: 110,
    height: 70,
  },
  washingroomTouchableArea: {
    position: 'absolute',
    top: 460,
    left: 320,
    width: 50,
    height: 70,
  },
  taskbarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    width: '90%',
    backgroundColor: '#4F85DE', // ✅ correct property
  },
  summaryTouchableArea: {
    position: 'absolute',
    bottom: 20,
    left: '70%',
    width: '10%',
    height: 80, // Increased height
    paddingBottom: 20, // Slightly more padding
    resizeMode: 'contain',
  },
  transparentOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
