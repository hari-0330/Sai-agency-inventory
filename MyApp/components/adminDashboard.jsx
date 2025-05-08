import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import theme from '../styles/theme';
import { ipAddress } from "../ipConfig";

const AdminDashboard = ({ navigation }) => {
  const [stock, setStock] = useState({
    cans25L: 0,
    cans10L: 0,
    cans1L: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedStock, setEditedStock] = useState({
    cans25L: "0",
    cans10L: "0",
    cans1L: "0"
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  });

  useEffect(() => {
    fetchStock();
    fetchActivities();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/stock`);
      const data = await response.json();
      if (response.ok) {
        setStock(data.stock);
        setEditedStock({
          cans25L: data.stock.cans25L.toString(),
          cans10L: data.stock.cans10L.toString(),
          cans1L: data.stock.cans1L.toString(),
        });
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/activities`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities || []);
        processChartData(data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const processChartData = (activities) => {
    const last7Days = new Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const deliveryCounts = activities.reduce((acc, activity) => {
      if (activity.type === 'delivery') {
        const date = new Date(activity.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    const data = last7Days.map(date => deliveryCounts[date] || 0);
    const labels = last7Days.map(date => date.slice(5));

    setChartData({
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2
        }
      ]
    });
  };

  const handleUpdateStock = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/stock/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cans25L: parseInt(editedStock.cans25L),
          cans10L: parseInt(editedStock.cans10L),
          cans1L: parseInt(editedStock.cans1L),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStock(data.stock);
        setIsEditing(false);
        Alert.alert("Success", "Stock updated successfully!");
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert("Error", "Failed to update stock");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sideNav}>
      <TouchableOpacity 
          style={[styles.sideNavItem, styles.activeNavItem]} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Icon name="dashboard" size={24} color="#007AFF" />
          <Text style={styles.sideNavText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Icon name="people" size={24} color="#007AFF" />
          <Text style={styles.sideNavText}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('Orders')}
        >
          <Icon name="shopping-cart" size={24} color="#007AFF" />
          <Text style={styles.sideNavText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('Reports')}
        >
          <Icon name="assessment" size={24} color="#007AFF" />
          <Text style={styles.sideNavText}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Admin Dashboard</Text>
          </View>

         {/*} <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Delivery Activity (Last 7 Days)</Text>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 140}
              height={220}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.text,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: theme.colors.primary
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>*/}

          <View style={styles.stockContainer}>
            <View style={styles.icon}>
          
          </View>
          {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setIsEditing(true)}
              >
                <View style={styles.editButtonContent}>
                  <Text style={styles.editButtonText}>Update</Text>
                  <Icon name="edit" size={24} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            )}
            <Text style={styles.sectionTitle}>Current Stock</Text>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>25L Cans</Text>
              {isEditing ? (
                <TextInput
                  style={styles.stockInput}
                  onChangeText={(text) => setEditedStock({...editedStock, cans25L: text})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.stockValue}>{stock.cans25L}</Text>
              )}
            </View>

            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>10L Cans</Text>
              {isEditing ? (
                <TextInput
                  style={styles.stockInput}
                  onChangeText={(text) => setEditedStock({...editedStock, cans10L: text})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.stockValue}>{stock.cans10L}</Text>
              )}
            </View>

            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>1L Bottles</Text>
              {isEditing ? (
                <TextInput
                  style={styles.stockInput}
                  onChangeText={(text) => setEditedStock({...editedStock, cans1L: text})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.stockValue}>{stock.cans1L}</Text>
              )}
            </View>

            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateStock}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:2,
    width:'100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  sideNav: {
    marginTop:20,
    width: 80,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 1,
  },
  sideNavItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  activeNavItem: {
    backgroundColor: '#e3f2fd',
    padding: 1,
    borderRadius: 10,
  },
  sideNavText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  
  icon:{
    alignItems: 'center',
   
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    width:"100%"
  },
  mainContent: {
    marginTop:40,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'right',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text,
  },
  editButton: {
    alignItems:"end",
    padding: 10,
    borderRadius: theme.roundness.small,
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginRight: 8,
  },
  stockContainer: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: theme.roundness.medium,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.secondary,
  },
  stockValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  stockInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.small,
    color: theme.colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  button: {
    padding: 16,
    borderRadius: theme.roundness.small,
    width: '40%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '60',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: theme.roundness.medium,
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.medium,
  },
  gridItemText: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 10,
  },
  gridItemNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.roundness.medium,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
});

export default AdminDashboard; 