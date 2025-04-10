import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import { ipAddress } from "../ipConfig";

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Check for admin credentials first
      if (phone === "111" && password === "admin") {
        Alert.alert("Success", "Admin Login Successful!");
        console.log("Navigating to Admin Dashboard...");
        navigation.replace("AdminDashboard");
        return;
      }

      // Regular user login
      const response = await fetch(`http://${ipAddress}:5000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        // Store user's phone number in AsyncStorage
        await AsyncStorage.setItem('userPhone', phone);
        Alert.alert("Success", "Login Successful!");
        console.log("Navigating to Home...");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Server connection failed!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="water-drop" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Water Supply</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
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
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupLink} 
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 20,
    height:'100%',
    width:'100%',
    alignItems:'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    padding: 12,
    width: "80%",
    height: "70%",
    alignSelf: "center",
    ...theme.shadows.medium,
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
  inputGroup: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.small,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  signupTextBold: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default Login;