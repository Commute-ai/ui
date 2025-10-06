import { authApi } from "@/lib/api";

import React from "react";

import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Registration({ navigation }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleRegister = async () => {
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        if (!username || !password) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            await authApi.register(username, password);
            navigation.navigate("Login");
        } catch (error) {
            const message = error.message || "An unexpected error occurred.";
            setError("Registration Failed " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                required
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
                editable={!loading}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                required
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                editable={!loading}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                required
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry
                editable={!loading}
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
                    title="Register"
                    onPress={handleRegister}
                    testID="registerButton"
                />
            )}
            <Button
                title="Back to Login"
                onPress={() => navigation.navigate("Login")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 12,
        textAlign: "center",
    },
});
