import React, { useState, useCallback, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import ImageUploader from "../components/ImageUploader";
import Footer from "../components/Footer";
import HamburgerMenu from "../components/HamburgerMenu";
import { ScrollView } from "react-native-gesture-handler";
import * as Updates from "expo-updates";
import * as Haptics from "expo-haptics";

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Simulate fetching data (or perform real fetching here):
    await Updates.reloadAsync();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  return (
    <View style={styles.outerContainer}>
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.navigation}>
            <TouchableOpacity style={styles.buttonStyle1}>
              <Text style={styles.buttonText1}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle1}
              onPress={async () => {
                navigation.navigate("About");
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.buttonText1}>About</Text>
            </TouchableOpacity>
            <HamburgerMenu />
            {/* {Platform.OS === "android" && (
              <TouchableOpacity onPress={onRefresh}>
                <Text>Force Refresh for inner component</Text>
              </TouchableOpacity>
            )} */}
          </View>

          <Text style={styles.mainTitle}>CamPricer</Text>
          <Text style={styles.subTitle}>
            Get Instant Camera Valuations: Upload a Photo or Use Your Phone’s
            Camera Now!
          </Text>
          <ImageUploader />
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "space-between",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  navigation: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DEE2E6",
    padding: 8,
  },
  mainTitle: {
    marginTop: 64,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#212529",
    fontFamily: "System",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6C757D",
  },
  buttonText1: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  buttonStyle1: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#009688",
    marginHorizontal: 8,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default HomeScreen;
