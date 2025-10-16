import { Alert, Platform } from "react-native";

export function showAlert(title: string, message: string) {
    if (Platform.OS === "web") {
        alert(`${title}\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}
