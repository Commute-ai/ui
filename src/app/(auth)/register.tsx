import { useState } from "react";

import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        setError("");

        if (!username || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await register(username, password);
            Alert.alert("Success", "Registration successful! Please log in.");
            router.replace("/login");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-1 items-center justify-center p-6"
            keyboardDismissMode="interactive"
        >
            <View className="w-full max-w-sm">
                <View className="mb-8 items-center">
                    <Text className="text-3xl font-bold">Create Account</Text>
                    <Text className="mt-2 text-center text-muted-foreground">
                        Sign up to get started
                    </Text>
                </View>

                <View className="gap-4">
                    <View>
                        <Text className="mb-2 text-sm font-medium">
                            Username
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            testID="usernameInput"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 text-sm font-medium">
                            Password
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            testID="passwordInput"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 text-sm font-medium">
                            Confirm Password
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            testID="confirmPasswordInput"
                        />
                    </View>

                    {error ? (
                        <Text
                            className="text-center text-sm text-destructive"
                            testID="errorMessage"
                        >
                            {error}
                        </Text>
                    ) : null}

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            testID="loadingIndicator"
                        />
                    ) : (
                        <Button onPress={handleRegister} className="w-full">
                            <Text>Register</Text>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onPress={() => router.replace("/login")}
                        className="w-full"
                    >
                        <Text>Back to Login</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 48,
        borderColor: "#e5e5e5",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#ffffff",
    },
});
