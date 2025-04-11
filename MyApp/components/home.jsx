import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="water-drop" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Welcome to Water Supply</Text>
          <Text style={styles.subtitle}>Choose an action to get started</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReportDelivery')}
          >
            <Icon name="local-shipping" size={32} color={theme.colors.surface} />
            <Text style={styles.buttonText}>Report Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('MyOrders')}
          >
            <Icon name="shopping-cart" size={32} color={theme.colors.surface} />
            <Text style={styles.buttonText}>My Deliveries</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={24} color={theme.colors.surface} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('MyOrders')}
        >
          <Icon name="list" size={24} color={theme.colors.surface} />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color={theme.colors.surface} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.replace('Login')}
        >
          <Icon name="logout" size={24} color={theme.colors.surface} />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    borderRadius: theme.roundness.medium,
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    color: theme.colors.surface,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  }
});

export default Home;
