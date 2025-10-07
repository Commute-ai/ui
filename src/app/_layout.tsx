import { useEffect, useState } from "react";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { AuthProvider } from "@/lib/contexts/AuthContext";
import { NAV_THEME } from "@/lib/theme";

import { useAuth } from "@/hooks/useAuth";

import "@/global.css";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

const RootLayoutNav = () => {
    const { colorScheme } = useColorScheme();
    const { isLoggedIn } = useAuth();

    return (
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack>
                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>
                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                </Stack.Protected>
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
};
export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
