module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    plugins: ["react", "react-hooks", "react-native", "@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
            presets: ["@babel/preset-react"],
        },
        project: "./tsconfig.json",
    },
    env: {
        "react-native/react-native": true,
        es6: true,
        node: true,
        jest: true,
    },
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react-native/no-unused-styles": "warn",
        "react-native/no-inline-styles": "warn",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "warn", // Use TypeScript version
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
