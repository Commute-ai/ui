import { Platform } from "react-native";
import z from "zod";

const ConfigSchema = z.object({
    appVariant: z.enum(["development", "staging", "production"]),
    apiUrl: z.string().url(),
});

export type Config = z.infer<typeof ConfigSchema>;

const getEnvVars = (): Config => {
    return ConfigSchema.parse({
        appVariant: process.env.APP_VARIANT || "development",
        apiUrl:
            process.env.API_URL ||
            (Platform.OS === "web"
                ? "http://localhost:8000/api/v1"
                : "http://10.0.2.2:8000/api/v1"),
    });
};

export default getEnvVars();
