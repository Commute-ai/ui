import { useEffect } from "react";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NAV_THEME } from "@/lib/theme";

import { useAuth } from "@/hooks/useAuth";

import "@/global.css";

import { AuthProvider } from "@/context/AuthContext";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

const RootLayoutNav = () => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        setColorScheme("light");
    }, [setColorScheme]);

    return (
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack>
                <Stack.Protected guard={isSignedIn}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>
                <Stack.Protected guard={!isSignedIn}>
                    <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="register"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
};
export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
