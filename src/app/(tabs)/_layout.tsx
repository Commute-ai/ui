import { Tabs } from "expo-router";
import { Home, Route, User } from "lucide-react-native";
import { View } from "react-native";

import UserProfileHeader from "@/components/UserProfileHeader";

import { RouteSearchProvider } from "@/context/RouteSearchContext";

export default function TabsLayout() {
    return (
        <RouteSearchProvider>
            <View className="flex-1">
                <UserProfileHeader />
                <Tabs screenOptions={{ headerShown: false }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Home",
                            tabBarIcon: ({ color, size }) => (
                                <Home color={color} size={size} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="itineraries"
                        options={{
                            title: "Itineraries",
                            tabBarIcon: ({ color, size }) => (
                                <Route color={color} size={size} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Profile",
                            tabBarIcon: ({ color, size }) => (
                                <User color={color} size={size} />
                            ),
                        }}
                    />
                </Tabs>
            </View>
        </RouteSearchProvider>
    );
}
