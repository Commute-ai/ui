import { AuthContext } from "../contexts/AuthContext.jsx";

import React, { useContext } from "react";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

const HomeScreen = ({ navigation }) => {
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text>Welcome to the App!</Text>
                {isLoggedIn ? (
                    <>
                        <Text>You are logged in!</Text>
                        <Button title="Logout" onPress={logout} />
                        <Button
                            title="Go to Profile"
                            onPress={() => navigation.navigate("Profile")}
                        />
                        <Button
                            title="Go to Settings"
                            onPress={() => navigation.navigate("Settings")}
                        />
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

export default HomeScreen;
