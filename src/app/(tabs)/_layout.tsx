import { Tabs } from "expo-router";
import { View } from "react-native";

import UserProfileHeader from "@/components/UserProfileHeader";

export default function TabsLayout() {
    return (
        <View className="flex-1">
            <UserProfileHeader />
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="index" />
            </Tabs>
        </View>
    );
}
