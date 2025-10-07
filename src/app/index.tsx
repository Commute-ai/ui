import { useEffect, useState } from "react";

import { View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import UserProfileHeader from "@/components/UserProfileHeader";

interface User {
    username: string;
}

export default function HomeScreen() {
    const { isLoggedIn, logout } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(true);
            setError(null);

            // TODO: Fetch real user data from your API
            // For now, you can either:
            // 1. Fetch user profile from API
            // 2. Store username during login and retrieve it
            // 3. Remove this section if you don't need user data displayed

            // Example API call (uncomment when ready):
            // const fetchUserProfile = async () => {
            //     try {
            //         const userData = await userApi.getProfile();
            //         setUser(userData);
            //     } catch (err) {
            //         setError("Failed to load user data");
            //     } finally {
            //         setIsLoading(false);
            //     }
            // };
            // fetchUserProfile();

            // For now, just clear the loading state
            setIsLoading(false);
        } else {
            setUser(null);
            setError(null);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // Router will handle redirect to login
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center gap-6 p-6">
                <View className="items-center gap-2">
                    <Text className="text-3xl font-bold">
                        Welcome to Commute.ai!
                    </Text>
                    <Text className="text-center text-muted-foreground">
                        You are successfully logged in
                    </Text>
                </View>

                <Button
                    onPress={handleLogout}
                    variant="destructive"
                    className="w-full max-w-xs"
                >
                    <Text>Logout</Text>
                </Button>
            </View>
        </View>
    );
}
