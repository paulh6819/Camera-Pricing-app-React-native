import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function CameraModeHelpModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Camera Mode Guide</Text>
          
          <View style={styles.modeSection}>
            <Text style={styles.modeTitle}>📷 Multiple Camera Mode</Text>
            <Text style={styles.modeDescription}>
              • Each photo is analyzed separately{'\n'}
              • Get individual results for each camera{'\n'}
              • Best for different camera models{'\n'}
              • Default mode
            </Text>
          </View>

          <View style={styles.modeSection}>
            <Text style={styles.modeTitle}>🎯 Single Camera Mode</Text>
            <Text style={styles.modeDescription}>
              • All photos sent together as one "batch"{'\n'}
              • AI analyzes multiple angles of the same camera{'\n'}
              • More accurate identification{'\n'}
              • Best for one camera from different angles
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Got it!</Text>
          </TouchableOpacity>
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
  modeSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#009688",
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  modeDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#009688",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#009688",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});