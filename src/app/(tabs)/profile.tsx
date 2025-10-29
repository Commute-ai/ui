"use client";

import { useState } from "react";

import { MapPin, Plus, Settings, X } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    const [globalPreferences, setGlobalPreferences] = useState([
        "Prefer scenic routes",
        "Avoid full buses",
        "Minimize walking",
        "Prefer window seats",
    ]);
    const [newPreference, setNewPreference] = useState("");

    const routePreferences = [
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
    ];

    const handleAddPreference = () => {
        if (newPreference.trim()) {
            setGlobalPreferences([...globalPreferences, newPreference.trim()]);
            setNewPreference("");
        }
    };

    const handleRemovePreference = (index: number) => {
        setGlobalPreferences(globalPreferences.filter((_, i) => i !== index));
    };

    return (
        <main className="relative min-h-screen w-full bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 border-b border-border bg-card shadow-sm">
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-teal-500">
                            <Settings className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">
                                Route Preferences
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Customize your journey experience
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 p-4">
                {/* Global Preferences Section */}
                <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <h2 className="mb-2 text-base font-semibold text-foreground">
                        Global Preferences
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        These are preferences for all your routes. AI will use
                        these to personalize your journey recommendations.
                    </p>

                    {/* Preference Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {globalPreferences.map((pref, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-3 py-1.5 text-sm text-purple-900"
                            >
                                <span>{pref}</span>
                                <button
                                    onClick={() =>
                                        handleRemovePreference(index)
                                    }
                                    className="rounded-full p-0.5 transition-colors hover:bg-purple-200"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Preference */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a new preference..."
                            value={newPreference}
                            className="flex-1"
                        />
                        <Button
                            onPress={handleAddPreference}
                            size="icon"
                            className="flex-shrink-0 bg-purple-600 hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {/* Route-Specific Preferences */}
                <section>
                    <h2 className="mb-3 text-base font-semibold text-foreground">
                        Route-Specific Preferences
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Set custom preferences for your frequent routes
                    </p>

                    <div className="space-y-3">
                        {routePreferences.map((route) => (
                            <div
                                key={route.id}
                                className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            >
                                {/* Route Header */}
                                <div className="mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-foreground">
                                            {route.from}
                                        </span>
                                        <span className="text-muted-foreground">
                                            →
                                        </span>
                                        <span className="text-foreground">
                                            {route.to}
                                        </span>
                                    </div>
                                </div>

                                {/* Route Preferences */}
                                <div className="flex flex-wrap gap-2">
                                    {route.preferences.map((pref, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-3 py-1.5 text-sm text-teal-900"
                                        >
                                            <span>{pref}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Button for Route */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-3 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add preference for this route
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Route Button */}
                    <Button
                        variant="outline"
                        className="mt-4 w-full border-dashed bg-transparent"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add new route preference
                    </Button>
                </section>
            </div>
        </main>
    );
}
