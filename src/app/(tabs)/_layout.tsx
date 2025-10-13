import { Tabs } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

import UserProfileHeader from "@/components/UserProfileHeader";

export default function TabsLayout() {
    const { user, isLoaded } = useAuth();

    return (
        <View className="flex-1">
            <UserProfileHeader user={user} isLoading={!isLoaded} error={null} />
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="index" />
            </Tabs>
        </View>
    );
}
