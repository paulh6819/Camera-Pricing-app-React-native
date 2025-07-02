import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Footer({ navigation }) {
  const iconSize = 16;
  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Cannot open URL: ${url}`);
    }
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>CamPricer AI © 2022 – 2025</Text>
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.gamesighter.com/privacyPolicy.html")
          }
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => handleLinkPress("/designRationale.html")}
        >
          <Text style={styles.linkText}>Design Rationale</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate("TermsOfService")}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity
          onPress={() =>
            handleLinkPress("https://www.instagram.com/hendos_photos/")
          }
        >
          <Icon name="instagram" size={iconSize} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleLinkPress(
              "https://www.linkedin.com/in/paul-henderson-548747141/"
            )
          }
        >
          <Icon name="linkedin" size={iconSize} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("https://github.com/paulh6819")}
        >
          <Icon name="github" size={iconSize} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
    marginBottom: 0,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 15,
    color: "#009688",
    marginHorizontal: 12,
    fontWeight: "500",
    paddingVertical: 10,
    paddingHorizontal: 8,
    letterSpacing: 0.3,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  socialIcon: {
    width: 44,
    height: 44,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#6B7280",
    borderRadius: 22,
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    shadowColor: "#6B7280",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
