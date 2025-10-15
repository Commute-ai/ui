import { View, Text } from "react-native";
import { RouteForm } from "@/components/RouteForm";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {
    const auth = useContext(AuthContext);

    return (
        <View className="flex-1 items-center justify-center">
            {auth?.user ? (
                <Text className="text-lg mb-4">Hello, {auth.user.username}!</Text>
            ) : (
                <Text className="text-lg mb-4">Hello!</Text>
            )}
            <Text className="text-2xl font-bold mb-4">Plan a new route</Text>
            <RouteForm />
        </View>
    );
}
