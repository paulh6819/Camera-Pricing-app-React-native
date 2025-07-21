import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MailComposer from "expo-mail-composer";

export default function RecentResults({ recents, convertPrice, selectedCurrency, clearRecentResults, removeRecentResult }) {
  const [showRecentResults, setShowRecentResults] = useState(true); // Default to showing results

  // Function to convert recent results to CSV format
  const generateCSV = () => {
    const headers = ["Camera", "Date", "eBay Price", "Amazon Price", "Facebook Marketplace Price", "Information"];
    const csvRows = [headers.join(",")];

    recents.forEach(recent => {
      const row = [
        `"${recent.camera || 'Unknown Camera'}"`,
        `"${new Date(recent.timestamp).toLocaleDateString()}"`,
        `"${convertPrice(recent.prices.eBay, selectedCurrency)}"`,
        `"${convertPrice(recent.prices.Amazon, selectedCurrency)}"`,
        `"${convertPrice(recent.prices.FacebookMarketplace, selectedCurrency)}"`,
        `"${recent.information || 'No information available'}"`
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  // Function to export CSV and email it
  const exportToCSV = async () => {
    try {
      if (!recents || recents.length === 0) {
        Alert.alert("No Data", "No recent results to export.");
        return;
      }

      const csvContent = generateCSV();
      const filename = `CamPricer_Results_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      // Write CSV file
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Try email first
      const isMailAvailable = await MailComposer.isAvailableAsync();
      
      if (isMailAvailable) {
        try {
          await MailComposer.composeAsync({
            subject: "CamPricer - My Camera Results",
            body: `Attached are my camera pricing results from CamPricer.\n\n📸 Generated on: ${new Date().toLocaleDateString()}\n📊 Total cameras: ${recents.length}\n\nThis CSV file contains all your recent camera evaluations with pricing data from eBay, Amazon, and Facebook Marketplace.`,
            attachments: [fileUri],
          });
          return; // Exit if email worked
        } catch (emailError) {
          console.log("Email composer failed, falling back to share:", emailError);
        }
      }

      // Fallback to sharing if email fails
      Alert.alert(
        "Email Unavailable", 
        "Email composer not available. The file will be shared through the system share sheet instead.",
        [
          {
            text: "Share File",
            onPress: () => shareFile(fileUri)
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error("Error exporting CSV:", error);
      Alert.alert("Export Error", "Failed to export results. Please try again.");
    }
  };

  // Function to send email with CSV attachment
  const sendEmail = async (fileUri, filename) => {
    try {
      await MailComposer.composeAsync({
        subject: "CamPricer - My Camera Results",
        body: `Attached are my camera pricing results from CamPricer.\n\nGenerated on: ${new Date().toLocaleDateString()}\nTotal cameras: ${recents.length}`,
        attachments: [fileUri],
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Email Error", "Failed to open email composer.");
      // Fallback to sharing
      await shareFile(fileUri);
    }
  };

  // Function to share file
  const shareFile = async (fileUri) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Sharing Not Available", "File saved to device but sharing is not available on this platform.");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Share Error", "Failed to share file.");
    }
  };

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
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeRecentResult(recent.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
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
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={exportToCSV}
            >
              <Text style={styles.exportButtonText}>📧 Export CSV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.clearRecentsButton}
              onPress={clearRecentResults}
            >
              <Text style={styles.clearRecentsButtonText}>Clear Recent Results</Text>
            </TouchableOpacity>
          </View>
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
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF4757",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 16,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    gap: 10,
  },
  exportButton: {
    backgroundColor: "#009688",
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  exportButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  clearRecentsButton: {
    backgroundColor: "#FF4757",
    flex: 1,
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