import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';



const generateMonths = (startDate, numberOfMonths) => {
  const months = [];
  const start = new Date(startDate);
  for (let i = 0; i < numberOfMonths; i++) {
    const year = start.getFullYear();
    const month = start.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const range = `${firstDay.getMonth() + 1}/${firstDay.getDate()}/${firstDay.getFullYear()} - ${lastDay.getMonth() + 1}/${lastDay.getDate()}/${lastDay.getFullYear()}`;
    months.push(range);
    start.setMonth(start.getMonth() - 1);
  }
  return months;
};

const UsageUpdateScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DashboardScreen');
    }
  };

  const months = generateMonths('2025-05-01', 7);
  //   const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [appliances, setAppliances] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [durationInput, setDurationInput] = useState('');


  const updateAppliance = (index, field, value) => {
    const updated = [...appliances];
    updated[index][field] = value;
    setAppliances(updated);
  };

  const addAppliance = () => {
    if (nameInput.trim() && durationInput.trim()) {
      const newList = [...appliances, { name: nameInput.trim(), duration: durationInput.trim() }];
      setAppliances(newList);
      setNameInput('');
      setDurationInput('');
    }
  };



  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const current = generateMonths('2025-05-01', 7).find(m => m.startsWith(`${now.getMonth() + 1}/1/`));
    return current || months[0];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(`usage_${selectedMonth}`);
        if (saved) {
          setAppliances(JSON.parse(saved));
        } else {
          setAppliances([{ name: '', duration: '' }]);
        }
      } catch (e) {
        console.error('Failed to load usage data:', e);
      }
    };

    loadData();
  }, [selectedMonth]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          `usage_${selectedMonth}`,
          JSON.stringify(appliances)
        );
      } catch (e) {
        console.error('Failed to save usage data:', e);
      }
    };

    saveData();
  }, [appliances, selectedMonth]);


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedMonth}</Text>
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <ScrollView style={{ maxHeight: 250 }}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedMonth(month);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Appliance Usage</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Appliance"
            placeholderTextColor="#aaa"
            value={nameInput}
            onChangeText={setNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (hrs)"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={durationInput}
            onChangeText={setDurationInput}
          />
        </View>


        <TouchableOpacity style={styles.addButton} onPress={addAppliance}>
          <Text style={styles.addButtonText}>＋ Add Appliance</Text>
        </TouchableOpacity>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Appliance</Text>
            <Text style={styles.headerText}>Duration (hrs)</Text>
          </View>
          {appliances.map((item, index) => (
            item.name && item.duration ? (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cellText}>{item.name}</Text>
                <Text style={styles.cellText}>{item.duration}</Text>
              </View>
            ) : null
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bad2ff',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 150,
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: '#0046b5ff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dropdownText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 280,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E2C1D',
    marginBottom: 10,
  },
  scroll: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#0046b5ff',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  table: {
    marginTop: 30,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 6,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#3E2C1D',
    fontWeight: '500',
  },

});

export default UsageUpdateScreen;
