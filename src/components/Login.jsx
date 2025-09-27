import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  // Add state for username and password if needed
  // const [username, setUsername] = React.useState('');
  // const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Implement your login logic here
    // For now, let's navigate to a hypothetical 'Home' screen
    // navigation.navigate('Home');
    console.log('Login button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="title">Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        // onChangeText={setUsername}
        // value={username}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        // onChangeText={setPassword}
        // value={password}
      />
      <Button title="Login" onPress={handleLogin} testID="loginButton" />
      {/* Example: Add a button to navigate to a registration screen */}
      <Button
        title="Don\'t have an account? Sign Up"
        onPress={() => navigation.navigate('Register')} // Assuming you have a 'Register' screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // Or your app\'s background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default LoginScreen;