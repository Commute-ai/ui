import { authApi } from "../api";
import storage from "../utils/storage";

import React from "react";

import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleLogin = async () => {
        // Clear previous error
        setError("");

        // Basic validation
        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            return;
        }

        setLoading(true);

        try {
            // Call backend login API
            const response = await authApi.login(email, password);

            // Store authentication token
            if (response.access_token) {
                await storage.saveToken(response.access_token);
            }

            // Navigate to Home screen on success
            navigation.navigate("Home");
        } catch (err) {
            // Display error message to user
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title} testID="title">
                Login
            </Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                testID="emailInput"
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                editable={!loading}
                testID="passwordInput"
            />
            {error ? (
                <Text style={styles.errorText} testID="errorMessage">
                    {error}
                </Text>
            ) : null}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    testID="loadingIndicator"
                />
            ) : (
                <Button
                    title="Login"
                    onPress={handleLogin}
                    testID="loginButton"
                />
            )}
            <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff", // Or your app\'s background color
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    errorText: {
        color: "red",
        marginBottom: 12,
        textAlign: "center",
    },
});

export default LoginScreen;
