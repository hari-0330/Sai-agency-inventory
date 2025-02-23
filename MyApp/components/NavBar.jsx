import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const NavBar = ({ navigation, isAdmin }) => {
  if (isAdmin) {
    return (
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('ManageOrders')}
        >
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('MyOrders')}
      >
        <Text style={styles.navText}>Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default NavBar; 