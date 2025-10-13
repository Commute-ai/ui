import React from "react";

import { LogOut } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

const UserProfileHeader: React.FC = () => {
    const { user, signOut, isLoaded } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <View className="w-full">
            <Card className="rounded-none border-x-0 border-t-0 shadow-sm">
                <CardContent className="min-h-[72px] flex-row items-center justify-center py-3">
                    {!isLoaded ? (
                        <ActivityIndicator
                            testID="activity-indicator"
                            size="small"
                            color="#0000ff"
                        />
                    ) : (
                        user && (
                            <View className="flex-1 flex-row items-center gap-3">
                                {/* Avatar */}
                                <View
                                    className="h-12 w-12 rounded-full bg-muted"
                                    testID="avatar"
                                />

                                {/* User Info */}
                                <View className="flex-1">
                                    <Text className="text-lg font-bold">
                                        {user.username}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        Logged in
                                    </Text>
                                </View>

                                {/* Logout Button */}
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    className="rounded-lg bg-destructive p-2.5"
                                    testID="logout-button"
                                >
                                    <Icon
                                        as={LogOut}
                                        className="text-destructive-foreground"
                                        size={20}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    )}
                </CardContent>
            </Card>
            <Separator />
        </View>
    );
};

export default UserProfileHeader;
