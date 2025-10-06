import { Link, Stack, useRouter } from "expo-router";
import { MoonStarIcon, StarIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Image, type ImageStyle, View } from "react-native";

import { THEME } from "@/lib/theme";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import UserProfileHeader from "@/components/UserProfileHeader";

const LOGO = {
    light: require("../../assets/images/react-native-reusables-light.png"),
    dark: require("../../assets/images/react-native-reusables-dark.png"),
};

const SCREEN_OPTIONS = {
    light: {
        title: "Commute.ai",
        headerShadowVisible: true,
        contentStyle: { backgroundColor: THEME.light.background },
    },
    dark: {
        title: "Commute.ai",
        headerShadowVisible: true,
        contentStyle: { backgroundColor: THEME.dark.background },
    },
};

export default function Screen() {
    const { isLoggedIn, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(true);
            setError(null);

            // Fetch user data
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    setUser({ username: "John Doe" });
                } else {
                    setError("Failed to load user data.");
                }
                setIsLoading(false);
            }, 1000);
        } else {
            setUser(null);
            setError(null);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // Router will handle redirect
    }

    return (
        <View className="flex-1 bg-background">
            <UserProfileHeader
                user={user}
                isLoading={isLoading}
                error={error}
            />

            <View className="flex-1 items-center justify-center gap-4 p-4">
                <Text className="text-2xl font-bold">Welcome to the App!</Text>
                <Text className="text-muted-foreground">
                    You are logged in!
                </Text>

                <Button onPress={logout} variant="destructive">
                    <Text>Logout</Text>
                </Button>
            </View>
        </View>
    );
}
