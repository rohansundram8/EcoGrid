import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Profile</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEFBEF' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 40, color: '#3E2C1D' },
  logoutButton: { backgroundColor: '#0046b5ff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
