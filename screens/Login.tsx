import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import GridBackground from './GridBackground';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HomeScreen');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEFBEF', paddingHorizontal: 30 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 30 },
  input: { backgroundColor: '#bad2ff', width: '100%', borderRadius: 50, paddingHorizontal: 20, height: 50, marginBottom: 16 },
  button: { backgroundColor: '#0046b5ff', borderRadius: 50, paddingVertical: 14, paddingHorizontal: 50, marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  eye: { fontSize: 18, marginBottom: 10 },
  link: { marginTop: 20, color: '#bad2ff', fontWeight: '600' },
});