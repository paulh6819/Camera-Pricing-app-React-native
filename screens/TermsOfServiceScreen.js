import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.effectiveDate}>
          <Text style={styles.bold}>Effective Date:</Text> January 1, 2025
        </Text>

        <Section title="Introduction">
          Welcome to CamPricer AI! By using our services, you agree to the
          following terms and conditions. Please read them carefully.
        </Section>

        <Section title="Eligibility">
          To use our services, you must be at least 18 years old or have
          parental consent if younger. By accessing or using our app, you
          represent and warrant that you meet these requirements.
        </Section>

        <Section title="User Responsibilities">
          When using CamPricer AI, you agree to:
          <Text>
            {"\n"}• Provide accurate information when creating an account.
          </Text>
          <Text>{"\n"}• Keep your login credentials secure.</Text>
          <Text>{"\n"}• Not use the service for illegal activities.</Text>
          <Text>
            {"\n"}• Respect the intellectual property rights of others.
          </Text>
        </Section>

        <Section title="Content Ownership">
          All content created by CamPricer AI, including code, designs, and
          branding, remains the property of Paul and Kenson. You may not copy or
          reproduce this content without permission.
        </Section>

        <Section title="Usage Restrictions">
          You agree not to misuse our services, including but not limited to
          spamming, hacking, or exploiting vulnerabilities.
        </Section>

        <Section title="Termination">
          We reserve the right to terminate or suspend your account if you
          violate these terms or engage in activities that harm the service or
          other users.
        </Section>

        <Section title="Disclaimers">
          CamPricer AI is provided as-is, without warranties. We are not
          responsible for any damages arising from the use of the app.
        </Section>

        <Section title="Governing Law">
          These Terms of Service will be governed by and construed in accordance
          with the laws of the United States, without regard to its conflict of
          law principles.
        </Section>

        <Section title="Contact Us">
          If you have any questions or concerns regarding these terms, please
          contact us at{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:paulh6819@gmail.com")}
          >
            paulh6819@gmail.com
          </Text>
          .
        </Section>

        <Section title="Additional Information">
          The most current version of these Terms of Service is also available online at{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://www.gamesighter.com/camPricerTermsOfService.html")}
          >
            www.gamesighter.com/camPricerTermsOfService.html
          </Text>
          .
        </Section>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>CamPricer AI © 2022 – 2025</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Design Rationale</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.socialLinks}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.instagram.com/hendos_photos/")
            }
          >
            <Text style={styles.socialIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.linkedin.com/in/paul-henderson-548747141/"
              )
            }
          >
            <Text style={styles.socialIcon}>💼</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://github.com/paulh6819")}
          >
            <Text style={styles.socialIcon}>👾</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{children}</Text>
  </View>
);

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
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#6B7280",
    borderRadius: 25,
    shadowColor: "#6B7280",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 80,
    alignItems: "center",
  },
  navButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  effectiveDate: {
    fontSize: 14,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  link: {
    color: "#009688",
    textDecorationLine: "underline",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 20,
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 300,
  },
  footerLink: {
    color: "#009688",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  socialLinks: {
    flexDirection: "row",
    marginTop: 10,
  },
  socialIcon: {
    fontSize: 20,
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: "#6B7280",
    borderRadius: 25,
    color: "#FFFFFF",
    textAlign: "center",
    minWidth: 45,
    minHeight: 45,
    shadowColor: "#6B7280",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default TermsOfServiceScreen;
