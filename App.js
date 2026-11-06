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
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Reference For Logo
const LOGO_IMAGE = require('./assets/chef-logo.png');

// Dark Neutral Palette matching wireframes
const COLORS = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  secondarySurface: '#252525',
  primaryAccent: '#4CAF50', // Emerald Green
  secondaryAccent: '#FFC107', // Amber Gold
  primaryText: '#FFFFFF',
  secondaryText: '#BDBDBD',
  errorColor: '#F44336',
  starterColor: '#4CAF50',
  mainColor: '#FFC107',
  dessertColor: '#9C27B0',
};

// Initial Restaurant Menu Data
const INITIAL_DISHES = [
  {
    id: '1',
    name: 'Pan-Seared Duck Breast',
    description:
      'Crispy skin duck breast with cherry reduction and parsnip puree.',
    course: 'Starter',
    price: 145.0,
  },
  {
    id: '2',
    name: 'Truffle Mushroom Risotto',
    description:
      'Arborio rice with wild forest mushrooms, truffle paste, and parmesan.',
    course: 'Starter',
    price: 120.0,
  },
  {
    id: '3',
    name: 'Prime Ribeye Steak 300g',
    description:
      'Aged grass-fed beef with bone marrow butter and hand-cut chips.',
    course: 'Main Course',
    price: 295.0,
  },
  {
    id: '4',
    name: 'Grilled Norwegian Salmon',
    description:
      'Pan-roasted salmon fillet with lemon-herb butter and asparagus.',
    course: 'Main Course',
    price: 260.0,
  },
  {
    id: '5',
    name: 'Classic Crème Brûlée',
    description: 'Vanilla bean custard with a crisp caramelized sugar crust.',
    course: 'Dessert',
    price: 85.0,
  },
  {
    id: '6',
    name: 'Dark Chocolate Fondant',
    description: 'Warm molten chocolate cake served with pistachio gelato.',
    course: 'Dessert',
    price: 95.0,
  },
];

