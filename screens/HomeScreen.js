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
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar", region: "United States" },
    { code: "EUR", symbol: "€", name: "Euro", region: "Europe" },
    { code: "GBP", symbol: "£", name: "British Pound", region: "United Kingdom" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", region: "Japan" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar", region: "Canada" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", region: "Australia" },
    { code: "MXN", symbol: "$", name: "Mexican Peso", region: "Mexico" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real", region: "Brazil" },
  ];

  // Convert USD price to selected currency
  const convertPrice = (usdPrice, targetCurrency) => {
    if (!usdPrice || usdPrice === "N/A" || !exchangeRates[targetCurrency])
      return "N/A";

    const priceStr = usdPrice.toString().replace(/[$,]/g, "");
    const currency = currencies.find((c) => c.code === targetCurrency);
    const rate = exchangeRates[targetCurrency];

    if (!currency || !rate) return usdPrice;

    if (priceStr.includes(" - ")) {
      const [min, max] = priceStr.split(" - ");
      const convertedMin = (parseFloat(min) * rate).toFixed(
        targetCurrency === "JPY" ? 0 : 2
      );
      const convertedMax = (parseFloat(max) * rate).toFixed(
        targetCurrency === "JPY" ? 0 : 2
      );
      return `${currency.symbol}${convertedMin} - ${currency.symbol}${convertedMax}`;
    }

    const numericPrice = parseFloat(priceStr);
    if (isNaN(numericPrice)) return usdPrice;

    const convertedPrice = (numericPrice * rate).toFixed(
      targetCurrency === "JPY" ? 0 : 2
    );
    return `${currency.symbol}${convertedPrice}`;
  };

  // Fetch exchange rates from external API
  const fetchExchangeRates = async () => {
    try {
      console.log("💱 Fetching exchange rates...");

      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const data = await response.json();

      console.log("💱 Exchange rates fetched:", data.rates);
      setExchangeRates(data.rates);
    } catch (error) {
      console.error("❌ Error fetching exchange rates:", error);
      // Fallback to approximate rates if API fails
      setExchangeRates({
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 150.0,
        CAD: 1.35,
        AUD: 1.5,
        MXN: 18.0,
        BRL: 5.0,
      });
    }
  };

  // Remove individual recent result
  const removeRecentResult = (resultId) => {
    // This function will be passed to ImageUploader which will handle the actual removal
    // since it manages the recents state
    console.log("Requesting removal of recent result:", resultId);
  };

  // Fetch exchange rates on component mount
  React.useEffect(() => {
    fetchExchangeRates();
  }, []);

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
          <ImageUploader 
            selectedCurrency={selectedCurrency}
            convertPrice={convertPrice}
          />
        </View>
        <Footer 
          navigation={navigation}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          showCurrencyDropdown={showCurrencyDropdown}
          setShowCurrencyDropdown={setShowCurrencyDropdown}
          currencies={currencies}
          exchangeRates={exchangeRates}
          setExchangeRates={setExchangeRates}
        />
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
