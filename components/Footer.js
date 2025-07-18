import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";

export default function Footer({ 
  navigation, 
  selectedCurrency,
  setSelectedCurrency,
  showCurrencyDropdown,
  setShowCurrencyDropdown,
  currencies,
  exchangeRates,
  setExchangeRates
}) {
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
      <Text style={styles.footerTitle}>CamPricer AI © 2022 – 2025</Text>
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://www.gamesighter.com/camPricerPrivacyPolicy.html"
            )
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
      <View style={styles.bottomRow}>
        {/* Currency Selector - Bottom Left */}
        <View style={styles.currencyContainer}>
          <TouchableOpacity
            style={styles.currencyButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCurrencyDropdown(!showCurrencyDropdown);
            }}
          >
            <Text style={styles.currencyButtonText}>
              {currencies?.find(c => c.code === selectedCurrency)?.symbol || '$'} {selectedCurrency}
            </Text>
            <Text style={styles.currencyArrow}>
              {showCurrencyDropdown ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>
          
          {showCurrencyDropdown && (
            <>
              {/* Overlay to close dropdown when clicking outside */}
              <TouchableOpacity 
                style={styles.dropdownOverlay}
                activeOpacity={1}
                onPress={() => setShowCurrencyDropdown(false)}
              />
              <View style={styles.currencyDropdown}>
                <ScrollView style={styles.currencyList} nestedScrollEnabled={true}>
                  {currencies?.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      style={[
                        styles.currencyItem,
                        selectedCurrency === currency.code && styles.currencyItemSelected
                      ]}
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedCurrency(currency.code);
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.currencyItemText,
                        selectedCurrency === currency.code && styles.currencyItemTextSelected
                      ]}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </Text>
                      <Text style={[
                        styles.currencyRegionText,
                        selectedCurrency === currency.code && styles.currencyRegionTextSelected
                      ]}>{currency.region}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>

        {/* Social Icons - Bottom Center/Right */}
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
    position: "relative",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  currencyContainer: {
    position: "relative",
    zIndex: 1000,
    alignItems: "flex-start",
  },
  currencyButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#009688",
    borderRadius: 15,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 70,
  },
  currencyButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  currencyArrow: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  dropdownOverlay: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
  currencyDropdown: {
    position: "absolute",
    bottom: 45,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 200,
    zIndex: 1001,
  },
  currencyList: {
    maxHeight: 180,
  },
  currencyItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  currencyItemSelected: {
    backgroundColor: "#009688",
  },
  currencyItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  currencyRegionText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  currencyItemTextSelected: {
    color: "white",
  },
  currencyRegionTextSelected: {
    color: "#e0e0e0",
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
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