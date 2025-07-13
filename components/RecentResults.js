import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function RecentResults({ recents, convertPrice, selectedCurrency, clearRecentResults }) {
  const [showRecentResults, setShowRecentResults] = useState(true); // Default to showing results

  if (!recents || recents.length === 0) {
    return null; // Don't render anything if no recent results
  }

  return (
    <View style={styles.recentResultsContainer}>
      <TouchableOpacity
        style={styles.recentResultsHeader}
        onPress={() => setShowRecentResults(!showRecentResults)}
      >
        <Text style={styles.recentResultsTitle}>
          Recent Results ({recents.length})
        </Text>
        <Text style={styles.recentResultsArrow}>
          {showRecentResults ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      
      {showRecentResults && (
        <ScrollView style={styles.recentResultsList} nestedScrollEnabled={true}>
          {recents.slice(0, 5).map((recent) => (
            <View key={recent.id} style={styles.recentResultItem}>
              <Text style={styles.recentCameraName}>{recent.camera}</Text>
              <Text style={styles.recentTimestamp}>
                {new Date(recent.timestamp).toLocaleDateString()}
              </Text>
              <View style={styles.recentPrices}>
                <Text style={styles.recentPrice}>
                  eBay: {convertPrice(recent.prices.eBay, selectedCurrency)}
                </Text>
                <Text style={styles.recentPrice}>
                  Amazon: {convertPrice(recent.prices.Amazon, selectedCurrency)}
                </Text>
                <Text style={styles.recentPrice}>
                  FB: {convertPrice(recent.prices.FacebookMarketplace, selectedCurrency)}
                </Text>
              </View>
            </View>
          ))}
          
          {recents.length > 5 && (
            <Text style={styles.moreResultsText}>
              +{recents.length - 5} more results stored
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.clearRecentsButton}
            onPress={clearRecentResults}
          >
            <Text style={styles.clearRecentsButtonText}>Clear Recent Results</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recentResultsContainer: {
    width: "90%",
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    maxHeight: 300,
  },
  recentResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#009688",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  recentResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  recentResultsArrow: {
    fontSize: 12,
    color: "white",
  },
  recentResultsList: {
    maxHeight: 200,
  },
  recentResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    backgroundColor: "white",
  },
  recentCameraName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recentTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  recentPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  recentPrice: {
    fontSize: 12,
    color: "#333",
    marginRight: 10,
  },
  moreResultsText: {
    textAlign: "center",
    padding: 10,
    color: "#666",
    fontStyle: "italic",
    fontSize: 12,
  },
  clearRecentsButton: {
    backgroundColor: "#FF4757",
    margin: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  clearRecentsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});