import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import NavBar from './NavBar';

const ReportDelivery = ({ navigation }) => {
  const [deliveryDetails, setDeliveryDetails] = useState({
    cans25L: '0',
    cans10L: '0',
    cans1L: '0',
    deliveryPlace: '',
  });

  const handleSubmitReport = async () => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      const currentTime = new Date();
      const response = await fetch('http://192.168.137.39:5000/api/report-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...deliveryDetails,
          userPhone,
          cans25L: parseInt(deliveryDetails.cans25L),
          cans10L: parseInt(deliveryDetails.cans10L),
          cans1L: parseInt(deliveryDetails.cans1L),
          timestamp: currentTime,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Delivery report submitted and stock updated successfully!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Icon name="local-shipping" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Report Delivery</Text>
          <Text style={styles.subtitle}>Enter delivery details below</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>25L Cans</Text>
            <View style={styles.inputContainer}>
              <Icon name="water-drop" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deliveryDetails.cans25L}
                onChangeText={(text) => setDeliveryDetails({...deliveryDetails, cans25L: text})}
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>10L Cans</Text>
            <View style={styles.inputContainer}>
              <Icon name="water-drop" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deliveryDetails.cans10L}
                onChangeText={(text) => setDeliveryDetails({...deliveryDetails, cans10L: text})}
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>1L Cans</Text>
            <View style={styles.inputContainer}>
              <Icon name="water-drop" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deliveryDetails.cans1L}
                onChangeText={(text) => setDeliveryDetails({...deliveryDetails, cans1L: text})}
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Place</Text>
            <View style={styles.inputContainer}>
              <Icon name="place" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={deliveryDetails.deliveryPlace}
                onChangeText={(text) => setDeliveryDetails({...deliveryDetails, deliveryPlace: text})}
                placeholder="Enter delivery location"
                placeholderTextColor={theme.colors.secondary}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar navigation={navigation} />
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    padding: 24,
    width: '50%',
    alignSelf: 'center',
    ...theme.shadows.medium,
  },
  inputGroup: {
    marginBottom: 15,
    
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.small,
    backgroundColor: theme.colors.surface,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.small,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportDelivery; 