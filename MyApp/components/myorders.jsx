import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from "./NavBar";
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import { ipAddress } from "../ipConfig";

const MyOrders = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      if (!userPhone) {
        setLoading(false);
        return;
      }

      // Fetch orders
      
      // Fetch reports for the specific user
      const reportsResponse = await fetch(`http://${ipAddress}:5000/api/reports/${userPhone}`);
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData.reports || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon name="local-shipping" size={24} color={theme.colors.primary} />
          <Text style={styles.dateText}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.deliveryInfo}>
          <Icon name="place" size={20} color={theme.colors.secondary} />
          <Text style={styles.deliveryText}>Delivery to: {item.deliveryPlace}</Text>
        </View>
        
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
        <Icon name="assignment" size={40} color={theme.colors.primary} />
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>View your delivery history</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No delivery reports found</Text>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cardContent: {
    padding: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  canDetails: {
    marginLeft: 28,
  },
  canItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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

export default MyOrders; 