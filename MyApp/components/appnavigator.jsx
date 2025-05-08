import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import Profile from "./profile"; // Create Profile.jsx
import MyOrders from "./myorders"; // Create MyOrders.jsx
import AdminDashboard from "./adminDashboard";
import ManageUsers from "./manageUsers";
import ReportDelivery from "./ReportDelivery";
import Reports from "./Reports";
import Orders from "./Orders";
import UserOrders from "./UserOrders";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrders" component={MyOrders} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ headerShown: false }} />
        <Stack.Screen name="ReportDelivery" component={ReportDelivery} options={{ headerShown: false }} />
        <Stack.Screen name="Reports" component={Reports} options={{ headerShown: false }} />
        <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
        <Stack.Screen name="UserOrders" component={UserOrders} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
