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
          programming, design, and reselling. To make our tasks more fun, we
          decided to design an app that uses the latest AI modeling and Optical
          Character Recognition (OCR) technology to create algorithms for
          recognizing and pricing video games.
        </Text>

        <Text style={styles.subTitle}>The Game Pricing Data</Text>
        <Text style={[styles.paragraph, styles.prominent]}>
          The data for pricing the video games is based on the industry
          standard, <Text style={styles.bold}>Pricecharting</Text>, and is
          extremely reliable for what you can expect to get after shipping and
          handling on sites like <Text style={styles.bold}>eBay</Text>.
        </Text>

        <Text style={styles.subTitle}>How We Use It</Text>
        <Text style={styles.paragraph}>
          At the moment, this app is <Text style={styles.bold}>free</Text>, and
          we use it ourselves to find and buy video games. Here’s how we use it:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • We go into thrift shops and video game shops, take photos of video
            games, and quickly get a price estimate.
          </Text>
          <Text style={styles.listItem}>
            • Another way is by dragging and dropping photos from{" "}
            <Text style={styles.bold}>Facebook Marketplace</Text> into the app
            to quickly get a price for each game in an entire shelf or stack in
            seconds.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          Both methods help us make over{" "}
          <Text style={styles.bold}>$50 an hour</Text>, and they will for you,
          too! This more than makes up for the small fee that we plan to charge
          soon to cover our costs.
        </Text>

        <Text style={styles.subTitle}>Interested in Custom Software?</Text>
        <Text style={styles.paragraph}>
          Video game shops are very interested in our product. If you own a
          shop,{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@gamesighter.com")}
          >
            reach out
          </Text>
          , and perhaps we can build custom software just for you.
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
    color: "#4724F5",
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
    color: "#4724F5",
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
    color: "#4724F5",
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
