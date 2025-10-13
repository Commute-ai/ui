import React from "react";

import { ActivityIndicator, View } from "react-native";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

interface User {
    username: string;
    // Add other user properties as needed
}

interface UserProfileHeaderProps {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    user,
    isLoading,
    error,
}) => {
    return (
        <View className="w-full">
            <Card className="rounded-none border-x-0 border-t-0 shadow-sm">
                <CardContent className="min-h-[72px] flex-row items-center justify-center py-3">
                    {isLoading ? (
                        <ActivityIndicator
                            testID="activity-indicator"
                            size="small"
                            color="#0000ff"
                        />
                    ) : error ? (
                        <Text className="text-sm text-destructive">
                            {error}
                        </Text>
                    ) : (
                        user && (
                            <View className="flex-1 flex-row items-center gap-3">
                                {/* Avatar */}
                                <View className="h-12 w-12 rounded-full bg-muted" />

                                {/* User Info */}
                                <View className="flex-1">
                                    <Text className="text-lg font-bold">
                                        {user.username}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        Logged in
                                    </Text>
                                </View>
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
