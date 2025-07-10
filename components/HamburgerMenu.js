import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";

export default function HamburgerMenu() {
  const [showMenu, setShowMenu] = useState(false);

  const handleSubscribePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMenu(false);
    
    // Placeholder for RevenueCat integration next week
    Alert.alert(
      "Subscribe",
      "RevenueCat subscription integration coming next week! 🚀",
      [{ text: "OK", style: "default" }]
    );
    
    console.log("🔥 Subscribe pressed - RevenueCat integration coming next week");
  };

  const toggleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(!showMenu);
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Button */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleSubscribePress}>
            <Text style={styles.subscribeText}>🔥 Subscribe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowMenu(false);
            }}
          >
            <Text style={styles.menuItemText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
    marginLeft: 8,
    marginTop: 3,
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#009688",
    borderWidth: 2,
    borderColor: "#7FFBD2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  hamburgerIcon: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  dropdownMenu: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#009688",
  },
  menuItemText: {
    fontSize: 14,
    color: "#333",
  },
});