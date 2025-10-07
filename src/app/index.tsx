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

            // Simulate fetching user data with potential for error
            const timer = setTimeout(() => {
                if (Math.random() > 0.2) {
                    setUser({ username: "John Doe" });
                } else {
                    setError("Failed to load user data.");
                }
                setIsLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setUser(null);
            setError(null);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // Router will handle redirect to login
    }

    return (
        <View className="flex-1 bg-background">
            <UserProfileHeader
                user={user}
                isLoading={isLoading}
                error={error}
            />

            <View className="flex-1 items-center justify-center gap-6 p-6">
                <View className="items-center gap-2">
                    <Text className="text-3xl font-bold">
                        Welcome to Commute.ai!
                    </Text>
                    <Text className="text-center text-muted-foreground">
                        You are successfully logged in
                    </Text>
                </View>

                {user && (
                    <View className="items-center gap-1">
                        <Text className="text-lg text-foreground">
                            Hello, {user.username}
                        </Text>
                    </View>
                )}

                <Button
                    onPress={logout}
                    variant="destructive"
                    className="w-full max-w-xs"
                >
                    <Text>Logout</Text>
                </Button>
            </View>
        </View>
    );
}
