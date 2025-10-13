import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const ProfileScreen = () => {
    const router = useRouter();
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-xl">Profile Screen</Text>
            <Button
                title="Go to Settings"
                onPress={() => router.push("/settings")}
            />
        </View>
    );
};

export default ProfileScreen;
