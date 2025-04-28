import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const SummaryScreen = () => {
  const navigation = useNavigation();
  const [selectedWeek, setSelectedWeek] = useState(generateMonths('2025-05-01', 7)[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [applianceData, setApplianceData] = useState({ labels: [], usage: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const appliancesMap = data?.AppliancesMap || {};
          const labels = [];
          const usage = [];

          for (const category in appliancesMap) {
            let total = 0;
            const appliances = appliancesMap[category];
            if (typeof appliances === 'object') {
              for (const key in appliances) {
                const app = appliances[key];
                total += app.usage || 0;
              }
            }
            labels.push(category);
            usage.push(total);
          }
          setApplianceData({ labels, usage });
        }
      } catch (err) {
        console.error('Error fetching appliance usage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DashboardScreen');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2972ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedWeek}</Text>
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <ScrollView style={{ maxHeight: 170 }}>
              {generateMonths('2025-05-01', 7).map((week, index) => (
                <TouchableOpacity key={index} style={styles.modalItem} onPress={() => {
                  setSelectedWeek(week);
                  setModalVisible(false);
                }}>
                  <Text style={styles.modalItemText}>{week}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.mainTitle}>Monthly Summary</Text>

      {applianceData.labels.length > 0 ? (
        <View style={styles.graphContainer}>
          <BarChart
            data={{
              labels: applianceData.labels,
              datasets: [{ data: applianceData.usage }],
            }}
            width={SCREEN_WIDTH * 0.85}
            height={360}
            fromZero
            withInnerLines
            withHorizontalLabels
            showValuesOnTopOfBars
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#bad2ff',
              backgroundGradientFrom: '#bad2ff',
              backgroundGradientTo: '#bad2ff',
              decimalPlaces: 0,
              barPercentage: 0.6,
              fillShadowGradient: '#0046b5ff',
              fillShadowGradientOpacity: 1,
              color: () => '#2972ea',
              labelColor: () => '#3E2C1D',
              propsForBackgroundLines: {
                stroke: '#0046b5ff',
                strokeDasharray: '0',
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.graphStyle}
            verticalLabelRotation={0}
          />
        </View>
      ) : (
        <Text style={styles.noData}>No appliance data yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bad2ff',
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3E2C1D',
    marginBottom: 20,
    textAlign: 'center',
  },
  graphContainer: {
    backgroundColor: '#bad2ff',
    borderColor: '#0046b5ff',
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphStyle: {
    borderRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 10,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#3E2C1D',
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    backgroundColor: '#0046b5ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 6,
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
  noData: {
    fontSize: 16,
    color: '#3E2C1D',
    marginTop: 30,
  },
});

export default SummaryScreen;
