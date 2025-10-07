module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:react/recommended"],
    plugins: ["react", "react-hooks", "react-native"],
    parser: "@babel/eslint-parser",
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
        "no-unused-vars": "warn",
        "no-console": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
