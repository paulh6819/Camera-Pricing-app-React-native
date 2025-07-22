import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { LoadingSymbol } from "./loadingSymbol";

export default function CameraSearchBar({
  onCameraFound,
  selectedCurrency,
  convertPrice,
  addToRecents,
}) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get current region based on selected currency
  const getCurrentRegion = () => {
    const currencies = [
      { code: "USD", symbol: "$", name: "US Dollar", region: "United States" },
      { code: "EUR", symbol: "€", name: "Euro", region: "Europe" },
      {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        region: "United Kingdom",
      },
      { code: "JPY", symbol: "¥", name: "Japanese Yen", region: "Japan" },
      { code: "CAD", symbol: "C$", name: "Canadian Dollar", region: "Canada" },
      {
        code: "AUD",
        symbol: "A$",
        name: "Australian Dollar",
        region: "Australia",
      },
      { code: "MXN", symbol: "$", name: "Mexican Peso", region: "Mexico" },
      { code: "BRL", symbol: "R$", name: "Brazilian Real", region: "Brazil" },
    ];
    const currency = currencies.find((c) => c.code === selectedCurrency);
    return currency ? currency.region : "United States";
  };

  let gameRecognitionURL = "https://www.gamesighter.com";

  // comment this below in when i am testing serverside logic
  if (Platform.OS === "android") {
    gameRecognitionURL = "http://10.0.2.2:4200";
  } else {
    gameRecognitionURL = "http://localhost:4200";
  }

  if (Constants.executionEnvironment !== "storeClient") {
    console.log(
      "this should only log in production",
      Constants.executionEnvironment
    );
    gameRecognitionURL = "https://www.gamesighter.com";
  }

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Please enter a camera name to search");
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearching(true);

    try {
      const payload = {
        cameraName: searchText.trim(),
        region: getCurrentRegion(),
        source: Platform.OS === "ios" ? "iOS" : "Android",
      };

      console.log("🔍 Searching for camera:", payload);

      const response = await fetch(
        `${gameRecognitionURL}/textCameraLookUpOpenAIAPI`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📡 Search response status:", response.status);

      if (!response.ok) {
        throw new Error(`Search failed. Status: ${response.status}`);
      }

      const json = await response.json();
      console.log("📄 Search result:", json);

      // Process the camera data similar to image upload
      processCameraSearchData(json, onCameraFound, addToRecents);

      // Clear search text after successful search
      setSearchText("");
    } catch (error) {
      console.error("❌ Error searching for camera:", error);
      Alert.alert(
        "Search Error",
        "Failed to search for camera. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Or type in camera name here"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          editable={!isSearching}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            isSearching && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Text style={styles.searchButtonText}>...</Text>
          ) : (
            <Text style={styles.magnifyingGlass}>⌕</Text>
          )}
        </TouchableOpacity>
      </View>
      {isSearching && (
        <View style={styles.loadingContainer}>
          <LoadingSymbol />
        </View>
      )}
    </View>
  );
}

// Process camera data from text search
function processCameraSearchData(cameraData, onCameraFound, addToRecents) {
  if (!cameraData) {
    console.log("⚠️ No camera data available from search");
    return;
  }

  console.log(
    "📌 Camera search data received:",
    JSON.stringify(cameraData, null, 2)
  );

  // Extract and parse the JSON from the result field
  let actualCameraData;
  try {
    // The result field contains markdown-wrapped JSON
    const resultString = cameraData.result || "";
    console.log("🔍 Raw search result string:", resultString);

    // Remove markdown code blocks
    const jsonString = resultString
      .replace(/```json\n?/g, "")
      .replace(/\n?```/g, "");
    console.log("🔍 Cleaned search JSON string:", jsonString);

    // Parse the JSON
    actualCameraData = JSON.parse(jsonString);
    console.log(
      "🔍 Parsed actual camera search data:",
      JSON.stringify(actualCameraData, null, 2)
    );
  } catch (error) {
    console.error("❌ Failed to parse camera search data:", error);
    actualCameraData = {}; // Fallback to empty object
  }

  const cameraObject = {
    title: actualCameraData.camera || "Unknown Camera",
    system: "Camera Information",
    loosePrice: actualCameraData.estimated_resale_value?.eBay || "N/A",
    cibPrice: actualCameraData.estimated_resale_value?.Amazon || "N/A",
    newPrice:
      actualCameraData.estimated_resale_value?.Facebook_Marketplace || "N/A",
    information:
      actualCameraData.camera_information?.information ||
      "No information available",
    imageUri: null, // No image for text searches
  };

  console.log(
    "🔍 Processed camera search object:",
    JSON.stringify(cameraObject, null, 2)
  );

  // Pass the camera object to the parent component
  if (onCameraFound) {
    onCameraFound(cameraObject);
  }

  // Add to recent results if function is provided
  if (addToRecents) {
    addToRecents(cameraObject);
    console.log("✅ Camera search data added to recent results");
  }

  console.log("✅ Camera search data processed");
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#009688",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 10,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#009688",
    paddingHorizontal: 10,
    // paddingVertical: 10,
    borderRadius: 20,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  magnifyingGlass: {
    fontSize: 32,
    color: "white",
  },
  loadingContainer: {
    alignItems: "flex-start",
    marginTop: 10,
    paddingLeft: 40,
  },
});
