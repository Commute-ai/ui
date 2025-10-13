import { Platform } from "react-native";

const IS_DEVELOPMENT = process.env.APP_VARIANT === "development";
const IS_STAGING = process.env.APP_VARIANT === "staging";
const IS_PRODUCTION = process.env.APP_VARIANT === "production";

const ENV = {
    development: {
        web: {
            apiUrl: "http://localhost:8000/api/v1",
        },
        android: {
            apiUrl: "http://10.0.2.2:8000/api/v1",
        },
    },
    staging: {
        apiUrl: "https://backend.staging.commute.ai.ender.fi/api/v1",
    },
    production: {
        apiUrl: "https://backend.commute.ai.ender.fi/api/v1",
    },
};

const getEnvVars = (): { apiUrl: string } => {
    if (IS_STAGING) {
        return ENV.staging;
    }

    if (IS_PRODUCTION) {
        return ENV.production;
    }

    if (IS_DEVELOPMENT) {
        if (Platform.OS === "android") {
            return ENV.development.android;
        }
        return ENV.development.web;
    }

    throw new Error("No APP_VARIANT set in environment variables");
};

export default getEnvVars();
