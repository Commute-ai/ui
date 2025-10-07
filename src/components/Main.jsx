import { AuthContext, AuthProvider } from "../contexts/AuthContext.jsx";
import { UserContext, UserProvider } from "../contexts/UserContext.jsx";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import HomeScreen from "./HomeScreen.jsx";
import LoginScreen from "./Login.jsx";
import ProfileScreen from "./ProfileScreen.jsx";
import Registration from "./Registration.jsx";
import SettingsScreen from "./SettingsScreen.jsx";
import UserProfileHeader from "./UserProfileHeader.jsx";

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { isLoggedIn } = useContext(AuthContext);
    const { user, isLoading, error } = useContext(UserContext);

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                title: route.name,
                headerRight: () => {
                    if (!isLoggedIn || route.name === "Login" || route.name === "Register") {
                        return null;
                    }
                    return (
                        <UserProfileHeader
                            user={user}
                            isLoading={isLoading}
                            error={error}
                        />
                    );
                },
            })}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Register" component={Registration} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}

export default function Main() {
    return (
        <AuthProvider>
            <UserProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </UserProvider>
        </AuthProvider>
    );
}
