import React, { useState, useEffect } from "react";
import ImageUploader from "./components/ImageUploader";
import { Text, View, Platform, StatusBar } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import * as Updates from "expo-updates";

// Import the screens
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import TermsOfServiceScreen from "./screens/TermsOfServiceScreen";

const Stack = createStackNavigator();

export default function App() {
  const [currentOffering, setCurrentOffering] = useState(null);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      // Replace with your iOS API key
      Purchases.configure({ apiKey: "YOUR_IOS_API_KEY_HERE" });
    } else if (Platform.OS === "android") {
      // Replace with your Android API key
      Purchases.configure({ apiKey: "YOUR_ANDROID_API_KEY_HERE" });
    }

    const fetchOfferings = async () => {
      try {
        console.log("entering fetch offerings");
        const offerings = await Purchases.getOfferings();
        setCurrentOffering(offerings.current);
        console.log("this is the current offerings", offerings.current);
      } catch (error) {
        console.error("RevenueCat error:", error);
      }
    };

    fetchOfferings();
  }, []);

  // Font loading
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Minecraft: require("./assets/fonts/Minecraft.ttf"),
        maisonNeueBold: require("./assets/fonts/MaisonNeue-Bold.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  // OTA Update checking
  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Only check for updates in production builds
        if (!__DEV__ && Updates.isEnabled) {
          console.log("🔄 Checking for OTA updates...");
          
          const update = await Updates.checkForUpdateAsync();
          
          if (update.isAvailable) {
            console.log("📦 Update available! Downloading...");
            await Updates.fetchUpdateAsync();
            console.log("✅ Update downloaded! Reloading app...");
            await Updates.reloadAsync();
          } else {
            console.log("✅ App is up to date!");
          }
        } else {
          console.log("🔧 Development mode - skipping update check");
        }
      } catch (error) {
        console.error("❌ Error checking for updates:", error);
      }
    }

    // Check for updates after fonts are loaded
    if (fontsLoaded) {
      checkForUpdates();
    }
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingTop: StatusBar.currentHeight + 200,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    fontFamily: "Minecraft", // Use the pixelated font (add it via custom fonts)
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    fontFamily: "maisonNeueBold",
  },
};
