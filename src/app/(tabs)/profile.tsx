import { Settings } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import RouteSpecificPreferences from "@/components/RouteSpecificPreferences";
import UserPreferences from "@/components/UserPreferences";

export default function ProfilePage() {
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
                <RouteSpecificPreferences />
            </View>
        </ScrollView>
    );
}
