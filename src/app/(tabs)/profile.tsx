"use client";

import { useState } from "react";

import { MapPin, Plus, Settings } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import UserPreferences from "@/components/UserPreferences";

export default function ProfilePage() {
    const [routePreferences] = useState([
        {
            id: 1,
            from: "Exactum",
            to: "Kamppi",
            preferences: [
                "Never use the tram for this route",
                "Prefer bus 506",
                "Avoid rush hour metro",
            ],
        },
        {
            id: 2,
            from: "Kamppi",
            to: "Pasila",
            preferences: [
                "Always use metro when available",
                "Avoid walking through Töölö",
            ],
        },
    ]);

    return (
        <ScrollView className="flex-1 bg-background">
            {/* Header */}
            <View className="border-b border-border bg-card shadow-sm">
                <View className="p-4">
                    <View className="flex items-center gap-3">
                        <View className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-teal-500">
                            <Settings className="h-5 w-5 text-white" />
                        </View>
                        <View>
                            <Text className="text-lg font-semibold text-foreground">
                                Route Preferences
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                Customize your journey experience
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="space-y-6 p-4 pb-24">
                {/* Global Preferences Section */}
                <UserPreferences />

                {/* Route-Specific Preferences */}
                <View>
                    <Text className="mb-3 text-base font-semibold text-foreground">
                        Route-Specific Preferences
                    </Text>
                    <Text className="mb-4 text-sm text-muted-foreground">
                        Set custom preferences for your frequent routes
                    </Text>

                    <View className="space-y-3">
                        {routePreferences.map((route) => (
                            <View
                                key={route.id}
                                className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            >
                                {/* Route Header */}
                                <View className="mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    <View className="flex items-center gap-2 text-sm font-medium">
                                        <Text className="text-foreground">
                                            {route.from}
                                        </Text>
                                        <Text className="text-muted-foreground">
                                            →
                                        </Text>
                                        <Text className="text-foreground">
                                            {route.to}
                                        </Text>
                                    </View>
                                </View>

                                {/* Route Preferences */}
                                <View className="flex flex-wrap gap-2">
                                    {route.preferences.map((pref, index) => (
                                        <View
                                            key={index}
                                            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-3 py-1.5 text-sm text-teal-900"
                                        >
                                            <Text>{pref}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Add Button for Route */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-3"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    <Text className="text-xs text-muted-foreground group-hover:text-foreground">
                                        Add preference for this route
                                    </Text>
                                </Button>
                            </View>
                        ))}
                    </View>

                    {/* Add New Route Button */}
                    <Button
                        variant="outline"
                        className="mt-4 w-full border-dashed bg-transparent"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <Text>Add new route preference</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}
