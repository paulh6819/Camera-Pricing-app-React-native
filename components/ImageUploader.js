import React, { useState, useCallback } from "react";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as StoreReview from "expo-store-review";
import { askForReview } from "../utils/askForReview";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import * as Haptics from "expo-haptics";
import { LoadingSymbol } from "./loadingSymbol";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
export default function ImageUploader() {
  const [imageUri, setImageUri] = useState([]);

  const [allGames, setAllGames] = useState([]);
  const [totalUsedValue, setTotalUsedValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalNewValue, setTotalNewValue] = useState(0);
  const [totalCIBValue, setTotalCIBValue] = useState(0);
  const [useCamera, setUseCamera] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [pullCount, setPullcount] = useState(0);

  let gameRecognitionURL = "https://www.gamesighter.com";

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log("youre press the refreash buttoni");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setRefreshing(true);

    // Clear existing data/state
    setAllGames([]);
    setTotalUsedValue(0);
    setTotalNewValue(0);
    setImageUri([]);

    // Simulate fetching data (or perform real fetching here):
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Haptic feedback options
  const hapticOptions = {
    enableVibrateFallback: true, // Fallback for devices without haptic engines
    ignoreAndroidSystemSettings: false, // Use default system settings on Android
  };

  // Function to remove a game from the list and subtract its value from the total
  function removeGame(indexToRemove, loosePrice, cibPrice, newPrice) {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Trigger layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // Remove the game by filtering out the specific index
    setAllGames((prevGames) =>
      prevGames.filter((_, index) => index !== indexToRemove)
    );

    // Subtract the loosePrice from the total
    setTotalUsedValue((prevValue) => {
      if (isNaN(loosePrice)) {
        return prevValue;
      }
      return prevValue - parseFloat(loosePrice);
    });
    // Subtract the cibPrice from the total
    setTotalCIBValue((prevValue) => {
      if (isNaN(cibPrice)) {
        return prevValue;
      }
      return prevValue - parseFloat(cibPrice);
    });
    // Subtract the newPrice from the total
    setTotalNewValue((prevValue) => {
      if (isNaN(newPrice)) {
        return prevValue;
      }
      return prevValue - parseFloat(newPrice);
    });
  }

  //Main function to handle image upload
  const handlePickImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const useCamera = await showAlertWithPromise(setUseCamera);
      if (useCamera === null) return;

      let permissionGranted = false;
      let result;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Camera permission is required to take photos.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      } else {
        // ✅ First check permission
        const existingPermission =
          await ImagePicker.getMediaLibraryPermissionsAsync();

        if (existingPermission.status !== "granted") {
          const request =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (request.status !== "granted") {
            Alert.alert("We need photo access to upload your games.");
            return;
          }

          // ✅ Don't launch image picker immediately — let user tap again
          Alert.alert(
            "Photo Access Granted",
            "Tap the button again to pick your game photos. Now that you granted permission you'll only have to press the button once. Enjoy!"
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          allowsMultipleSelection: true,
          quality: 1,
        });
      }

      if (result.canceled) return;

      setLoading(true);

      console.log("Selected Image: ", result.assets[0].uri);
      const selectedImage = result.assets[0];

      // this renders all the photos that are uploaded
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImageUri((prev) => [...selectedImages, ...prev]);
      }

      console.log("made it past setImageUri");

      await uploadMultipleImages(
        result.assets,
        setLoading,

        gameRecognitionURL
      );
      setPullcount((prev) => prev + 1);
      console.log("this is the pullcount", pullCount);
      if (pullCount === 2) {
        askForReview();
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // Update `allGames` state with new games and update the total used value
  // function renderGameTitlesAndSetValueTotals(newGames, imageUriForUI) {
  //   if (!newGames || newGames.length === 0) {
  //     console.log("No games available");
  //     return;
  //   }
  //   console.log("📌 newGames received:", JSON.stringify(newGames, null, 2));

  //   const newGameObjects = newGames.map((game, index) => {
  //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Haptic feedback
  //     console.log(
  //       `🔍 Processing game ${index}:`,
  //       JSON.stringify(game, null, 2)
  //     );

  //     const pricingData =
  //       game[0]?.rows?.[0] || // Standard format
  //       game[0]?.item || // Alternative format
  //       {}; // Default to empty object if neither exist

  //     return {
  //       title: game[1] || "Unknown Title",
  //       system: game[2] || "Unknown System",
  //       loosePrice: pricingData.loose_price || "Not available",
  //       cibPrice: pricingData.cib_price || "Not available",
  //       newPrice: pricingData.new_price || "Not available",
  //     };
  //   });

  //   // Add image and its games together
  //   setUploads((prev) => [
  //     { imageKey: imageUriForUI, games: newGameObjects },
  //     ...prev,
  //   ]);

  //   // Update totals
  //   updateTotals(newGameObjects);

  //   // updateTotals(newGameObjects);

  //   // Append raw game data
  //   setAllGames((prevGames) => [...prevGames, ...newGameObjects]);

  //   //thses are the old functions that added the total value of the games
  //   // setTotalUsedValue(
  //   //   (prevValue) =>
  //   //     prevValue +
  //   //     newGameObjects.reduce((total, game) => {
  //   //       const loosePrice = parseFloat(game.loosePrice);
  //   //       return total + (isNaN(loosePrice) ? 0 : loosePrice);
  //   //     }, 0)
  //   // );
  //   // setTotalNewValue(
  //   //   (prevValue) =>
  //   //     prevValue +
  //   //     newGameObjects.reduce((total, game) => {
  //   //       const newPrice = parseFloat(game.newPrice);
  //   //       return total + (isNaN(newPrice) ? 0 : newPrice);
  //   //     }, 0)
  //   // );
  //   // setTotalCIBValue(
  //   //   (prevValue) =>
  //   //     prevValue +
  //   //     newGameObjects.reduce((total, game) => {
  //   //       const cibPrice = parseFloat(game.cibPrice);
  //   //       return total + (isNaN(cibPrice) ? 0 : cibPrice);
  //   //     }, 0)
  //   // );
  // }

  // function updateTotals(games) {
  //   setTotalUsedValue(
  //     (prev) =>
  //       prev +
  //       games.reduce(
  //         (total, game) => total + (parseFloat(game.loosePrice) || 0),
  //         0
  //       )
  //   );
  //   setTotalNewValue(
  //     (prev) =>
  //       prev +
  //       games.reduce(
  //         (total, game) => total + (parseFloat(game.newPrice) || 0),
  //         0
  //       )
  //   );
  //   setTotalCIBValue(
  //     (prev) =>
  //       prev +
  //       games.reduce(
  //         (total, game) => total + (parseFloat(game.cibPrice) || 0),
  //         0
  //       )
  //   );
  // }

  function removeUploadGame(
    uploadIndex,
    gameIndex,
    loosePrice,
    cibPrice,
    newPrice
  ) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setUploads((prevUploads) => {
      const updatedUploads = [...prevUploads];
      updatedUploads[uploadIndex].games.splice(gameIndex, 1); // Remove the game
      return updatedUploads;
    });

    // Update totals
    setTotalUsedValue((prev) => prev - (parseFloat(loosePrice) || 0));
    setTotalCIBValue((prev) => prev - (parseFloat(cibPrice) || 0));
    setTotalNewValue((prev) => prev - (parseFloat(newPrice) || 0));
  }

  return (
    <View style={styles.container}>
      {/* Reset state button -> needs to be refactored into a new component */}

      <TouchableOpacity
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          handlePickImage();
        }}
      >
        <Image
          style={styles.sightIcon}
          source={require("../assets/icons/cameraIcon.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
        <View style={styles.textContainer}>
          <Text style={styles.uploadText}>
            Upload or Take a Photo of Cameras
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.loadingSymbolContainer}>
        {loading && <LoadingSymbol />}
      </View>

      {Platform.OS === "android" && (
        <TouchableOpacity onPress={onRefresh} style={styles.clearButtonTop}>
          <Text style={styles.clearButtonText}>Clear & Refresh</Text>
        </TouchableOpacity>
      )}
      {/* {!loading &&
        imageUri.length > 0 &&
        imageUri.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.uploadImage} />
        ))} */}

      <FlatList
        data={uploads}
        keyExtractor={(item, index) => item.imageKey + index}
        contentContainerStyle={styles.flatListContainer}
        style={styles.scrollView}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={Platform.OS === "android" ? 100 : 0}
            colors={Platform.OS === "android" ? ["#009688"] : undefined}
          />
        }
        renderItem={({ item, index }) => (
          <View>
            <Image
              source={{ uri: item.imageKey }}
              style={styles.uploadImageMappedToResults}
            />

            <Animated.View
              key={`${game.title}-${gameIndex}`}
              style={styles.gameContainer}
              // entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
            >
              <TouchableOpacity
                onPress={() =>
                  removeUploadGame(
                    index,
                    gameIndex,
                    game.loosePrice,
                    game.cibPrice,
                    game.newPrice
                  )
                }
                style={styles.TouchableOpacityXButton}
              >
                <Image
                  source={require("../assets/images/xButton.jpeg")}
                  style={styles.xButton}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      />

      {allGames.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // Fully reset ALL state
            setAllGames([]);
            setUploads([]);
            setImageUri([]);
            setTotalUsedValue(0);
            setTotalNewValue(0);
            setTotalCIBValue(0);
          }}
        >
          <Text style={styles.clearButtonText}>Clear Results</Text>
        </TouchableOpacity>
      )}

      {/* {uploads.length > 0 && (
        <View style={styles.totalsContainer}>
          <Text style={styles.totals}>
            Total Used Value: ${totalUsedValue.toFixed(2)}
          </Text>
          <Text style={styles.totals}>
            Total CIB Value: ${totalCIBValue.toFixed(2)}
          </Text>
          <Text style={styles.totals}>
            Total New Value: ${totalNewValue.toFixed(2)}
          </Text>
        </View>
      )} */}
    </View>
  );
}

