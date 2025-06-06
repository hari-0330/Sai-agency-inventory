import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import { ipAddress } from "../ipConfig";

const Reports = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/activities`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities || []);
        setFilteredActivities(data.activities || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredActivities(activities);
      setFilterActive(false);
      return;
    }

    const filtered = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      return activityDate >= start && activityDate <= end;
    });

    setFilteredActivities(filtered);
    setFilterActive(true);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredActivities(activities);
    setFilterActive(false);
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon 
            name={item.type === 'delivery' ? "local-shipping" : "edit"} 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={styles.dateText}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        {item.type === 'delivery' ? (
          <>
            <Text style={styles.userText}>Reported by: {item.userPhone}</Text>
            <Text style={styles.placeText}>Delivery to: {item.deliveryPlace}</Text>
          </>
        ) : (
          <Text style={styles.userText}>Stock Updated by Admin</Text>
        )}
        
        <View style={styles.canDetails}>
          {item.cans25L !== undefined && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>
                25L Cans: {item.type === 'stock' ? item.cans25L : `-${item.cans25L}`}
              </Text>
            </View>
          )}
          {item.cans10L !== undefined && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>
                10L Cans: {item.type === 'stock' ? item.cans10L : `-${item.cans10L}`}
              </Text>
            </View>
          )}
          {item.cans1L !== undefined && (
            <View style={styles.canItem}>
              <Icon name="water-drop" size={16} color={theme.colors.secondary} />
              <Text style={styles.canText}>
                1L Cans: {item.type === 'stock' ? item.cans1L : `-${item.cans1L}`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sideNav}>
        <TouchableOpacity 
          style={styles.sideNavItem} 
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
          style={[styles.sideNavItem, styles.activeNavItem]} 
          onPress={() => navigation.navigate('Reports')}
        >
          <Icon name="assessment" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Activity Reports</Text>
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.filterInputs}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>End Date:</Text>
              <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
          </View>
          <View style={styles.filterButtons}>
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={handleFilter}
            >
              <Text style={styles.filterButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            {filterActive && (
              <TouchableOpacity 
                style={[styles.filterButton, styles.clearButton]} 
                onPress={clearFilter}
              >
                <Text style={styles.filterButtonText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <FlatList
              data={filteredActivities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No activities found</Text>
              }
              showsVerticalScrollIndicator={true}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:40,
    flex: 1,
    paddingTop:12,
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
  sideNavItem: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 1,
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
    flexDirection: 'column',flexGrow: 1, // Allow content to grow dynamically
    height: 'auto',
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingBottom: 100,
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
  userText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  placeText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
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
  filterContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    borderRadius: theme.roundness.medium,
    ...theme.shadows.small,
  },
  filterInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    padding:2,
    flex: 1,
    marginHorizontal: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.small,
    padding: 3,
    color: theme.colors.text,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.roundness.small,
    marginLeft: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: theme.colors.error,
  },
});

export default Reports;