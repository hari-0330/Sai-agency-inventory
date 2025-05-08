import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from '../styles/theme';
import NavBar from './NavBar';
import { ipAddress } from '../ipConfig';

// Dummy data for development


const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  // Form state
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [cans25L, setCans25L] = useState('0');
  const [cans10L, setCans10L] = useState('0');
  const [cans1L, setCans1L] = useState('0');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Update the IP address to match your server address
      const response = await fetch(`http://${ipAddress}:5000/api/orders`);
      
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        // Use dummy data while developing
        setOrders(DUMMY_ORDERS);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use dummy data on error
      setOrders(DUMMY_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDatePicker(false);
    setDeliveryDate(currentDate);
  };

  const resetForm = () => {
    setDeliveryPlace('');
    setCans25L('0');
    setCans10L('0');
    setCans1L('0');
    setDeliveryDate(new Date());
    setCurrentOrder(null);
    setEditMode(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (order) => {
    setCurrentOrder(order);
    setDeliveryPlace(order.deliveryPlace);
    setCans25L(order.cans25L.toString());
    setCans10L(order.cans10L.toString());
    setCans1L(order.cans1L.toString());
    setDeliveryDate(new Date(order.deliveryDate));
    setEditMode(true);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!deliveryPlace.trim()) {
      Alert.alert('Error', 'Please enter delivery place');
      return;
    }

    const orderData = {
      deliveryPlace,
      cans25L: parseInt(cans25L) || 0,
      cans10L: parseInt(cans10L) || 0,
      cans1L: parseInt(cans1L) || 0,
      deliveryDate: deliveryDate.toISOString()
    };

    try {
      let response;
      
      if (editMode && currentOrder) {
        // Update existing order
        response = await fetch(`http://${ipAddress}:5000/api/orders/${currentOrder._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      } else {
        // Create new order
        response = await fetch(`http://${ipAddress}:5000/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      }

      if (!response.ok) {
        let errorText = `Failed to ${editMode ? 'update' : 'create'} order (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorText;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        Alert.alert('Error', errorText);
        return;
      }

      const result = await response.json();
      
      // For development, we'll simulate success even if the API is not available
      if (editMode) {
        // Update order in local state
        setOrders(orders.map(order => 
          order._id === currentOrder._id ? 
            { ...orderData, _id: currentOrder._id } : 
            order
        ));
      } else {
        // Add new order to local state with a temporary ID
        const newOrder = { 
          ...orderData, 
          _id: result.order?._id || `temp-${Date.now()}`
        };
        setOrders([...orders, newOrder]);
      }

      setModalVisible(false);
      resetForm();
      Alert.alert('Success', editMode ? 'Order updated successfully' : 'Order added successfully');
      
    } catch (error) {
      console.error('Error processing order:', error);
      
      // If there's a network error, simulate success for development
      if (editMode) {
        // Update order in local state
        setOrders(orders.map(order => 
          order._id === currentOrder._id ? 
            { ...orderData, _id: currentOrder._id } : 
            order
        ));
      } else {
        // Add new order to local state with a temporary ID
        const newOrder = { 
          ...orderData, 
          _id: `temp-${Date.now()}`
        };
        setOrders([...orders, newOrder]);
      }

      setModalVisible(false);
      resetForm();
      Alert.alert('Development Mode', editMode ? 'Order updated in local state' : 'Order added to local state');
    }
  };

  const handleDelete = async (orderId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://${ipAddress}:5000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
              });

              if (response.ok) {
                // Immediately update the UI
                setOrders(currentOrders => currentOrders.filter(order => order._id !== orderId));
                Alert.alert('Success', 'Order deleted successfully');
              } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete order');
              }
            } catch (error) {
              console.error('Error deleting order:', error);
              Alert.alert(
                'Error',
                'Failed to delete order. Please try again.'
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.headerLeft}>
          <Icon name="local-shipping" size={24} color={theme.colors.primary} />
          <Text style={styles.dateText}>
            {new Date(item.deliveryDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Icon name="edit" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item._id)}
          >
            <Icon name="delete" size={20} color="#FF4040" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.orderContent}>
        <Text style={styles.placeText}>Deliver to: {item.deliveryPlace}</Text>
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
          style={[styles.sideNavItem, styles.activeNavItem]} 
          onPress={() => navigation.navigate('ManageOrders')}
        >
          <Icon name="shopping-cart" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sideNavItem} 
          onPress={() => navigation.navigate('Reports')}
        >
          <Icon name="assessment" size={24} color={theme.colors.primary} />
          <Text style={styles.sideNavText}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerWithAction}>
          <View>
            <Text style={styles.title}>Orders To-Do List</Text>
            <Text style={styles.subtitle}>Manage and track orders for delivery</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={openAddModal}
          >
            <Icon name="add" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>New Order</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No orders found</Text>
            }
          />
        )}
      </View>

      {/* Add/Edit Order Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Order' : 'Add New Order'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Delivery Place</Text>
              <TextInput
                style={styles.input}
                value={deliveryPlace}
                onChangeText={setDeliveryPlace}
                placeholder="Enter delivery address"
                placeholderTextColor={theme.colors.secondary}
              />
              
              <Text style={styles.inputLabel}>Delivery Date</Text>
              {Platform.OS === 'web' ? (
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={deliveryDate.toISOString().split('T')[0]}
                  onChangeText={(text) => {
                    const date = new Date(text);
                    if (!isNaN(date.getTime())) {
                      setDeliveryDate(date);
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {deliveryDate.toLocaleDateString()}
                    </Text>
                    <Icon name="calendar-today" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={deliveryDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setDeliveryDate(selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                </>
              )}
              
              <Text style={styles.sectionTitle}>Water Cans</Text>
              
              <View style={styles.canInputRow}>
                <Text style={styles.canInputLabel}>25L Cans:</Text>
                <TextInput
                  style={styles.canInput}
                  value={cans25L}
                  onChangeText={setCans25L}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.secondary}
                />
              </View>
              
              <View style={styles.canInputRow}>
                <Text style={styles.canInputLabel}>10L Cans:</Text>
                <TextInput
                  style={styles.canInput}
                  value={cans10L}
                  onChangeText={setCans10L}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.secondary}
                />
              </View>
              
              <View style={styles.canInputRow}>
                <Text style={styles.canInputLabel}>1L Cans:</Text>
                <TextInput
                  style={styles.canInput}
                  value={cans1L}
                  onChangeText={setCans1L}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.secondary}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.saveButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>{editMode ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  sideNav: {
    marginTop:40,
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
    padding: 24,
  },
  headerWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    paddingTop:40,
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop:90,
    borderRadius: theme.roundness.small,
    ...theme.shadows.small,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  orderContent: {
    padding: 16,
  },
  placeText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  canDetails: {
    marginTop: 8,
  },
  canItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    ...theme.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: theme.roundness.small,
    marginBottom: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: theme.roundness.small,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 16,
  },
  canInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  canInputLabel: {
    fontSize: 16,
    color: theme.colors.text,
    width: '30%',
  },
  canInput: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: theme.roundness.small,
    flex: 1,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.roundness.small,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  dateInput: {
    height: 40,
    marginBottom: 16,
  },
});

export default Orders; 