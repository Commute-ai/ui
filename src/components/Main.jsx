import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'; // Added Button
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login.jsx';
import Registration from './Registration.jsx'; // Import RegistrationScreen
import { StatusBar } from 'expo-status-bar';

// Placeholder HomeScreen - you can replace this with your actual home screen content
const HomeScreen = ({ navigation }) => { // Added navigation prop
  // Assume 'isLoggedIn' state is managed elsewhere (e.g., Context, Redux, or passed as prop)
  const isLoggedIn = false; // Placeholder: Replace with actual login state check

  return (
    <View style={styles.container}>
      <Text>Welcome to the App!</Text>
      <Text>YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE COMMUUUTTEEE AAIIII</Text>
      {!isLoggedIn && ( // Show button only if not logged in
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate('Login')}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const Stack = createNativeStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Register" component={Registration} options={{ title: 'Register' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
