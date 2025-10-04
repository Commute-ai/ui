import { AuthContext, AuthProvider } from "../contexts/AuthContext.jsx";

import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

import LoginScreen from "./Login.jsx";
import Registration from "./Registration.jsx";

// Placeholder HomeScreen - you can replace this with your actual home screen content
const HomeScreen = ({ navigation }) => {
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text>Welcome to the App!</Text>
            {isLoggedIn ? (
                <>
                    <Text>You are logged in!</Text>
                    <Button title="Logout" onPress={logout} />
                </>
            ) : (
                <Text>You are not logged in.</Text>
            )}
            {!isLoggedIn && ( // Show button only if not logged in
                <Button
                    title="Go to Login"
                    onPress={() => navigation.navigate("Login")}
                />
            )}
            <StatusBar style="auto" />
        </View>
    );
};

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Login" }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Home" }}
            />
            <Stack.Screen
                name="Register"
                component={Registration}
                options={{ title: "Register" }}
            />
        </Stack.Navigator>
    );
}

export default function Main() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
