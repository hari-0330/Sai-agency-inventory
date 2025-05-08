import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';
import { ipAddress } from "../ipConfig";
import NavBar from "./NavBar";

const UserOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/orders`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (order) => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      if (!userPhone) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      // Create delivery report
      const deliveryReport = {
        userPhone,
        deliveryPlace: order.deliveryPlace,
        cans25L: order.cans25L,
        cans10L: order.cans10L,
        cans1L: order.cans1L,
        timestamp: new Date().toISOString()
      };

      // Submit delivery report
      const reportResponse = await fetch(`http://${ipAddress}:5000/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryReport),
      });

      if (reportResponse.ok) {
        // Delete the order after successful delivery report
        const deleteResponse = await fetch(`http://${ipAddress}:5000/api/orders/${order._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (deleteResponse.ok) {
          // Update local state
          setOrders(currentOrders => currentOrders.filter(o => o._id !== order._id));
          Alert.alert('Success', 'Delivery completed successfully');
        }
      } else {
        throw new Error('Failed to submit delivery report');
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
      Alert.alert('Error', 'Failed to complete delivery');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.headerLeft}>
          <Icon name="local-shipping" size={24} color={theme.colors.primary} />
          <Text style={styles.dateText}>
            {new Date(item.deliveryDate).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleComplete(item)}
        >
          <Icon name="check-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.orderContent}>
        <Text style={styles.placeText}>Deliver to: {item.deliveryPlace}</Text>
        <View style={styles.canDetails}>
          {item.cans25L > 0 && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>25L Cans: {item.cans25L}</Text>
            </View>
          )}
          {item.cans10L > 0 && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>10L Cans: {item.cans10L}</Text>
            </View>
          )}
          {item.cans1L > 0 && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>1L Cans: {item.cans1L}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders To-Do List</Text>
        <Text style={styles.subtitle}>View and complete pending deliveries</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending orders</Text>
          }
        />
      )}
      <NavBar navigation={navigation} isAdmin={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}15`,
    padding: 8,
    borderRadius: theme.roundness.small,
  },
  completeButtonText: {
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  orderContent: {
    padding: 16,
  },
  placeText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  canDetails: {
    marginLeft: 8,
  },
  canItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  canText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.secondary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.secondary,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default UserOrders; 