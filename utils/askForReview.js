import * as StoreReview from "expo-store-review";
import { Platform, Alert } from "react-native";

export async function askForReview() {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();

    if (!isAvailable) {
      console.log("Store review not available on this platform.");
      return;
    }

    const hasActioned = await StoreReview.requestReview();

    // Optional: fallback if nothing visible happens (mostly on Android)
    if (!hasActioned && Platform.OS === "android") {
      Alert.alert(
        "Enjoying the app?",
        "If you find it useful, consider leaving a review!",
        [
          {
            text: "Later",
            style: "cancel",
          },
          {
            text: "Leave a Review",
            onPress: () =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=your.app.id"
              ),
          },
        ]
      );
    }
  } catch (error) {
    console.error("Error prompting for review:", error);
  }
}
