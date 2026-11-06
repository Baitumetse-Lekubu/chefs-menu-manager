import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Logo
const LOGO_IMAGE = require('./assets/chef-logo.png');

// App Theme
const COLORS = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  secondarySurface: '#252525',
  primaryAccent: '#4CAF50', 
  secondaryAccent: '#FFC107',
  primaryText: '#FFFFFF',
  secondaryText: '#BDBDBD',
  errorColor: '#F44336',
  starterColor: '#4CAF50',
  mainColor: '#FFC107',
  dessertColor: '#9C27B0',
};

// Test Menue Items
const INITIAL_DISHES = [
  {
    id: '1',
    name: 'Pan-Seared Duck Breast',
    description: 'Crispy skin duck breast with cherry reduction and parsnip puree.',
    course: 'Starter',
    price: 145.0,
  },
  {
    id: '2',
    name: 'Prime Ribeye Steak 300g',
    description: 'Aged grass-fed beef with bone marrow butter and hand-cut chips.',
    course: 'Main Course',
    price: 295.0,
  },
  {
    id: '3',
    name: 'Classic Crème Brûlée',
    description: 'Vanilla bean custard with a crisp caramelized sugar crust.',
    course: 'Dessert',
    price: 85.0,
  },
];

export default function App() {
  
  const [currentScreen, setCurrentScreen] = useState('home');

  // App Menu 
  const [dishes, setDishes] = useState(INITIAL_DISHES);

  // Form
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setFeedback({ text: '', isError: false });
  };

  const handleGoHome = () => {
    resetForm();
    setCurrentScreen('home');
  };

  const handleSaveNewItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      setFeedback({ text: 'All fields are required. Please enter complete dish information.', isError: true });
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFeedback({ text: 'Please enter a valid numeric price greater than zero.', isError: true });
      return;
    }

    const newDish = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: numPrice,
    };

    setDishes((prev) => [newDish, ...prev]);
    setFeedback({ text: `"${dishName}" successfully added to the menu!`, isError: false });
    resetForm();
  };

  const getBadgeStyle = (c) => {
    switch (c) {
      case 'Starter':
        return { backgroundColor: '#1B3E2B', color: COLORS.starterColor };
      case 'Main Course':
        return { backgroundColor: '#3D3212', color: COLORS.mainColor };
      case 'Dessert':
        return { backgroundColor: '#331B38', color: COLORS.dessertColor };
      default:
        return { backgroundColor: COLORS.secondarySurface, color: COLORS.primaryText };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      { }
      <View style={styles.navbar}>
        {currentScreen !== 'home' ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleGoHome}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        <View style={styles.navbarBrand}>
          <Image source={LOGO_IMAGE} style={styles.navLogo} resizeMode="contain" />
          <Text style={styles.brandTitle}>Chef's Menu Manager</Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* SCREEN 1: Home Dashboard */}
      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          { }
          <View style={styles.heroCard}>
            <Image source={LOGO_IMAGE} style={styles.heroLogo} resizeMode="contain" />
            <Text style={styles.heroTitle}>Chef's Menu Manager</Text>
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome back, Chef!</Text>
            <Text style={styles.welcomeSubtitle}>
              You have <Text style={styles.highlightText}>{dishes.length} menu items</Text> currently active.
            </Text>
          </View>

          {/* Action Button */}
          <Text style={styles.sectionHeader}>PRIMARY ACTIONS</Text>

          <TouchableOpacity
            style={[styles.dashboardCard, { borderColor: COLORS.primaryAccent }]}
            onPress={() => setCurrentScreen('add')}
          >
            <View style={styles.iconBox}>
              <Text style={styles.dashIcon}>➕</Text>
            </View>
            <View>
              <Text style={styles.dashCardTitle}>Add Menu Item</Text>
              <Text style={styles.dashCardSub}>Create a new dish entry</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dashboardCard, { borderColor: COLORS.secondaryAccent }]}
            onPress={() => setCurrentScreen('view')}
          >
            <View style={styles.iconBox}>
              <Text style={styles.dashIcon}>📋</Text>
            </View>
            <View>
              <Text style={styles.dashCardTitle}>View Menu Items</Text>
              <Text style={styles.dashCardSub}>Browse all active dishes</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* SCREEN 2: Add Menu Items */}
      {currentScreen === 'add' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageHeader}>Add Menu Item</Text>

          <Text style={styles.fieldLabel}>DISH NAME</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Truffle Risotto"
            placeholderTextColor={COLORS.secondaryText}
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <TextInput
            style={[styles.textInput, styles.areaInput]}
            placeholder="Describe the dish, key ingredients, preparation..."
            placeholderTextColor={COLORS.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.fieldLabel}>COURSE</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={course}
              onValueChange={(itemValue) => setCourse(itemValue)}
              dropdownIconColor={COLORS.primaryAccent}
              style={{ color: COLORS.primaryText }}
            >
              <Picker.Item label="Starter" value="Starter" color={COLORS.cardBackground} />
              <Picker.Item label="Main Course" value="Main Course" color={COLORS.   cardBackground} />
              <Picker.Item label="Dessert" value="Dessert" color={COLORS.cardBackground} />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>PRICE (R)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.secondaryText}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          { }
          {feedback.text !== '' && (
            <View
              style={[
                styles.feedbackBox,
                { backgroundColor: feedback.isError ? '#3D1412' : '#14381E' },
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  { color: feedback.isError ? COLORS.errorColor : COLORS.primaryAccent },
                ]}
              >
                {feedback.text}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveNewItem}>
            <Text style={styles.primaryButtonText}>SAVE MENU ITEM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
            <Text style={styles.secondaryButtonText}>CLEAR FORM</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* SCREEN 3: View Menu Items */}
      {currentScreen === 'view' && (
        <View style={styles.listContainer}>
          <Text style={styles.pageHeader}>Menu Items</Text>

          <FlatList
            data={dishes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No menu items have been added yet.</Text>
            }
            renderItem={({ item }) => {
              const badge = getBadgeStyle(item.course);
              return (
                <View style={styles.dishCard}>
                  <View style={styles.dishCardHeader}>
                    <Text style={styles.dishTitle}>{item.name}</Text>
                    <Text style={styles.dishPrice}>R {item.price.toFixed(2)}</Text>
                  </View>

                  <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>
                      {item.course.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.dishDescription}>{item.description}</Text>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
            <Text style={styles.primaryButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondarySurface,
  },
  backBtn: {
    paddingRight: 10,
  },
  backBtnText: {
    color: COLORS.primaryAccent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  scrollContent: {
    padding: 16,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  heroCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  welcomeBanner: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  highlightText: {
    color: COLORS.primaryAccent,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    marginBottom: 10,
    letterSpacing: 1,
  },
  dashboardCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.secondarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dashIcon: {
    fontSize: 18,
  },
  dashCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  dashCardSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: COLORS.cardBackground,
    color: COLORS.primaryText,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
    marginBottom: 16,
  },
  areaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerBox: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
    marginBottom: 16,
    justifyContent: 'center',
  },
  feedbackBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  feedbackText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondarySurface,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.secondaryText,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  dishCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  dishCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    flex: 1,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.secondaryAccent,
    marginLeft: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginVertical: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dishDescription: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyListText: {
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
