import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  useEffect(() => {
    fetchStock();
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
          <Icon name="dashboard" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Icon name="people" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('Orders')}
        >
          <Icon name="shopping-cart" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('Reports')}
        >
          <Icon name="assessment" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Admin Dashboard</Text>
          </View>

          <View style={styles.stockContainer}>
            <View style={styles.icon}>
          
          </View>
          {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setIsEditing(true)}
              ><div>
                <h4>Update</h4><Icon name="edit" size={24} color={theme.colors.primary}  /></div>
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
                  <span>Use "-"</span>
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
    paddingTop:12,
    width:'90%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  sideNav: {
    width: 80,
    backgroundColor: theme.colors.surface,
    paddingTop: 50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    ...theme.shadows.small,
  },
  icon:{
    alignItems: 'center',
   
  },
  sideNavItem: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 10,
    borderRadius: theme.roundness.small,
    width: '100%',
  },
  activeNavItem: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  sideNavText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 5,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    width:"100%"
  },
  mainContent: {
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
    fontSize: 16,
    fontWeight: '600',
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
  }
});

export default AdminDashboard; 