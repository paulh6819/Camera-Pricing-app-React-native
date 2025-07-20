# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
```bash
# Start development server
npx expo start

# Run on specific platforms
npm run ios        # iOS simulator
npm run android    # Android emulator
```

### Building and Deployment
```bash
# iOS production build and submission
npm run release-ios
# OR manually:
eas build --platform ios --non-interactive && eas submit --platform ios --latest --non-interactive

# Over-the-Air (OTA) updates
npx eas-cli update --branch production

# Package management (required for this project)
npm install --legacy-peer-deps
```

## Architecture Overview

### Core Application Structure
**CamPricer** is a React Native camera equipment pricing app built with Expo. The app uses AI-powered image recognition to identify camera equipment and provide real-time pricing from multiple marketplaces.

### Key Technical Components

**Main Flow:**
1. `App.js` → Navigation setup with RevenueCat integration
2. `HomeScreen.js` → Main interface with navigation and layout
3. `ImageUploader.js` → Core camera functionality and pricing logic

**Image Processing Pipeline:**
1. Camera/gallery image selection via `expo-image-picker`
2. Optional WebP conversion for faster uploads using `expo-image-manipulator`
3. Base64 encoding for API transmission
4. Multi-platform API requests to backend recognition service
5. Camera data processing and price conversion
6. UI rendering with animated results

### State Management Architecture

**ImageUploader.js contains the primary application state:**
- `uploads[]` - Current camera scan results
- `recents[]` - Persistent history (up to 100 items via AsyncStorage)
- `selectedCurrency` - User's chosen currency for price display
- `exchangeRates{}` - Live currency conversion rates
- `isClearing` - Animation state for smooth transitions

**Recent Results System:**
- Automatically saves camera identifications to AsyncStorage
- Displays last 5 results in UI while storing up to 100
- Includes timestamp, camera info, and pricing data
- Supports currency conversion for historical data

### Backend Integration

**Camera Recognition API:**
- Production: `https://www.gamesighter.com/identifyCamera`
- Supports both single photo and batch processing modes
- Requires region parameter for localized pricing
- Returns structured camera data with marketplace pricing

**Currency Exchange:**
- Uses `exchangerate-api.com` for live rates
- Fallback rates hardcoded for offline functionality
- Supports 8 major currencies: USD, EUR, GBP, JPY, CAD, AUD, MXN, BRL

### UI/UX Architecture

**Animation System:**
- Uses `react-native-reanimated` for smooth transitions
- App-wide fade-in on load (600ms)
- Smooth clear animations (800ms) for result removal
- Individual item animations for adding/removing results

**Component Structure:**
- `ImageUploader` - Main camera interface and results display
- `RecentResults` - Modular recent history component
- `CameraModeHelpModal` - User guidance for camera modes
- `LoadingSymbol` - Animated loading indicator

## Configuration Notes

### Environment-Specific Settings
- The app checks `Constants.executionEnvironment` to determine API endpoints
- Development mode uses localhost (commented out in production)
- OTA updates enabled via Expo Updates

### Camera Processing Modes
- **Single Camera Mode**: Multiple photos processed as batch for same camera
- **Multiple Camera Mode**: Each photo processed individually
- Toggle affects API endpoint and processing logic

### Revenue Cat Integration
- API keys configured in `App.js` (currently placeholder values)
- Supports iOS and Android subscription management
- Fetches offerings on app startup

## Important Development Notes

### Platform Considerations
- iOS and Android have different permission handling
- Android localhost development uses `10.0.2.2:4200`
- Haptic feedback implementations vary by platform

### Data Persistence
- Recent results stored in AsyncStorage with 1000-item limit
- Currency preferences persist between sessions
- App state includes protection against stale closures in async operations

### Performance Optimizations
- Image compression via WebP conversion (toggleable)
- Sequential vs parallel image processing based on mode
- Conditional rendering of UI components based on state
- Virtualized scrolling for large result sets

## App Store Configuration

### Version Management
Update both values in `app.json`:
- `version` - User-facing version (e.g., "1.1.3")
- `buildNumber` (iOS) - Internal build number (must increment)

### Required Permissions
- `NSCameraUsageDescription` - Camera access for photo capture
- `NSPhotoLibraryUsageDescription` - Photo library access
- Android: `CAMERA`, storage permissions

### EAS Build Configuration
- Production builds use `eas.json` configuration
- App Store Connect ID: `6748239888`
- Project ID: `11db3343-3f4b-44fc-b0b2-19a68ff735a0`