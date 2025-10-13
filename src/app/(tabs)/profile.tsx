import React from "react";

import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

const ProfileScreen = () => {
    const router = useRouter();
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-xl">Profile Screen</Text>
            <Button
                title="Go to Settings"
                onPress={() => router.push("/settings")}
            />
        </View>
    );
};

export default ProfileScreen;
