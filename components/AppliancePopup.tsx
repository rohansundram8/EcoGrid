// AppliancePopup: Full Firebase fetch fix for loading appliances with per-appliance recommendations
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import televisions from '../JSONs/televisions.json';
import airConditioners from '../JSONs/air_conditioners.json';
import downlights from '../JSONs/downlights.json';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const applianceImages = {
  TV: require('../assets/tv.png'),
  Lamp: require('../assets/lamp.png'),
  Blender: require('../assets/blender.png'),
  'Air Conditioner': require('../assets/ac.png'),
  Fridge: require('../assets/fridge.png'),
  Toaster: require('../assets/toaster.png'),
  Oven: require('../assets/oven.png'),
  Washer: require('../assets/washer.png'),
  Dryer: require('../assets/dryer.png'),
  'Ceiling Lamp': require('../assets/ceilinglamp.png'),
};

const AppliancePopup = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, appliance } = route.params;

  const [savedAppliances, setSavedAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const appliancesMap = data?.AppliancesMap || {};
          const selectedCategory = appliancesMap[appliance] || {};

          if (Object.keys(selectedCategory).length > 0) {
            const appliancesArray = Object.values(selectedCategory);
            setSavedAppliances(appliancesArray);
          } else {
            setSavedAppliances([]);
          }
        } else {
          setSavedAppliances([]);
        }
      } catch (error) {
        console.error('Error fetching appliances:', error);
        setSavedAppliances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();

    let options = [];
    if (appliance === 'TV') {
      options = televisions.map(item => ({
        label: `${item['Brand Name']} - ${item['Model Number']}`,
        value: item['ENERGY STAR Unique ID'],
        fullData: {
          name: item['Model Number'],
          usage: item['Reported Annual Energy Consumption (kWh)'] || 0,
          aid: item['ENERGY STAR Unique ID'] || '',
          brand: item['Brand Name'] || '',
        },
      }));
    } else if (appliance === 'Lamp') {
      options = downlights.map(item => ({
        label: `${item['Brand Name']} - ${item['Model Number']}`,
        value: item['ENERGY STAR Unique ID'],
        fullData: {
          name: item['Model Number'],
          usage: item['Total Input Power (Watts)'] || 0,
          aid: item['ENERGY STAR Unique ID'] || '',
          brand: item['Brand Name'] || '',
        },
      }));
    } else if (appliance === 'Air Conditioner') {
      options = airConditioners.map(item => ({
        label: `${item['Brand Name']} - ${item['Model Number']}`,
        value: item['ENERGY STAR Unique ID'],
        fullData: {
          name: item['Model Number'],
          usage: item['Annual Energy Use (kWh/yr)'] || 0,
          aid: item['ENERGY STAR Unique ID'] || '',
          brand: item['Brand Name'] || '',
        },
      }));
    }
    setDropdownOptions(options);
  }, [userId, appliance]);

  const handleSave = async () => {
    const selected = dropdownOptions.find(opt => opt.value === selectedValue);
    if (!selected) {
      alert('Select an appliance!');
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('No logged-in user!');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      [`AppliancesMap.${appliance}.${selected.fullData.aid}`]: {
        name: selected.fullData.name,
        usage: selected.fullData.usage,
        aid: selected.fullData.aid,
        brand: selected.fullData.brand,
      },
    });

    alert(`${appliance} added successfully!`);
    setModalVisible(false);
    setSavedAppliances(prev => [...prev, selected.fullData]);
  };

  const handleAddRecommended = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert('No logged-in user!');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`AppliancesMap.${appliance}.${item.fullData.aid}`]: {
          name: item.fullData.name,
          usage: item.fullData.usage,
          aid: item.fullData.aid,
          brand: item.fullData.brand,
        },
      });

      alert(`${item.fullData.name} added successfully!`);
      setSavedAppliances(prev => [...prev, item.fullData]);
    } catch (err) {
      console.error('Error adding recommended appliance:', err);
      alert('Failed to add.');
    }
  };

  if (loading) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }
  return (
    <View style={styles.overlay}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonModal} onPress={() => navigation.goBack()}>
        <Text style={styles.backTextModal}>← Back</Text>
      </TouchableOpacity>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {savedAppliances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appliances added yet. Tap ＋ to add one!</Text>
        </View>
      ) : (
        <FlatList
          data={savedAppliances}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.aid}
          renderItem={({ item }) => {
            const recommendations = dropdownOptions.filter(opt => opt.fullData.usage < item.usage);
            return (
              <View style={[styles.popup, { width: SCREEN_WIDTH }]}>
                {/* Appliance Info Card */}
                <View style={styles.recCard}>
                  <Image
                    source={applianceImages[appliance]}
                    style={styles.recImage}
                    resizeMode="contain"
                  />
                  <View style={styles.recInfo}>
                    <Text style={styles.recName}>
                      {item.brand ? `${item.brand} - ${item.name}` : item.name}
                    </Text>
                  </View>
                </View>

                {/* Usage Section */}
                <View style={styles.usageRow}>
                  <View style={styles.usageCard}>
                    <Text style={styles.cardLabel}>Your Usage</Text>
                    <Text style={styles.cardValue}>{item.usage}</Text>
                    <Text style={styles.cardUnit}>kWh/year</Text>
                  </View>
                  <View style={styles.usageCard}>
                    <Text style={styles.cardLabel}>Average Usage</Text>
                    <Text style={styles.cardValue}>500</Text>
                    <Text style={styles.cardUnit}>kWh/year</Text>
                  </View>
                </View>

                {/* Recommendations */}
                <Text style={styles.recommendationsTitle}>Recommended Appliances</Text>
                {recommendations.slice(0, 2).map((rec) => (
                  <View key={rec.value} style={styles.recommendationCard}>
                    <Image source={applianceImages[appliance]} style={styles.recommendationImage} />
                    <View style={styles.recommendationInfo}>
                      <Text style={styles.recommendationName}>
                        {rec.fullData.brand} - {rec.fullData.name}
                      </Text>
                      <Text style={styles.recommendationUsage}>
                        {rec.fullData.usage} kWh/year
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addButtonSmall}
                      onPress={() => handleAddRecommended(rec)}
                    >
                      <Text style={styles.addButtonSmallText}>＋ Add</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {savedAppliances.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { opacity: currentIndex === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      {/* Add Appliance Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Appliance</Text>
            <DropDownPicker
              open={dropdownOpen}
              value={selectedValue}
              items={dropdownOptions}
              setOpen={setDropdownOpen}
              setValue={setSelectedValue}
              setItems={setDropdownOptions}
              placeholder={`Select a ${appliance}...`}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#bad2ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0046b5ff',
    marginHorizontal: 4
  },
  addButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#0046b5ff',
    padding: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButtonModal: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 100,
  },
  backTextModal: {
    fontSize: 18,
    color: '#3E2C1D',
    fontWeight: '500',
  },
  popup: {
    backgroundColor: '#bad2ff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: -5,
  },
  recImage: {
    width: 60,
    height: 60,
    marginRight: 12
  },
  recInfo: {
    flex: 1
  },
  recName: {
    fontSize: 14,
    fontWeight: '600'
  },
  recUsage: {
    fontSize: 12,
    color: '#666'
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  usageCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  cardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 52
  },
  cardUnit: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16
  },
  recommendationsTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#002060',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  recommendationImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '800',
  },
  recommendationUsage: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  addButtonSmall: {
    backgroundColor: '#0046b5ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addButtonSmallText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#0046b5ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: 'blue',
    marginTop: 20,
  },
});

export default AppliancePopup;
