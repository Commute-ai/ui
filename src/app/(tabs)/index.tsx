import { useContext } from "react";

import { Text, View } from "react-native";

import { RouteForm } from "@/components/RouteForm";

import { AuthContext } from "@/context/AuthContext";

export default function Home() {
    const auth = useContext(AuthContext);

    return (
        <View className="flex-1 items-center justify-center">
            {auth?.user ? (
                <Text className="mb-4 text-lg">
                    Hello, {auth.user.username}!
                </Text>
            ) : (
                <Text className="mb-4 text-lg">Hello!</Text>
            )}
            <Text className="mb-4 text-2xl font-bold">Plan a new route</Text>
            <RouteForm />
        </View>
    );
}
