import React from "react";

import { Button, StyleSheet, Text, View } from "react-native";

const ProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Screen</Text>
            <Button
                title="Go to Settings"
                onPress={() => navigation.navigate("Settings")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
    },
});

export default ProfileScreen;
