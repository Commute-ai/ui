import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';

// TODO: Replace with a proper environment variable setup
//const API_DOMAIN = 'https://backend.staging.commute.ai.ender.fi';
const API_DOMAIN = 'http://10.0.2.2:8000';

export default function Registration({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match!");
      return;
    }

    const registrationUrl = `${API_DOMAIN}/api/v1/auth/register`;
    let responseTextForLogging = ''; // To make response text available in the main catch block

    try {
      const response = await fetch(registrationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      responseTextForLogging = responseText; // Store for potential logging in catch block

      if (!response.ok) {
        // Server returned an HTTP error status (4xx or 5xx)
        console.error('Registration failed. Status:', response.status);
        console.error('Raw server response:', responseText);
        
        try {
          const errorJson = JSON.parse(responseText);
          let userFriendlyMessage = 'Registration failed. Please double-check your information and try again.';

          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail) && errorJson.detail.length > 0 && errorJson.detail[0] && typeof errorJson.detail[0].msg === 'string') {
              const serverMsgDetail = errorJson.detail[0].msg;
              // Log the original server message for debugging
              console.log('Server error detail:', serverMsgDetail);

              if (serverMsgDetail.toLowerCase().includes("not a valid email address") && serverMsgDetail.toLowerCase().includes("@-sign")) {
                userFriendlyMessage = "The email address you entered is not valid. Please ensure it includes an '@' symbol and a domain (e.g., user@example.com).";
              } else {
                // For other specific errors, you can add more conditions here
                // For now, a generic message if the detail is present but not specifically handled
                userFriendlyMessage = "There was an issue with the information provided. Please review your details.";
              }
            } else if (typeof errorJson.detail === 'string') {
              // If errorJson.detail is just a string, log it, but show a generic user-friendly message
              console.log('Server error detail string:', errorJson.detail);
              userFriendlyMessage = "Registration failed due to an issue with the provided data. Please try again.";
            }
          }
          Alert.alert('Registration Failed', userFriendlyMessage);
        } catch (parseError) {
          // This catch is for JSON.parse(responseText) failing inside the !response.ok block
          console.error('Failed to parse server error response JSON:', parseError);
          Alert.alert('Registration Failed', 'Could not understand the server\'s error message. The raw response for our developers is: ' + responseTextForLogging);
        }
        return; // Exit if the request was not successful
      }

      // HTTP request was successful (2xx status)
      // Attempt to parse. If it fails, main catch will handle.
      const data = JSON.parse(responseText); 
      Alert.alert('Success', 'Registration successful!'); // Or handle token `data.access_token`
      navigation.navigate('Login');

    } catch (error) {
      // This outer catch handles:
      // 1. Network errors from fetch() itself.
      // 2. JSON.parse(responseText) errors for successful responses (if 'data' parsing fails).
      // 3. Any other unexpected errors during the try block.
      console.error('Registration process error:', error);
      if (responseTextForLogging) { 
        console.error('Raw response text associated with the error:', responseTextForLogging);
      }

      if (error instanceof SyntaxError) {
        Alert.alert('Registration Error', 'Received an invalid data format from the server. Please check the console.');
      } else if (error.message && error.message.toLowerCase().includes('network request failed')) {
        Alert.alert('Registration Error', 'Could not connect to the server. Please check your network connection.');
      } else {
        Alert.alert('Registration Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
