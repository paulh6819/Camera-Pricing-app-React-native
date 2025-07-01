import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import Footer from "../components/Footer";

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}></View>

      {/* About Section */}
      <View style={styles.content}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.paragraph}>
          Our app was developed by two small-time indie devs and designers,{" "}
          <Text style={styles.bold}>Paul</Text> and{" "}
          <Text style={styles.bold}>Kenson</Text>, who share a passion for
          programming, design, and vintage camera collecting. To make our thrifting adventures more efficient, we
          decided to design an app that uses the latest AI modeling and Optical
          Character Recognition (OCR) technology to create algorithms for
          recognizing and pricing vintage cameras and photography equipment.
        </Text>

        <Text style={styles.subTitle}>The Camera Pricing Data</Text>
        <Text style={[styles.paragraph, styles.prominent]}>
          The data for pricing vintage cameras is sourced from multiple reliable platforms including
          <Text style={styles.bold}> KEH Camera</Text>, <Text style={styles.bold}>B&H Photo</Text>, and current
          <Text style={styles.bold}> eBay</Text> sold listings, giving you accurate market values for
          film cameras, digital cameras, and vintage photography equipment.
        </Text>

        <Text style={styles.subTitle}>How We Use It</Text>
        <Text style={styles.paragraph}>
          At the moment, this app is <Text style={styles.bold}>free</Text>, and
          we use it ourselves to hunt for vintage cameras and photography gear. Here’s how we use it:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • We visit thrift stores, estate sales, and camera shops, snap photos of vintage cameras,
            and instantly get accurate pricing estimates to make smart purchasing decisions.
          </Text>
          <Text style={styles.listItem}>
            • We also use it with photos from{" "}
            <Text style={styles.bold}>Facebook Marketplace</Text>, <Text style={styles.bold}>Craigslist</Text>, and{" "}
            <Text style={styles.bold}>eBay</Text> listings
            to quickly evaluate entire camera collections and identify underpriced gems.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          This systematic approach has helped us discover incredible deals on{" "}
          <Text style={styles.bold}>Leicas, Hasselblads, Nikons</Text>, and other sought-after vintage cameras,
          often turning our thrifting hobby into a profitable side business!
        </Text>

        <Text style={styles.subTitle}>Interested in Custom Software?</Text>
        <Text style={styles.paragraph}>
          Camera shops and photography equipment dealers are very interested in our technology. If you own a
          camera store or deal in vintage photography equipment,{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@campricer.com")}
          >
            reach out
          </Text>
          , and perhaps we can build custom pricing software tailored to your inventory needs.
        </Text>
      </View>

      {/* Footer Section */}
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navLink: {
    fontSize: 16,
    color: "#009688",
    textDecorationLine: "underline",
  },
  content: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  prominent: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    color: "#009688",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  footerLink: {
    color: "#009688",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  socialIcon: {
    fontSize: 18,
    marginHorizontal: 10,
  },
});
