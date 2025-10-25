"use client";

import React, { useEffect, useState } from "react";

import {
    Bus,
    ChevronDown,
    Footprints,
    MessageSquare,
    Ship,
    Sparkles,
    Train,
    TramFront,
    Users,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "@/lib/utils";

import { type Route, type RouteLeg } from "@/types/routes";

// Interfaces and Types
interface RouteCardProps {
    route: Route;
    isExpanded?: boolean;
    onToggle?: () => void;
}

type Sentiment = "warning" | "positive" | "neutral";

interface Insight {
    text: string;
    sentiment: Sentiment;
    socialCount: number;
}

interface AiInsightRule {
    match: (leg: RouteLeg, index: number) => boolean;
    insight: Insight;
}

// Helper Functions
const formatTime = (isoString: string) => {
    try {
        return new Date(isoString).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) {
        return "N/A";
    }
};

const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
};

const titleCase = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());

// Style and Icon Helpers
const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600";
    if (match >= 75) return "text-blue-600";
    return "text-amber-600";
};

const getMatchBgColor = (match: number) => {
    if (match >= 90) return "bg-green-50 border-green-200";
    if (match >= 75) return "bg-blue-50 border-blue-200";
    return "bg-amber-50 border-amber-200";
};

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

// Data-driven AI Insights (Mocked)
const aiInsightRules: AiInsightRule[] = [
    {
        match: (leg, index) => leg.mode === "WALK" && index === 0,
        insight: {
            text: "Social media reports indicate poor road conditions on this walking path. Several users mentioned uneven sidewalks near the campus area.",
            sentiment: "warning",
            socialCount: 23,
        },
    },
    {
        match: (leg) => leg.mode === "BUS" && leg.route?.short_name === "506",
        insight: {
            text: "This bus route is usually scenic and not as crowded during this time, which fits your preferences perfectly. Great views along Mannerheimintie!",
            sentiment: "positive",
            socialCount: 47,
        },
    },
    {
        match: (leg, index) => leg.mode === "WALK" && index > 0,
        insight: {
            text: "This walking route passes through a quiet park. Well-maintained paths with good lighting.",
            sentiment: "neutral",
            socialCount: 12,
        },
    },
];

const getAiInsight = (leg: RouteLeg, index: number): Insight | null => {
    // Mock: For demonstration, only show insights on some routes.
    const shouldShow = leg.duration > 120; // e.g. only on legs longer than 2 mins
    if (!shouldShow) return null;

    const foundRule = aiInsightRules.find((rule) => rule.match(leg, index));
    return foundRule ? foundRule.insight : null;
};

const sentimentStyles: Record<
    Sentiment,
    { container: string; sparkles: string; text: string }
> = {
    warning: {
        container: "bg-amber-50 border-amber-200",
        sparkles: "text-amber-600",
        text: "text-amber-900",
    },
    positive: {
        container: "bg-green-50 border-green-200",
        sparkles: "text-green-600",
        text: "text-green-900",
    },
    neutral: {
        container: "bg-blue-50 border-blue-200",
        sparkles: "text-blue-600",
        text: "text-blue-900",
    },
};

// Components
export function RouteCard({
    route,
    isExpanded = false,
    onToggle,
}: RouteCardProps) {
    const [showAiInsights, setShowAiInsights] = useState(false);

    // Mock AI data that would have come from the route object
    const mockAiData = {
        aiMatch: 85,
        aiReason:
            "This route is a good balance of speed and comfort based on your preferences.",
    };

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => {
                setShowAiInsights(true);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setShowAiInsights(false);
        }
    }, [isExpanded]);

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
                            {formatTime(route.start)}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {formatTime(route.end)}
                        </Text>
                        <Text className="mt-1 text-xs text-gray-500">
                            {formatDuration(route.duration)}
                        </Text>
                    </View>

                    {/* Route Details Column */}
                    <View className="flex-1 space-y-3">
                        {/* Transit Icons */}
                        <View className="flex flex-row flex-wrap items-center gap-2">
                            {route.legs.map((leg, index) => (
                                <View
                                    key={index}
                                    className="flex flex-row items-center gap-1"
                                >
                                    {getModeIcon(
                                        leg.mode,
                                        leg.route?.short_name
                                    )}
                                    {index < route.legs.length - 1 && (
                                        <View className="mx-1 h-px w-2 bg-gray-200" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Walk Distance */}
                        <View className="text-sm text-gray-500">
                            <Text>
                                <Footprints className="h-4 w-4 text-gray-500" />{" "}
                                {Math.round(route.walk_distance)} m walk
                            </Text>
                        </View>

                        {/* AI Enhancement Badge (Mocked) */}
                        <View
                            className={cn(
                                "inline-flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                                getMatchBgColor(mockAiData.aiMatch)
                            )}
                        >
                            <Sparkles
                                className={cn(
                                    "mt-0.5 h-4 w-4 flex-shrink-0",
                                    getMatchColor(mockAiData.aiMatch)
                                )}
                            />
                            <Text
                                className={cn(
                                    "font-medium",
                                    getMatchColor(mockAiData.aiMatch)
                                )}
                            >
                                {mockAiData.aiReason}
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

                    {/* Journey Legs with AI Insights */}
                    <View className="space-y-4">
                        {route.legs.map((leg, index) => {
                            const insight = getAiInsight(leg, index);
                            const styles =
                                insight && sentimentStyles[insight.sentiment];

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

                                    {/* AI Insight */}
                                    {insight && styles && (
                                        <View className="ml-8">
                                            {!showAiInsights ? (
                                                <View className="animate-pulse space-y-2">
                                                    <View className="h-3 w-3/4 rounded bg-gray-200"></View>
                                                    <View className="h-3 w-full rounded bg-gray-200"></View>
                                                    <View className="h-3 w-2/3 rounded bg-gray-200"></View>
                                                </View>
                                            ) : (
                                                <View
                                                    className={cn(
                                                        "space-y-2 rounded-lg border p-3 text-sm",
                                                        styles.container
                                                    )}
                                                >
                                                    <View className="flex flex-row items-start gap-2">
                                                        <Sparkles
                                                            className={cn(
                                                                "mt-0.5 h-4 w-4 flex-shrink-0",
                                                                styles.sparkles
                                                            )}
                                                        />
                                                        <Text
                                                            className={cn(
                                                                "text-sm",
                                                                styles.text
                                                            )}
                                                        >
                                                            {insight.text}
                                                        </Text>
                                                    </View>

                                                    {/* Social Media Stats */}
                                                    <View className="flex flex-row items-center gap-4 pt-1 text-xs text-gray-500">
                                                        <View className="flex flex-row items-center gap-1">
                                                            <MessageSquare className="h-3 w-3" />
                                                            <Text>
                                                                {
                                                                    insight.socialCount
                                                                }{" "}
                                                                mentions
                                                            </Text>
                                                        </View>
                                                        <View className="flex flex-row items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            <Text>
                                                                Community
                                                                feedback
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}
