# CamScout React Native Template

A React Native template with image recognition capabilities, built with Expo and Revenue Cat integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd camScout-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the app**
   - Update `app.json` with your app details
   - Set your EAS project ID in `app.json`
   - Configure Revenue Cat API keys (see below)

4. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## ⚙️ Configuration

### Revenue Cat Setup

1. **Create Revenue Cat account** at [revenuecat.com](https://revenuecat.com)

2. **Get your API keys** from Revenue Cat dashboard

3. **Update App.js** with your API keys:
   ```javascript
   if (Platform.OS === "ios") {
     Purchases.configure({ apiKey: "YOUR_IOS_API_KEY_HERE" });
   } else if (Platform.OS === "android") {
     Purchases.configure({ apiKey: "YOUR_ANDROID_API_KEY_HERE" });
   }
   ```

### App Store Configuration

1. **Update app.json**:
   - Change `name` to your app name
   - Change `slug` to your app slug
   - Update `bundleIdentifier` and `package`
   - Replace `REPLACE_WITH_YOUR_EAS_PROJECT_ID` with your actual EAS project ID
   - Replace `REPLACE_WITH_YOUR_EXPO_USERNAME` with your Expo username

2. **Update eas.json**:
   - Replace `REPLACE_WITH_YOUR_APP_STORE_CONNECT_ID` with your App Store Connect ID

### EAS Build Setup

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS project**
   ```bash
   eas build:configure
   ```

## 📱 Features

- **Image Recognition**: Built-in camera and image picker functionality
- **Revenue Cat Integration**: Ready for subscription management
- **Navigation**: React Navigation setup with multiple screens
- **Custom Fonts**: Minecraft and MaisonNeue fonts included
- **Cross-platform**: iOS and Android support

## 🛠️ Development

### Building for Production

```bash
# iOS
npm run release-ios

# Or use EAS directly
eas build --platform ios
eas submit --platform ios
```

### Project Structure

```
camScout-react-native/
├── App.js                 # Main app component
├── app.json              # Expo configuration
├── eas.json              # EAS build configuration
├── components/           # Reusable components
├── screens/              # Screen components
├── assets/               # Images, fonts, icons
└── utils/                # Utility functions
```

## 🔧 Customization

### Branding
- Replace icons in `assets/icons/`
- Update app name and descriptions in `app.json`
- Modify color scheme in components

### Features
- Add new screens in `screens/` directory
- Register new screens in `App.js` navigation
- Customize Revenue Cat offerings and products

## 📝 License

This template is provided as-is for development purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Note**: Remember to replace all placeholder values (API keys, project IDs, etc.) with your actual values before building for production.
# Camera-Pricing-app-React-native
