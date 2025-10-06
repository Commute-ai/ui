import { useEffect, useState } from "react";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot, useRouter, useSegments } from "expo-router";
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
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    // Wait for layout to be ready
    useEffect(() => {
        setIsReady(true);
    }, []);

    // Redirect logic - only after ready
    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isLoggedIn && !inAuthGroup) {
            router.replace("/login");
        } else if (isLoggedIn && inAuthGroup) {
            router.replace("/");
        }
    }, [isLoggedIn, segments, isReady]);

    return (
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Slot />
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
