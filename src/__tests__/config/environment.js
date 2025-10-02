// Mock expo-constants with getter/setter for dynamic channel values
const mockExpoConfig = {
    updates: {
        channel: null,
    },
};

jest.mock("expo-constants", () => ({
    get expoConfig() {
        return mockExpoConfig;
    },
}));

// Mock react-native's Platform and NativeModules
jest.mock("react-native", () => {
    const RN = jest.requireActual("react-native");
    
    // Ensure NativeModules exists
    if (!RN.NativeModules) {
        RN.NativeModules = {};
    }
    
    // Mock DevMenu
    RN.NativeModules.DevMenu = {
        show: jest.fn(),
        reload: jest.fn(),
    };
    
    // Mock SettingsManager
    RN.NativeModules.SettingsManager = {
        settings: {
            AppleLocale: "en-US",
            AppleLanguages: ["en-US"],
        },
        getConstants: () => ({
            settings: RN.NativeModules.SettingsManager.settings,
        }),
    };

    return {
        ...RN,
        Platform: {
            OS: "web",
            select: jest.fn((obj) => obj.web || obj.default),
        },
        // Mock TurboModuleRegistry if needed
        TurboModuleRegistry: {
            getEnforcing: jest.fn((name) => {
                if (name === 'DevMenu') {
                    return RN.NativeModules.DevMenu;
                }
                return null;
            }),
        },
    };
});

describe("Environment Configuration", () => {
    beforeEach(() => {
        // Reset the mock config
        mockExpoConfig.updates.channel = null;
        // Clear module cache to allow re-import with different mock values
        jest.resetModules();
    });

    it("returns development config when channel is development", () => {
        mockExpoConfig.updates.channel = "development";
        // Re-import the module to get fresh evaluation
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe("http://localhost:8000/api/v1");
        });
    });

    it("returns staging config when channel is staging", () => {
        mockExpoConfig.updates.channel = "staging";
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe(
                "https://backend.staging.commute.ai.ender.fi/api/v1"
            );
        });
    });

    it("returns staging config when channel is preview", () => {
        mockExpoConfig.updates.channel = "preview";
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe(
                "https://backend.staging.commute.ai.ender.fi/api/v1"
            );
        });
    });

    it("returns production config when channel is production", () => {
        mockExpoConfig.updates.channel = "production";
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe(
                "https://backend.commute.ai.ender.fi/api/v1"
            );
        });
    });

    it("returns development config when channel is not set (local development)", () => {
        mockExpoConfig.updates.channel = null;
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe("http://localhost:8000/api/v1");
        });
    });

    it("returns development config when channel is undefined", () => {
        mockExpoConfig.updates.channel = undefined;
        jest.isolateModules(() => {
            const config = require("../../config/environment").default;
            expect(config.apiUrl).toBe("http://localhost:8000/api/v1");
        });
    });
});
