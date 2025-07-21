import * as StoreReview from "expo-store-review";
import { Platform, Alert, Linking } from "react-native";

export async function askForReview() {
  try {
    console.log("🌟 askForReview called!");
    
    // Show a nice pre-review dialog first
    const userWantsToReview = await new Promise((resolve) => {
      Alert.alert(
        "Loving CamPricer? 📸",
        "Your app reviews really help us reach more camera enthusiasts and improve our AI recognition! Would you mind taking a moment to leave us a quick review?",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: () => resolve(false)
          },
          {
            text: "Sure! 🌟",
            onPress: () => resolve(true)
          }
        ]
      );
    });

    if (!userWantsToReview) {
      console.log("🌟 User declined to review");
      return;
    }

    const isAvailable = await StoreReview.isAvailableAsync();
    console.log("🌟 Store review available:", isAvailable);

    if (!isAvailable) {
      console.log("Store review not available on this platform.");
      return;
    }

    console.log("🌟 Requesting review...");
    const hasActioned = await StoreReview.requestReview();
    console.log("🌟 Review hasActioned:", hasActioned);

    // Debug: Always show alert for testing (iOS review might be throttled)
    if (Platform.OS === "ios" && !hasActioned) {
      console.log("🌟 iOS review was throttled or not shown, showing debug alert");
      Alert.alert(
        "Review Request (Debug)",
        "The review dialog was requested but might be throttled by iOS. This would normally show the native review popup.",
        [{ text: "OK" }]
      );
    }

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
