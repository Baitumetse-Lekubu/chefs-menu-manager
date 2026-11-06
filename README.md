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

* **Framework:** React Native
* **Language:** JavaScript
* **Development Environment:** Expo Snack / Visual Studio Code

# Chef's Menu Manager — Final PoE Release 🍽️

## 🔄 Change Log & Refactoring Overview (Since Part 2)

### 1. Menu Management (CRUD Operations)
* **Added Edit Functionality:** Integrated an edit workflow allowing the chef to select any existing menu item, prefill form inputs with current values, modify data, and save updates instantly.
* **Added Delete Functionality:** Implemented a secure confirmation modal prompt before removing any dish from active state, preventing accidental data loss.

### 2. Search & Filtering Enhancements
* **Live Search Bar:** Added real-time filtering by dish name or description keywords.
* **Course Filter Tabs:** Enabled category filtering buttons (*All*, *Starter*, *Main Course*, *Dessert*) allowing the chef to instantly isolate specific course sections.

### 3. Menu Statistics Dashboard
* **Metrics Cards:** Introduced high-level metrics displaying total active menu items and average pricing.
* **Course Counts:** Added item count breakdowns for each individual course category in a structured display.

### 4. Code Refactoring & UX Polish
* **Modular Functions:** Re-organized state management into clean reusable helper functions (`resetFormFields`, `handleSaveItem`, `filteredDishes`).
* **Visual Feedback:** Enhanced error validation messages and success confirmation banners.
* **Consistent Navigation:** Maintained unified dark neutral branding (`#121212`, `#1E1E1E`), custom logo integration, and smooth back-navigation across all 5 screens.
---

