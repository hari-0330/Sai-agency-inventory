import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar from './NavBar';
import { ipAddress } from '../ipConfig';

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Users data:', data); // Debug log
      if (response.ok) {
        const filteredUsers = data.users.filter(user => user.phone !== "111");
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Icon name="person" size={24} color="#007AFF" />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userDetail}>Age: {item.age}</Text>
        <Text style={styles.userDetail}>Gender: {item.gender}</Text>
        <Text style={styles.userDetail}>Phone: {item.phone}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sideNav}>
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Icon name="dashboard" size={24} color="#007AFF" />
          <Text style={styles.sideNavText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sideNavItem, styles.activeNavItem]} 
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
        <View style={styles.mainContent}>
          <Text style={styles.title}>Manage Users</Text>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.phone}
            showsVerticalScrollIndicator={true}
            style={styles.flatList}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding:12,
  },
  sideNav: {
    width: 80,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sideNavItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  activeNavItem: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 10,
  },
  sideNavText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  }
});

export default ManageUsers; 