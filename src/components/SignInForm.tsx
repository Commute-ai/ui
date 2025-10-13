import * as React from "react";

import { Link } from "expo-router";
import { ActivityIndicator, type TextInput, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export function SignInForm() {
    const { signIn, isLoaded } = useAuth();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [error, setError] = React.useState<{
        username?: string;
        password?: string;
    }>({});

    const passwordInputRef = React.useRef<TextInput>(null);

    async function onSubmit() {
        if (!isLoaded) {
            return;
        }
        setError({});
        setLoading(true);

        try {
            await signIn(username, password);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.toLowerCase().includes("username")) {
                    setError({ username: err.message });
                } else {
                    setError({ password: err.message });
                }
            } else {
                console.error(JSON.stringify(err, null, 2));
                setError({ password: "Sign in failed. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    }

    function onUsernameSubmitEditing() {
        passwordInputRef.current?.focus();
    }

    return (
        <View className="gap-6">
            <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
                <CardHeader>
                    <CardTitle className="text-center text-xl sm:text-left">
                        Sign in to your app
                    </CardTitle>
                    <CardDescription className="text-center sm:text-left">
                        Welcome back! Please sign in to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="gap-6">
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <View className="gap-6">
                            <View className="gap-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    testID="username-input"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    onChangeText={setUsername}
                                    value={username}
                                    onSubmitEditing={onUsernameSubmitEditing}
                                    returnKeyType="next"
                                    submitBehavior="submit"
                                />
                                {error.username ? (
                                    <Text className="text-sm font-medium text-destructive">
                                        {error.username}
                                    </Text>
                                ) : null}
                            </View>
                            <View className="gap-1.5">
                                <View className="flex-row items-center">
                                    <Label htmlFor="password">Password</Label>
                                </View>
                                <Input
                                    ref={passwordInputRef}
                                    id="password"
                                    testID="password-input"
                                    secureTextEntry
                                    onChangeText={setPassword}
                                    value={password}
                                    returnKeyType="send"
                                    onSubmitEditing={onSubmit}
                                />
                                {error.password ? (
                                    <Text className="text-sm font-medium text-destructive">
                                        {error.password}
                                    </Text>
                                ) : null}
                            </View>
                            <Button className="w-full" onPress={onSubmit}>
                                <Text>Continue</Text>
                            </Button>
                        </View>
                    )}
                    <Text className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" asChild>
                            <Text className="text-sm underline underline-offset-4">
                                Sign up
                            </Text>
                        </Link>
                    </Text>
                </CardContent>
            </Card>
        </View>
    );
}
