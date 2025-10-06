import React, { useContext, useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

import { AuthContext, AuthProvider } from "@/lib/contexts/AuthContext";

import UserProfileHeader from "@/components/UserProfileHeader";

import LoginScreen from "@/screens/Login";
import Registration from "@/screens/Register";

// Placeholder HomeScreen - you can replace this with your actual home screen content
const HomeScreen = ({ navigation }) => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(true);
            setError(null);
            // Simulate fetching user data with potential for error
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    setUser({ username: "John Doe" });
                } else {
                    setError("Failed to load user data.");
                }
                setIsLoading(false);
            }, 1500);
        } else {
            setUser(null);
            setError(null);
        }
    }, [isLoggedIn]);

    return (
        <View style={styles.container}>
            {isLoggedIn && (
                <UserProfileHeader
                    user={user}
                    isLoading={isLoading}
                    error={error}
                />
            )}
            <View style={styles.contentContainer}>
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
            </View>
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
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
