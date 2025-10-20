import { Tabs } from "expo-router";
import { View } from "react-native";

import UserProfileHeader from "@/components/UserProfileHeader";

import { RouteSearchProvider } from "@/context/RouteSearchContext";

export default function TabsLayout() {
    return (
        <RouteSearchProvider>
            <View className="flex-1">
                <UserProfileHeader />
                <Tabs screenOptions={{ headerShown: false }}>
                    <Tabs.Screen name="index" options={{ title: "Home" }} />
                    <Tabs.Screen name="routes" options={{ title: "Routes" }} />
                    <Tabs.Screen
                        name="profile"
                        options={{ title: "Profile" }}
                    />
                    <Tabs.Screen
                        name="settings"
                        options={{ title: "Settings" }}
                    />
                </Tabs>
            </View>
        </RouteSearchProvider>
    );
}