//traditonal css
const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadImage: {
    width: "100%",
    height: 300,
    borderRadius: 4,
    marginBottom: 16,
    marginTop: 80,

    borderWidth: 3, // Thick border to simulate pixels
    borderColor: "#000", // Black outer border for contrast
    borderStyle: "dashed", // Optional: makes the border appear segmented like pixels
    backgroundColor: "#FFF", // Add a white background to enhance contrast
  },
  uploadImageMappedToResults: {
    width: 200,
    height: 200,
    borderRadius: 4,
    marginBottom: 16,
    marginTop: 80,

    borderWidth: 3, // Thick border to simulate pixels
    borderColor: "#000", // Black outer border for contrast
    borderStyle: "dashed", // Optional: makes the border appear segmented like pixels
    backgroundColor: "#FFF", // Add a white background to enhance contrast
  },
  uploadButton: {
    width: "100%",
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#009688",
    shadowColor: "#7FFBD2", // Shadow color
    shadowOffset: { width: 5, height: 5 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
    shadowRadius: 0, // Shadow blur radius (0 for sharp shadows)
    elevation: 5, // Android shadow
  },
  gameContainer: {
    position: "relative",
    backgroundColor: "#ffffff", // Clean white background
    borderRadius: 4, // Rounded corners
    padding: 24, // Inner spacing
    marginVertical: 24, // Space between game containers

    shadowOffset: { width: 4, height: 4 }, // Shadow position
    shadowOpacity: 1, // Light shadow transparency
    shadowRadius: 0, // Blur radius for shadow
    elevation: 3, // Android shadow
    borderWidth: 1, // Thin border for structure
    borderColor: "",
    shadowColor: "#009688", // Shadow color
    width: "98%",
  },
  videoGameTitle: {
    fontSize: 24, // 1.3rem converted to px (React Native uses px by default)

    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 0,
    textAlign: "center", // Center-align the title
    position: "relative", // Position relative
    bottom: 16, // Push the title 15px down
    borderBottomWidth: 2, // Add a thin border at the bottom
    borderBottomColor: "#7FFBD2", // Border color
    paddingBottom: 8, // Padding at the bottom
  },
  gameDetail: {
    fontSize: 16,
    marginBottom: 8,
  },

  totals: {
    marginBottom: 0,
    fontSize: 20,
    fontWeight: "bold",
  },
  totalsContainer: {
    marginTop: 0,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: "#f4f4f8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 2,
  },
  totals: {
    fontSize: 16, // Slightly smaller font size to reduce emphasis
    fontWeight: "500", // Medium weight to maintain readability
    color: "#666", // Subtle gray text color
    marginBottom: 8,
    textAlign: "center", // Center-align the text for uniformity
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",

    width: "100%",
  },
  sightIcon: {
    width: 150,
    height: 150,
    marginBottom: 16,
    marginTop: 96,
    borderRadius: 4,
  },
  flatListContainer: {
    flex: 1,
    width: 300,
    paddingBottom: 100,
  },

  xButton: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },

  TouchableOpacityXButton: {
    position: "absolute",
    top: 8,
    right: 0,
  },
  clearButton: {
    top: "-52",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#FF4757",
    marginHorizontal: 10,
    alignItems: "center",
    marginBottom: "40",
    width: "98%",
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  clearButtonTop: {
    top: "60",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#FF4757",
    marginHorizontal: 10,
    alignItems: "center",
    marginBottom: "40",
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  uploadText: {
    color: "#000", // Set your desired text color
    textShadowColor: "transparent", // Removes the shadow color
    textShadowOffset: { width: 0, height: 0 }, // Removes the shadow offset
    textShadowRadius: 0, // Removes the blur radius

    shadowColor: "transparent", // Disable shadow for text container
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  uploadButtonTextWrapper: {
    shadowColor: "transparent", // Disable shadow for text container
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  uploadButton: {
    width: "90%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#009688",
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 96,
    transform: [{ scale: 1 }],
  },
  textContainer: {
    // Disable shadow specifically for the text container
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "maisonNeueBold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  loadingSymbolContainer: {
    right: "60",
  },
  scrollContent: {
    flexGrow: 1, // Allow the content to grow dynamically
  },
});

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

async function requestPermissions() {
  const { status: camStatus, canAskAgain: canAskCam } =
    await ImagePicker.getCameraPermissionsAsync();
  const { status: libStatus, canAskAgain: canAskLib } =
    await ImagePicker.getMediaLibraryPermissionsAsync();

  // Request camera permission if not granted
  let finalCamStatus = camStatus;
  if (camStatus !== "granted" && canAskCam) {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    finalCamStatus = result.status;
  }

  // Request library permission if not granted
  let finalLibStatus = libStatus;
  if (libStatus !== "granted" && canAskLib) {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    finalLibStatus = result.status;
  }

  // If still denied, show fallback
  if (finalCamStatus !== "granted" || finalLibStatus !== "granted") {
    Alert.alert(
      "Permissions Required",
      "We need access to your camera and photos. Please enable them in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  return true;
}

//these functions deal with picking the camera
const showAlertWithPromise = (setUseCamera) => {
  return new Promise((resolve) => {
    alertToUsecCameraOrPickFromAGallery((value) => {
      setUseCamera(value);
      resolve(value); // Resolves the Promise when user makes a selection
    });
  });
};

function alertToUsecCameraOrPickFromAGallery(setUseCamera) {
  Alert.alert(
    "Choose an Option", // Title
    "Would you like to take a new photo or select from your gallery?", // Message
    [
      {
        text: "Take Photo",
        onPress: () => {
          console.log("Camera Selected");
          setUseCamera(true);
        },
      },
      {
        text: "Choose from Gallery",
        onPress: () => {
          console.log("Gallery Selected");
          setUseCamera(false);
        },
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true } // User can dismiss by tapping outside
  );
}

//This is the main logic of the app
async function uploadMultipleImages(
  imagesArray,
  setLoading,

  gameRecognitionURL
) {
  const ENABLE_WEBP = false;

  setLoading(true);
  const startTime = Date.now();
  console.log(
    `📦 Upload started at ${new Date(startTime).toLocaleTimeString()}`
  );

  try {
    // Create an array of fetch promises, one per image

    // ✅ CHANGED: use sequential logic instead of Promise.all
    const combinedResults = [];

    // const fetchPromises = imagesArray.map(async (image, index) => {
    for (let index = 0; index < imagesArray.length; index++) {
      const image = imagesArray[index];
      const formData = new FormData();
      const platformSource = Platform.OS === "ios" ? "iOS" : "Android";
      // if (platformSource === "Android") {
      //   await fetch("https://gamesighter.com/detectLabels");
      // }

      //this below is only for android. its whats being sent to the server because of formdata quirks

      // Read the image file as a Base64 string
      // Read the image file as a Base64 string

      // Read the WebP file as a Base64 string
      // Now that finalUri is set correctly (JPEG or WebP), read it:

      // const dataString = `image=${encodeURIComponent(
      //   base64Image
      // )}&type=${encodeURIComponent(
      //   image.type || "image/jpeg"
      // )}&name=${encodeURIComponent(
      //   image.fileName || "uploaded_image.jpg"
      // )}&source=${encodeURIComponent(platformSource)}`;

      //json android

      //
      // Convert to WebP for faster upload
      const originalUri = image.uri;
      let finalUri = originalUri;
      let finalType = image.type || "image/jpeg";
      let finalName = image.fileName || `uploaded_image_${index}.jpg`;

      if (ENABLE_WEBP) {
        const webp = await ImageManipulator.manipulateAsync(image.uri, [], {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.WEBP,
        });
        finalUri = webp.uri;
        finalType = "image/webp";
        finalName = `uploaded_image_${index}.webp`;
      }

      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      const base64Image = await FileSystem.readAsStringAsync(finalUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const payload = {
        image: base64Image,
        type: image.type || "image/jpeg",
        name: image.fileName || "uploaded_image.jpg",
        source: platformSource,
      };

      if (!fileInfo.exists) {
        throw new Error(`File does not exist at URI: ${image.uri}`);
      }

      if (fileInfo.size === 0) {
        throw new Error(`File is empty at URI: ${image.uri}`);
      }

      formData.append("image", {
        uri: finalUri,
        type: finalType,
        name: finalName,
      });
      formData.append("source", platformSource);

      for (let pair of formData.entries()) {
        console.log("🧾 FormData entry:", pair[0], pair[1]);
      }

      //comment this bewlow in when i am testing serverside logic
      if (Platform.OS === "android") {
        gameRecognitionURL = "http://10.0.2.2:4200";
      } else {
        gameRecognitionURL = "http://localhost:4200";
      }

      //
      const response = await fetch(`${gameRecognitionURL}/identifyCamera`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: Platform.OS === "ios" ? formData : JSON.stringify(payload),
      });

      console.log("📡 Raw response:", response);
      console.log("📊 Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to upload image ${index}. Status: ${response.status}`
        );
      }

      const json = await response.json();
      console.log("📄 Parsed JSON:", json);
      // combinedResults.push(...(json.result || [])); // ⬅️ collect data here

      const currentSingleResultFromServer = json.result || [];
      console.log("🎯 Result data:", currentSingleResultFromServer);
    }
  } catch (error) {
    console.error(
      "Error message for uploading multiple images for new function:",
      error.message
    );
    console.error("full error object", error);
    console.warn(
      `🔗 Failed fetch to: https://www.gamesighter.com/detectLabels`
    );
    console.warn(`🧾 Response status: ${error.response?.status || "Unknown"}`);
    const text = await response.text();
    console.warn("🧾 Response body:", text);
  } finally {
    setLoading(false);
    const endTime = Date.now();
    const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(
      `✅ Upload finished at ${new Date(endTime).toLocaleTimeString()}`
    );
    console.log(`⏱️ Total time: ${durationSeconds} seconds`);
  }
}
