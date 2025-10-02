import Constants from "expo-constants";
import { Platform } from "react-native";

const ENV = {
    developmentWeb: {
        apiUrl: "http://localhost:8000/api/v1",
    },
    developmentAndroid: {
        apiUrl: "http://10.0.2.2:8000/api/v1",
    },
    staging: {
        apiUrl: "https://backend.staging.commute.ai.ender.fi/api/v1",
    },
    production: {
        apiUrl: "https://backend.commute.ai.ender.fi/api/v1",
    },
};

/**
 * Get environment configuration based on the EAS Update channel.
 *
 * @returns {Object} Environment configuration containing apiUrl
 */
const getEnvVars = () => {
    // Get the update channel from EAS Update
    const channel = Constants.expoConfig?.updates?.channel;

    if (channel === "preview" || channel === "staging") {
        return ENV.staging;
    } else if (channel === "production") {
        return ENV.production;
    }

    // Local development - check platform
    if (Platform.OS === "web") {
        return ENV.developmentWeb;
    } else if (Platform.OS === "android") {
        return ENV.developmentAndroid;
    } else if (Platform.OS === "ios") {
        return ENV.developmentIOS;
    }

    // Default to development when no channel is set (local development)
    return ENV.developmentWeb;
};

export default getEnvVars();
