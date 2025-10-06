import React from "react";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const UserProfileHeader = ({ user, isLoading, error }) => {
    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator
                    testID="activity-indicator"
                    size="small"
                    color="#0000ff"
                />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                user && (
                    <>
                        <View style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={styles.username}>{user.username}</Text>
                            <Text style={styles.status}>Logged in</Text>
                        </View>
                    </>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f8f8f8",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        width: "100%",
        justifyContent: "center",
        minHeight: 72, // Same height as the loaded header to avoid layout shifts
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    status: {
        fontSize: 14,
        color: "green",
    },
    errorText: {
        color: "red",
        fontSize: 14,
    },
});

export default UserProfileHeader;
