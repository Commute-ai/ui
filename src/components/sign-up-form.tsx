import * as React from "react";

import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { ActivityIndicator, TextInput, View } from "react-native";

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

export function SignUpForm() {
    const { signUp, isLoaded } = useSignUp();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [loading, setLoading] = React.useState(false);

    const passwordInputRef = React.useRef<TextInput>(null);

    const [error, setError] = React.useState<{
        username?: string;
        password?: string;
    }>({});

    async function onSubmit() {
        if (!isLoaded) return;

        setLoading(true);

        try {
            await signUp.create({
                username: username,
                password,
            });
        } catch (err) {
            // See https://go.clerk.com/mRUDrIe for more info on error handling
            if (err instanceof Error) {
                const isUsernameMessage =
                    err.message.toLowerCase().includes("identifier") ||
                    err.message.toLowerCase().includes("username");
                setError(
                    isUsernameMessage
                        ? {
                              username: err.message
                                  .replace("identifier", "username")
                                  .replace("Identifier", "Username"),
                          }
                        : { password: err.message }
                );
            } else {
                console.error(JSON.stringify(err, null, 2));
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
                        Create your account
                    </CardTitle>
                    <CardDescription className="text-center sm:text-left">
                        Welcome! Please fill in the details to get started.
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
                                    placeholder="Please enter a username"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    onChangeText={setUsername}
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
                                    secureTextEntry
                                    onChangeText={setPassword}
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
                        Already have an account?{" "}
                        <Link href="/login" asChild>
                            <Text className="text-sm underline underline-offset-4">
                                Sign in
                            </Text>
                        </Link>
                    </Text>
                </CardContent>
            </Card>
        </View>
    );
}
