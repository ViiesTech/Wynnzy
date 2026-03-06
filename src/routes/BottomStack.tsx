import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Store from '../screens/mainScreens/UserStack/Store';
import Home from '../screens/mainScreens/UserStack/Home';
import DayCareHome from '../screens/mainScreens/DayCareStack/Home';
import UserProfile from '../screens/mainScreens/UserStack/UserProfile';
import {
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../assets/colors';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '../screens/mainScreens/DayCareStack/Profile';
import ViewBookings from '../screens/mainScreens/UserStack/ViewBookings';
import Shop from '../screens/mainScreens/UserStack/shop/Shop';
import ProductDetails from '../screens/mainScreens/UserStack/shop/ProductDetails';
import MyCart from '../screens/mainScreens/UserStack/shop/MyCart';
import Checkout from '../screens/mainScreens/UserStack/shop/Checkout';
import ChangeDetails from '../screens/mainScreens/UserStack/shop/ChangeDetails';
import Orders from '../screens/mainScreens/DayCareStack/Orders';
import Inbox from '../screens/mainScreens/DayCareStack/Inbox';
import UserInbox from '../screens/mainScreens/UserStack/UserInbox';
// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Stack Component
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.white,
        },
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Home2" component={Store} />
    </Stack.Navigator>
  );
};

const ShopStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.white,
        },
        headerShown: false,
      }}>
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="ChangeDetails" component={ChangeDetails} />
    </Stack.Navigator>
  );
};

const UserBottomStack = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <AntDesign
                  name="home"
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="Bookings"
          component={ViewBookings}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <Feather
                  name={'shopping-cart'}
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(true)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="Shop"
          component={ShopStack}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <MaterialIcons
                  name={'storefront'}
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="UserInbox"
          component={UserInbox}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <Ionicons
                  name={'chatbox-ellipses-outline'}
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            tabBarIcon: ({focused}: {focused: boolean}) => (
              <View style={styles.bottomTabs}>
                <Feather
                  name="user"
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const DayCareBottomStack = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
        }}>
        <Tab.Screen
          name="Home"
          component={DayCareHome}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <AntDesign
                  name="home"
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="Orders"
          component={Orders}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <Octicons
                  name={'checklist'}
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="Inbox"
          component={Inbox}
          options={({route}) => ({
            tabBarIcon: ({focused, size}) => (
              <View style={styles.bottomTabs}>
                <Ionicons
                  name={'chatbox-ellipses-outline'}
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          })}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}: {focused: boolean}) => (
              <View style={styles.bottomTabs}>
                <Feather
                  name="user"
                  size={25}
                  color={focused ? '#554292' : '#BFBFBF'}
                />
                {focused && <View style={focusedStyle(false)} />}
              </View>
            ),
            tabBarShowLabel: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export {UserBottomStack, DayCareBottomStack};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bottomTabs: {
    alignItems: 'center',
    position: 'relative',
    top: responsiveHeight(1),
  },
  tabBarStyle: {
    backgroundColor: Colors.white,
    margin: 0,
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: responsiveHeight(4),
    borderTopLeftRadius: responsiveHeight(4),
  },
});

const focusedStyle = (bool: boolean): ViewStyle => ({
  height: 2,
  marginTop: 3,
  alignSelf: 'center',
  width: responsiveWidth(4),
  backgroundColor: Colors.themeText,
  left: bool ? 3 : 0,
});
