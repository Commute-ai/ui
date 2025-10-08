import React from "react";

import { useNavigation } from "@react-navigation/native";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const UserProfileHeader = ({ user, isLoading, error }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.touchable}
        >
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
                            <View testID="avatar" style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={styles.username}>
                                    {user.username}
                                </Text>
                                <Text style={styles.status}>Logged in</Text>
                            </View>
                        </>
                    )
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginRight: 15,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    userInfo: {},
    username: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
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
