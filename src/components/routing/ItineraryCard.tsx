"use client";

import React from "react";

import {
    Bus,
    ChevronDown,
    Footprints,
    Ship,
    Sparkles,
    Train,
    TramFront,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "@/lib/utils";

import { Itinerary } from "@/types/itinerary";

const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
};

const titleCase = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());

const getModeIcon = (mode: string, line?: string | null) => {
    const iconProps = { className: "h-5 w-5" };
    let icon;
    let textColor = "text-gray-500";

    switch (mode) {
        case "WALK":
            return <Footprints {...iconProps} className={textColor} />;
        case "BUS":
            icon = <Bus {...iconProps} className="text-blue-600" />;
            textColor = "text-blue-600";
            break;
        case "TRAM":
            icon = <TramFront {...iconProps} className="text-green-600" />;
            textColor = "text-green-600";
            break;
        case "SUBWAY":
            icon = <Train {...iconProps} className="text-orange-600" />;
            textColor = "text-orange-600";
            break;
        case "RAIL":
            icon = <Train {...iconProps} className="text-purple-600" />;
            textColor = "text-purple-600";
            break;
        case "FERRY":
            icon = <Ship {...iconProps} className="text-cyan-600" />;
            textColor = "text-cyan-600";
            break;
        default:
            return null;
    }

    return (
        <View className="flex flex-row items-center gap-1">
            {icon}
            {line && (
                <Text className={cn("text-xs font-semibold", textColor)}>
                    {line}
                </Text>
            )}
        </View>
    );
};

export function ItineraryCard({
    itinerary,
    isExpanded = false,
    onToggle,
}: {
    itinerary: Itinerary;
    isExpanded?: boolean;
    onToggle?: () => void;
}) {
    return (
        <View
            className={cn("transition-colors", isExpanded && "bg-gray-100/20")}
        >
            <TouchableOpacity
                className="p-4 transition-colors hover:bg-gray-100/30"
                onPress={onToggle}
            >
                <View className="flex flex-row items-start gap-4">
                    {/* Time Column */}
                    <View className="flex min-w-[80px] flex-col items-end">
                        <Text className="text-2xl font-semibold text-gray-800">
                            {itinerary.start.toISOString()}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {itinerary.end.toISOString()}
                        </Text>
                        <Text className="mt-1 text-xs text-gray-500">
                            {formatDuration(itinerary.duration)}
                        </Text>
                    </View>

                    {/* Route Details Column */}
                    <View className="flex-1 space-y-3">
                        {/* Transit Icons */}
                        <View className="flex flex-row flex-wrap items-center gap-2">
                            {itinerary.legs.map((leg, index) => (
                                <View
                                    key={index}
                                    className="flex flex-row items-center gap-1"
                                >
                                    {getModeIcon(
                                        leg.mode,
                                        leg.route?.short_name
                                    )}
                                    {index < itinerary.legs.length - 1 && (
                                        <View className="mx-1 h-px w-2 bg-gray-200" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Walk Distance */}
                        <View className="text-sm text-gray-500">
                            <Text>
                                <Footprints className="h-4 w-4 text-gray-500" />{" "}
                                {Math.round(itinerary.walk_distance)} m walk
                            </Text>
                        </View>

                        <View
                            className={cn(
                                "inline-flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
                            )}
                        >
                            <Sparkles
                                className={cn("mt-0.5 h-4 w-4 flex-shrink-0")}
                            />
                            <Text className={cn("font-medium")}>
                                The AI description here
                            </Text>
                        </View>
                    </View>

                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-gray-500 transition-transform",
                            isExpanded && "rotate-180"
                        )}
                    />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="mt-4 space-y-4 border-t border-gray-200 px-4 pb-4 pt-4">
                    <Text className="text-sm font-semibold text-gray-800">
                        Journey Details
                    </Text>

                    <View className="space-y-4">
                        {itinerary.legs.map((leg, index) => {
                            return (
                                <View key={index} className="space-y-2">
                                    {/* Leg Header */}
                                    <View className="flex flex-row items-center gap-3 rounded-lg bg-gray-100/50 p-3">
                                        {getModeIcon(
                                            leg.mode,
                                            leg.route?.short_name
                                        )}
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium">
                                                {leg.mode === "WALK"
                                                    ? `Walk ${Math.round(
                                                          leg.distance
                                                      )} m`
                                                    : `${titleCase(leg.mode)} ${
                                                          leg.route
                                                              ?.short_name || ""
                                                      }`}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {leg.from_place.name} →{" "}
                                                {leg.to_place.name} •{" "}
                                                {formatDuration(leg.duration)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}
