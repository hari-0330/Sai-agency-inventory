import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import NavBar from './NavBar';

const Profile = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      setEditedDetails({
        name: userDetails.name,
        age: userDetails.age.toString(),
        gender: userDetails.gender
      });
    }
  }, [userDetails]);

  const fetchUserDetails = async () => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      if (!userPhone) {
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`http://192.168.137.39:5000/api/user/profile/${userPhone}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserDetails(data.user);
      } else {
        Alert.alert("Error", "Failed to fetch profile");
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const handleSave = async () => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone');
      const response = await fetch(`http://192.168.137.39:5000/api/user/update/${userPhone}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedDetails.name,
          age: parseInt(editedDetails.age),
          gender: editedDetails.gender
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserDetails({
          ...userDetails,
          ...editedDetails,
          age: parseInt(editedDetails.age)
        });
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="person" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account details</Text>
        </View>

        {userDetails ? (
          <View style={styles.card}>
            {!isEditing ? (
              <>
                <View style={styles.profileItem}>
                  <Icon name="person-outline" size={24} color={theme.colors.secondary} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{userDetails.name}</Text>
                  </View>
                </View>

                <View style={styles.profileItem}>
                  <Icon name="cake" size={24} color={theme.colors.secondary} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.value}>{userDetails.age}</Text>
                  </View>
                </View>

                <View style={styles.profileItem}>
                  <Icon name="wc" size={24} color={theme.colors.secondary} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.label}>Gender</Text>
                    <Text style={styles.value}>{userDetails.gender}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => {
                    setIsEditing(true);
                    setEditedDetails(userDetails);
                  }}
                >
                  <Icon name="edit" size={20} color={theme.colors.surface} />
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editedDetails.name}
                      onChangeText={(text) => setEditedDetails({...editedDetails, name: text})}
                      placeholder="Enter your name"
                      placeholderTextColor={theme.colors.secondary}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="cake" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editedDetails.age}
                      onChangeText={(text) => setEditedDetails({...editedDetails, age: text})}
                      keyboardType="numeric"
                      placeholder="Enter your age"
                      placeholderTextColor={theme.colors.secondary}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="wc" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editedDetails.gender}
                      onChangeText={(text) => setEditedDetails({...editedDetails, gender: text})}
                      placeholder="Enter your gender"
                      placeholderTextColor={theme.colors.secondary}
                    />
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
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
              </>
            )}
          </View>
        ) : (
          <Text style={styles.loading}>Loading...</Text>
        )}
      </View>
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
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
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
  editButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: theme.roundness.small,
    marginTop: 24,
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
    marginLeft: 8,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.secondary,
  }
});

export default Profile;