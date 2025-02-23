import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://192.168.137.39:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender, phone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "User registered successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.error || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="water-drop" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
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
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="Enter your gender"
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: 20,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 5,
    
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
  signupButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.background,
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: theme.colors.secondary,
  },
  loginTextBold: {
    fontWeight: "bold",
  },
};

export default Signup;
