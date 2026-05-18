# EduCase - Rick & Morty Character Explorer

A React Native mobile application built to explore the Rick & Morty universe. This app allows users to browse characters, search with debounced inputs, filter by status, and save their favorite characters—all with smooth infinite scrolling and offline persistence.

## App Functionality

- **Character Browsing:** View a comprehensive list of Rick & Morty characters retrieved from the official API.
- **Infinite Scrolling:** Seamlessly load more characters as you scroll down the list.
- **Search & Filter:** Search for specific characters with debounced input and filter results by their alive/dead/unknown status.
- **Favorites Management:** Add or remove characters from your favorites list.
- **Local Persistence:** Your favorite characters are saved locally on your device and persist across app sessions.
- **Offline Reliability:** Network state is handled gracefully, ensuring the app remains usable.
- **Custom UI:** Built entirely with core React Native primitives without relying on heavy third-party UI component libraries.

## How to Run the Project

### Prerequisites
- Node.js (v22+)
- React Native development environment set up for iOS and/or Android (Xcode/Android Studio).
- Ruby (for iOS CocoaPods)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install iOS Pods (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start the Metro Bundler:**
   ```bash
   npm start
   ```

4. **Run the Application:**
   - **For iOS:**
     ```bash
     npm run ios
     ```
   - **For Android:**
     ```bash
     npm run android
     ```

## Key Technical Decisions

- **React Native CLI:** Chosen over Expo for maximum control over native code and easier integration of specialized native modules.
- **Redux Toolkit:** Used for predictable state management and efficient API data fetching/caching.
- **Redux Persist with AsyncStorage:** Chosen to reliably persist the user's favorite characters and app state locally, providing a fast and offline-friendly experience.
- **React Navigation (v7):** Implemented for robust, native-feeling navigation (Bottom Tabs and Native Stack), allowing for smooth screen transitions.
- **Debounced Search:** Custom implementation to debounce search queries, preventing excessive API calls while the user is typing.
- **Custom Theming:** Instead of using third-party styling libraries, the app uses standard `StyleSheet` with centralized design tokens for a performant, lightweight, and cohesive visual language.

## Improvements with More Time

If given more time, I would focus on the following enhancements:

1. **Comprehensive Testing:** Add a robust suite of unit tests with Jest and React Native Testing Library, plus end-to-end (E2E) tests using Detox.
2. **Advanced Caching Strategy:** Implement offline-first caching for the character lists and images so users can browse previously loaded characters completely offline.
3. **Animations and Micro-interactions:** Add React Native Reanimated to create smooth, 60fps shared-element transitions between the list and details screens, and satisfying micro-interactions when favoriting items.
4. **Localization (i18n):** Introduce `react-i18next` to support multiple languages and broaden the app's accessibility.
5. **Dark Mode & Dynamic Theming:** Fully integrate system-aware light/dark modes using React Native's `Appearance` API and dynamic color palettes.
6. **Detailed Character Pages:** Expand the character details to show episodes they appear in, linking to specific episode details screens for deeper exploration.
