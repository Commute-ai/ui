import React from "react";

import { Search } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { Text } from "@/components/ui/text";

interface RecentSearchesProps {
    onQuickSearch: (from: string, to: string) => void;
}

export function RecentSearches({ onQuickSearch }: RecentSearchesProps) {
    return (
        <View className="space-y-3">
            <Text className="text-sm font-medium text-muted-foreground">
                Recent searches
            </Text>
            <View className="space-y-2">
                <TouchableOpacity
                    onPress={() => onQuickSearch("Exactum", "Kamppi")}
                    className="flex w-full flex-row items-center justify-between rounded-lg border border-border bg-card p-4 active:bg-muted"
                >
                    <View className="flex flex-row items-center gap-3">
                        <View className="flex flex-col gap-1">
                            <Text className="text-sm font-medium text-foreground">
                                Exactum → Kamppi
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                University to city center
                            </Text>
                        </View>
                    </View>
                    <Search className="h-4 w-4 text-muted-foreground" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onQuickSearch("Kamppi", "Pasila")}
                    className="flex w-full flex-row items-center justify-between rounded-lg border border-border bg-card p-4 active:bg-muted"
                >
                    <View className="flex flex-row items-center gap-3">
                        <View className="flex flex-col gap-1">
                            <Text className="text-sm font-medium text-foreground">
                                Kamppi → Pasila
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                City center to station
                            </Text>
                        </View>
                    </View>
                    <Search className="h-4 w-4 text-muted-foreground" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
