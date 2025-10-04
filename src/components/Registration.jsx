import { authApi } from "../api";

import React from "react";

import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Registration({ navigation }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords don't match!");
            return;
        }

        try {
            await authApi.register(username, password);
            Alert.alert("Success", "Registration successful!");
            navigation.navigate("Login");
        } catch (error) {
            // Check if it's a network error
            if (
                error.message &&
                error.message
                    .toLowerCase()
                    .includes("could not connect to the server")
            ) {
                Alert.alert("Registration Error", error.message);
            } else {
                Alert.alert("Registration Failed", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
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
});
