import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

export default function DiscordInviteModal({ visible, onClose }) {
  const handleJoinDiscord = () => {
    Linking.openURL("https://discord.gg/UwdGqeYZ");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Join Our Community! 🎉</Text>
          
          <View style={styles.contentSection}>
            <Text style={styles.discordTitle}>💬 Discord Community</Text>
            <Text style={styles.discordDescription}>
              • Share feedback and feature requests{'\n'}
              • Get help with camera identification{'\n'}
              • Connect with other camera enthusiasts{'\n'}
              • Be the first to know about new features
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinDiscord}
            >
              <Text style={styles.joinButtonText}>Join Discord</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.laterButton}
              onPress={onClose}
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: "90%",
    width: "85%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  contentSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#5865F2", // Discord brand color
  },
  discordTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  discordDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
  },
  buttonContainer: {
    gap: 12,
  },
  joinButton: {
    backgroundColor: "#5865F2", // Discord brand color
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: "#5865F2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  laterButton: {
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#009688",
  },
  laterButtonText: {
    color: "#009688",
    fontSize: 16,
    fontWeight: "600",
  },
});