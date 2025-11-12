import React from "react";

import { Link } from "expo-router";
import { LogOut } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const UserProfileHeader: React.FC = () => {
    const { user, signOut, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <View
            className="w-full flex-row items-center justify-between border-b border-border bg-card px-4 py-3"
            style={{ paddingTop: insets.top + 12 }}
        >
            {!isLoaded ? (
                <ActivityIndicator
                    testID="activity-indicator"
                    size="small"
                    color="#0000ff"
                />
            ) : (
                user && (
                    <>
                        <Link href="/profile" asChild>
                            <TouchableOpacity className="flex-1 flex-row items-center gap-3">
                                {/* Avatar */}
                                <View
                                    className="h-10 w-10 rounded-full bg-muted"
                                    testID="avatar"
                                />

                                {/* User Info */}
                                <View>
                                    <Text className="text-lg font-bold">
                                        {user.username}
                                    </Text>
                                    <Text className="text-sm text-green-600">
                                        Logged in
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Link>

                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="ml-4 rounded-lg bg-destructive p-2.5"
                            testID="logout-button"
                        >
                            <Icon
                                as={LogOut}
                                className="text-destructive-foreground"
                                size={20}
                            />
                        </TouchableOpacity>
                    </>
                )
            )}
        </View>
    );
};

export default UserProfileHeader;
