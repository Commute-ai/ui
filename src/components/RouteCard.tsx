"use client";

import React, { useEffect, useState } from "react";

import {
    Bus,
    ChevronDown,
    Footprints,
    MessageSquare,
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

const getModeIcon = (mode: string, line?: string) => {
    switch (mode) {
        case "walk":
            return <Footprints className="h-5 w-5 text-gray-500" />;
        case "bus":
            return (
                <View className="flex flex-row items-center gap-1">
                    <Bus className="h-5 w-5 text-blue-600" />
                    {line && (
                        <Text className="text-xs font-semibold text-blue-600">
                            {line}
                        </Text>
                    )}
                </View>
            );
        case "tram":
            return (
                <View className="flex flex-row items-center gap-1">
                    <TramFront className="h-5 w-5 text-green-600" />
                    {line && (
                        <Text className="text-xs font-semibold text-green-600">
                            {line}
                        </Text>
                    )}
                </View>
            );
        case "metro":
            return (
                <View className="flex flex-row items-center gap-1">
                    <Train className="h-5 w-5 text-orange-600" />
                    {line && (
                        <Text className="text-xs font-semibold text-orange-600">
                            {line}
                        </Text>
                    )}
                </View>
            );
        default:
            return null;
    }
};

// Data-driven AI Insights
const aiInsightRules: AiInsightRule[] = [
    {
        match: (leg, index) => leg.mode === "walk" && index === 0,
        insight: {
            text: "Social media reports indicate poor road conditions on this walking path. Several users mentioned uneven sidewalks near the campus area.",
            sentiment: "warning",
            socialCount: 23,
        },
    },
    {
        match: (leg, index) => leg.mode === "bus" && leg.line === "506",
        insight: {
            text: "This bus route is usually scenic and not as crowded during this time, which fits your preferences perfectly. Great views along Mannerheimintie!",
            sentiment: "positive",
            socialCount: 47,
        },
    },
    {
        match: (leg, index) => leg.mode === "walk" && index === 2,
        insight: {
            text: "This walking route passes through the shopping district. Well-maintained sidewalks with good lighting.",
            sentiment: "neutral",
            socialCount: 12,
        },
    },
];

const getAiInsight = (
    leg: RouteLeg,
    index: number,
    routeId: number
): Insight | null => {
    if (routeId !== 1) return null; // Only show for first route as demo

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
                            {route.departureTime}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {route.arrivalTime}
                        </Text>
                        <Text className="mt-1 text-xs text-gray-500">
                            {route.duration} min
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
                                    {getModeIcon(leg.mode, leg.line)}
                                    {index < route.legs.length - 1 && (
                                        <View className="mx-1 h-px w-2 bg-gray-200" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Route Description */}
                        <View className="space-y-1 text-sm text-gray-500">
                            {route.legs.map((leg, index) => (
                                <View
                                    key={index}
                                    className="flex flex-row items-center gap-2"
                                >
                                    {leg.mode === "walk" ? (
                                        <Text>Walk {leg.distance}</Text>
                                    ) : (
                                        <Text>
                                            {leg.mode.charAt(0).toUpperCase() +
                                                leg.mode.slice(1)}{" "}
                                            {leg.line} • {leg.from} → {leg.to}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* AI Enhancement Badge */}
                        <View
                            className={cn(
                                "inline-flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                                getMatchBgColor(route.aiMatch)
                            )}
                        >
                            <Sparkles
                                className={cn(
                                    "mt-0.5 h-4 w-4 flex-shrink-0",
                                    getMatchColor(route.aiMatch)
                                )}
                            />
                            <Text
                                className={cn(
                                    "font-medium",
                                    getMatchColor(route.aiMatch)
                                )}
                            >
                                {route.aiReason}
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
                            const insight = getAiInsight(leg, index, route.id);
                            const styles = insight
                                ? sentimentStyles[insight.sentiment]
                                : null;

                            return (
                                <View key={index} className="space-y-2">
                                    {/* Leg Header */}
                                    <View className="flex flex-row items-center gap-3 rounded-lg bg-gray-100/50 p-3">
                                        {getModeIcon(leg.mode, leg.line)}
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium">
                                                {leg.mode === "walk"
                                                    ? `Walk ${leg.distance}`
                                                    : `${
                                                          leg.mode
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          leg.mode.slice(1)
                                                      } ${leg.line || ""}`}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {leg.from} → {leg.to} •{" "}
                                                {leg.duration} min
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