export default function App() {
  // Navigation State: 'home' | 'add' | 'view' | 'edit' | 'stats'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Core State
  const [dishes, setDishes] = useState(INITIAL_DISHES);

  // Form Field State (Add / Edit)
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  // Edit Tracking State
  const [editingId, setEditingId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Delete Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  // --- REUSABLE HELPER FUNCTIONS ---
  const resetFormFields = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setFeedback({ text: '', isError: false });
    setEditingId(null);
  };

  const handleNavigateHome = () => {
    resetFormFields();
    setCurrentScreen('home');
  };

  // ADD & EDIT / DELETE MANAGEMENT ---
  const handleSaveItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      setFeedback({
        text: 'All fields are required. Please complete the form.',
        isError: true,
      });
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setFeedback({
        text: 'Please enter a valid numeric price greater than zero.',
        isError: true,
      });
      return;
    }

    if (editingId) {
      // Update existing item
      setDishes((prevDishes) =>
        prevDishes.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: dishName.trim(),
                description: description.trim(),
                course,
                price: numericPrice,
              }
            : item
        )
      );
      Alert.alert('Success', `"${dishName}" has been successfully updated!`);
      setCurrentScreen('view');
    } else {
      // Add new item
      const newDish = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course,
        price: numericPrice,
      };
      setDishes((prevDishes) => [newDish, ...prevDishes]);
      setFeedback({
        text: `"${dishName}" successfully added to the menu!`,
        isError: false,
      });
    }

    resetFormFields();
  };

  const handleStartEdit = (dish) => {
    setEditingId(dish.id);
    setDishName(dish.name);
    setDescription(dish.description);
    setCourse(dish.course);
    setPrice(dish.price.toString());
    setCurrentScreen('edit');
  };

  const handleConfirmDelete = () => {
    if (dishToDelete) {
      setDishes((prevDishes) =>
        prevDishes.filter((item) => item.id !== dishToDelete.id)
      );
      setDeleteModalVisible(false);
      setDishToDelete(null);
    }
  };

  // SEARCH & FILTER
  const filteredDishes = dishes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      selectedFilter === 'All' || item.course === selectedFilter;
    return matchesSearch && matchesCourse;
  });

  // STATISTICS CALCULATIONS
  const totalItems = dishes.length;
  const averagePrice =
    totalItems > 0
      ? dishes.reduce((sum, d) => sum + d.price, 0) / totalItems
      : 0;
  const starterCount = dishes.filter((d) => d.course === 'Starter').length;
  const mainCount = dishes.filter((d) => d.course === 'Main Course').length;
  const dessertCount = dishes.filter((d) => d.course === 'Dessert').length;

  const getCourseBadgeStyle = (c) => {
    switch (c) {
      case 'Starter':
        return { backgroundColor: '#1B3E2B', color: COLORS.starterColor };
      case 'Main Course':
        return { backgroundColor: '#3D3212', color: COLORS.mainColor };
      case 'Dessert':
        return { backgroundColor: '#331B38', color: COLORS.dessertColor };
      default:
        return {
          backgroundColor: COLORS.secondarySurface,
          color: COLORS.primaryText,
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* NAVBAR WITH BACK BUTTON & LOGO */}
      <View style={styles.navbar}>
        {currentScreen !== 'home' ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleNavigateHome}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        <View style={styles.navbarBrand}>
          <Image
            source={LOGO_IMAGE}
            style={styles.navLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>Chef's Menu Manager</Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* SCREEN 1: HOME DASHBOARD */}
      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <Image
              source={LOGO_IMAGE}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroTitle}>Chef's Menu Manager</Text>
          </View>

          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome back, Chef!</Text>
            <Text style={styles.welcomeSubtitle}>
              You have{' '}
              <Text style={styles.highlightText}>{totalItems} menu items</Text>{' '}
              currently active.
            </Text>
          </View>

          <Text style={styles.sectionHeader}>PRIMARY ACTIONS</Text>

          <TouchableOpacity
            style={[
              styles.dashboardCard,
              { borderColor: COLORS.primaryAccent },
            ]}
            onPress={() => {
              resetFormFields();
              setCurrentScreen('add');
            }}>
            <View style={styles.iconBox}>
              <Text style={styles.dashIcon}>➕</Text>
            </View>
            <View>
              <Text style={styles.dashCardTitle}>Add Menu Item</Text>
              <Text style={styles.dashCardSub}>Create a new dish entry</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dashboardCard,
              { borderColor: COLORS.secondaryAccent },
            ]}
            onPress={() => setCurrentScreen('view')}>
            <View style={styles.iconBox}>
              <Text style={styles.dashIcon}>📋</Text>
            </View>
            <View>
              <Text style={styles.dashCardTitle}>View & Manage Menu</Text>
              <Text style={styles.dashCardSub}>
                Search, filter, edit, and delete dishes
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dashboardCard, { borderColor: '#2196F3' }]}
            onPress={() => setCurrentScreen('stats')}>
            <View style={styles.iconBox}>
              <Text style={styles.dashIcon}>📊</Text>
            </View>
            <View>
              <Text style={styles.dashCardTitle}>Menu Statistics</Text>
              <Text style={styles.dashCardSub}>
                View metrics and course breakdowns
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* SCREEN 2: ADD MENU ITEM */}
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
              style={{ color: COLORS.primaryText }}>
              <Picker.Item
                label="Starter"
                value="Starter"
                color={COLORS.cardBackground}
              />
              <Picker.Item
                label="Main Course"
                value="Main Course"
                color={COLORS.cardBackground}
              />
              <Picker.Item
                label="Dessert"
                value="Dessert"
                color={COLORS.cardBackground}
              />
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

          {feedback.text !== '' && (
            <View
              style={[
                styles.feedbackBox,
                { backgroundColor: feedback.isError ? '#3D1412' : '#14381E' },
              ]}>
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color: feedback.isError
                      ? COLORS.errorColor
                      : COLORS.primaryAccent,
                  },
                ]}>
                {feedback.text}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveItem}>
            <Text style={styles.primaryButtonText}>SAVE MENU ITEM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={resetFormFields}>
            <Text style={styles.secondaryButtonText}>CLEAR FORM</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* SCREEN 3: VIEW, SEARCH, FILTER & MANAGE MENU ITEMS */}
      {currentScreen === 'view' && (
        <View style={styles.listContainer}>
          <Text style={styles.pageHeader}>Menu Items & Management</Text>

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search dish name or description..."
            placeholderTextColor={COLORS.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Course Filter Chips */}
          <View style={styles.filterBar}>
            {['All', 'Starter', 'Main Course', 'Dessert'].map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.filterChip,
                  selectedFilter === c && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedFilter(c)}>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === c && styles.activeFilterChipText,
                  ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredDishes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>
                No menu items found matching criteria.
              </Text>
            }
            renderItem={({ item }) => {
              const badge = getCourseBadgeStyle(item.course);
              return (
                <View style={styles.dishCard}>
                  <View style={styles.dishCardHeader}>
                    <Text style={styles.dishTitle}>{item.name}</Text>
                    <Text style={styles.dishPrice}>
                      R {item.price.toFixed(2)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: badge.backgroundColor },
                    ]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>
                      {item.course.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.dishDescription}>{item.description}</Text>

                  {/* Management Actions (Edit & Delete) */}
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => handleStartEdit(item)}>
                      <Text style={styles.editBtnText}>✏️ Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => {
                        setDishToDelete(item);
                        setDeleteModalVisible(true);
                      }}>
                      <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* SCREEN 4: EDIT MENU ITEM */}
      {currentScreen === 'edit' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageHeader}>Edit Dish</Text>

          <Text style={styles.fieldLabel}>DISH NAME</Text>
          <TextInput
            style={styles.textInput}
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <TextInput
            style={[styles.textInput, styles.areaInput]}
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
              style={{ color: COLORS.primaryText }}>
              <Picker.Item
                label="Starter"
                value="Starter"
                color={COLORS.cardBackground}
              />
              <Picker.Item
                label="Main Course"
                value="Main Course"
                color={COLORS.cardBackground}
              />
              <Picker.Item
                label="Dessert"
                value="Dessert"
                color={COLORS.cardBackground}
              />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>PRICE (R)</Text>
          <TextInput
            style={styles.textInput}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveItem}>
            <Text style={styles.primaryButtonText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              resetFormFields();
              setCurrentScreen('view');
            }}>
            <Text style={styles.secondaryButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* SCREEN 5: MENU STATISTICS */}
      {currentScreen === 'stats' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageHeader}>Menu Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalItems}</Text>
              <Text style={styles.statLabel}>Total Menu Items</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>R {averagePrice.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Average Price</Text>
            </View>
          </View>

          <Text style={[styles.pageHeader, { marginTop: 24, fontSize: 16 }]}>
            Course Counts & Breakdown
          </Text>

          <View style={styles.courseStatRow}>
            <Text style={styles.courseStatLabel}>Starters</Text>
            <Text
              style={[styles.courseStatValue, { color: COLORS.starterColor }]}>
              {starterCount} items
            </Text>
          </View>

          <View style={styles.courseStatRow}>
            <Text style={styles.courseStatLabel}>Main Courses</Text>
            <Text style={[styles.courseStatValue, { color: COLORS.mainColor }]}>
              {mainCount} items
            </Text>
          </View>

          <View style={styles.courseStatRow}>
            <Text style={styles.courseStatLabel}>Desserts</Text>
            <Text
              style={[styles.courseStatValue, { color: COLORS.dessertColor }]}>
              {dessertCount} items
            </Text>
          </View>
        </ScrollView>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Dish?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove "{dishToDelete?.name}" from your
              menu? This action cannot be undone.
            </Text>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={handleConfirmDelete}>
                <Text style={styles.modalDeleteText}>Delete Dish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// STYLES
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
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 20,
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
  searchInput: {
    backgroundColor: COLORS.cardBackground,
    color: COLORS.primaryText,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
    marginBottom: 12,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.secondarySurface,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primaryAccent,
  },
  filterChipText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondarySurface,
    paddingTop: 10,
  },
  editBtn: {
    backgroundColor: COLORS.secondarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: COLORS.primaryText,
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#3D1412',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: COLORS.errorColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyListText: {
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryAccent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  courseStatLabel: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '600',
  },
  courseStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.secondarySurface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: COLORS.secondarySurface,
  },
  modalCancelText: {
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  modalDeleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: COLORS.errorColor,
  },
  modalDeleteText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
});
