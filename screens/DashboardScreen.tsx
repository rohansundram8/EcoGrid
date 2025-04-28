import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomNavBar from '../components/taskbar';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Feather, FontAwesome, Entypo } from '@expo/vector-icons';
import GridBackground from './GridBackground';

const applianceData = [
  { name: 'Fridge', image: require('../assets/fridge.png') },
  { name: 'Blender', image: require('../assets/blender.png') },
  { name: 'Toaster', image: require('../assets/toaster.png') },
  { name: 'Oven', image: require('../assets/oven.png') },
  { name: 'Lamp', image: require('../assets/lamp.png') },
  { name: 'TV', image: require('../assets/tv.png') },
  { name: 'Air Conditioner', image: require('../assets/ac.png') },
  { name: 'Washer', image: require('../assets/washer.png') },
  { name: 'Dryer', image: require('../assets/dryer.png') },
  { name: 'Ceiling Lamp', image: require('../assets/ceilinglamp.png') },
];

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const handleProfileClick = () => {
    if (user) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleCardClick = (screen: string, applianceName?: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn('No logged in user');
      return;
    }

    if (applianceName) {
      navigation.navigate(screen as never, { userId: user.uid, appliance: applianceName } as never);
    } else {
      navigation.navigate(screen as never);
    }
  };

  const [goals, setGoals] = useState([
    { text: 'Compost 4 times', completed: false },
    { text: 'Use washer only twice', completed: false },
  ]);

  const toggleGoal = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setGoals(updatedGoals);
  };

  return (
    <View style={styles.container}>
      <GridBackground/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.cardRow}>
          <TouchableOpacity onPress={() => handleCardClick('UsageUpdateScreen')} style={styles.card}>
            <Text style={styles.plus}>＋</Text>
            <Text style={styles.cardLabel}>Usage Update</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCardClick('MonthSummaryScreen')} style={styles.card}>
            <AntDesign name="barschart" size={36} color="white" />
            <Text style={styles.cardLabel}>Monthly Summary</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Appliances</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.applianceRow}
        >
          {applianceData.map((appliance, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardClick('ApplianceModal', appliance.name)}
            >
              <Image source={appliance.image} style={styles.applianceImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Goals for the Week</Text>
        <View style={styles.goalSection}>
          {goals.map((goal, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.goalBox,
                goal.completed && styles.goalBoxCompleted,
              ]}
              onPress={() => toggleGoal(index)}
            >
              <Text
                style={[
                  styles.goalText,
                  goal.completed && styles.goalTextCompleted,
                ]}
              >
                {goal.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.taskbarWrapper}>
        <BottomNavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#BAD2FF',
    marginTop: 10,
    marginLeft: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 25,
  },
  card: {
    width: 150,
    height: 130,
    backgroundColor: '#2972ea',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: 5,
    right: 20,
    zIndex: 10,
    backgroundColor: '#4F85DE',
    borderRadius: 20,
    padding: 10,
  },
  profileText: {
    fontSize: 18,
  },
  plus: {
    fontSize: 36,
    color: 'white',
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 14,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BAD2FF',
    marginTop: 30,
    marginLeft: 20,
  },
  applianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  applianceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  goalSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  goalBox: {
    backgroundColor: '#2972ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
  },
  goalText: {
    fontSize: 16,
    color: 'white',
  },
  taskbarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    width: '90%',
  },
  goalBoxCompleted: {
    backgroundColor: '#A9A9A9',
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#e0e0e0',
  },
});

export default DashboardScreen;
