import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function Registration({ navigation }) {
  // Add state for form inputs if needed
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Register button pressed');
    // Example: Check if passwords match, then call API
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Email:', email);
    console.log('Password:', password);
    // After successful registration, navigate to another screen (e.g., Login or Home)
    alert('Registration successful!'); // Mock success message
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {/* Add TextInput fields for email, password, confirm password, etc. */}
      {/* Example: */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
