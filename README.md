# Chef's Menu Manager 🍽️

A sleek React Native mobile application designed for restaurant chefs to manage, categorize, and calculate average prices for menu items dynamically. Developed as part of the Mobile Application Development module assignment.

---

## 📱 Features & Assignment Coverage

### 1. User Interface & Branding
* **App Branding:** Displays the official **Chef's Menu Manager** title and logo assets prominently.
* **Consistent Design:** Built using a dark-mode theme (`#121212`) with consistent padding, clear typography, and color-coded tags for dish courses.
* **Intuitive Navigation:** Multi-screen layout with an interactive top navigation bar including clear **Back** navigation.

### 2. Capture Menu Information
* **Input Validation:** Interactive form capturing Dish Name, Description, Course, and Price.
* **Dropdown Selection:** Course categorisation (*Starter*, *Main Course*, *Dessert*) powered by `@react-native-picker/picker`.
* **Price Handling:** Enforces numeric input validation for pricing.

### 3. Display & State Management
* **Dynamic Menu List:** Real-time updates to the dish listing using React `useState` hooks.
* **Optimized Rendering:** Displays all dishes inside a high-performance `FlatList`.
* **Empty State Handling:** Friendly feedback messages when no dishes are present in the list.

### 4. User Experience (UX) Enhancements
* **Inline Feedback System:** Visual banner alerts confirming successful dish additions or flagging validation errors.
* **Quick Stats & Dashboard:** A home landing view giving the chef a high-level overview of active dishes and quick navigation actions.

---

## 🛠️ Tech Stack & Dependencies

* **Framework:** React Native (Expo Workflow)
* **Language:** JavaScript (ES6 / JSX)
* **Core Components:** `SafeAreaView`, `FlatList`, `ScrollView`, `TextInput`, `TouchableOpacity`, `Picker`
* **Development Environment:** Expo Snack / Visual Studio Code

---

