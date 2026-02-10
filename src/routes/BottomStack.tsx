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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../assets/colors';
import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoreDetails from '../screens/mainScreens/UserStack/StoreDetails';
import Jobs from '../screens/mainScreens/DayCareStack/Jobs';
import Chat from '../screens/mainScreens/DayCareStack/Chat';
import Profile from '../screens/mainScreens/DayCareStack/Profile';
import Filter from '../screens/commonScreens/Filter';
import ViewBookings from '../screens/mainScreens/UserStack/ViewBookings';
import Shop from '../screens/mainScreens/UserStack/shop/Shop';
import ProductDetails from '../screens/mainScreens/UserStack/shop/ProductDetails';
import MyCart from '../screens/mainScreens/UserStack/shop/MyCart';
import Checkout from '../screens/mainScreens/UserStack/shop/Checkout';
import ChangeDetails from '../screens/mainScreens/UserStack/shop/ChangeDetails';
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

function UserBottomStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          margin: 0,
          height: responsiveHeight(7),
          alignItems: 'center',
          justifyContent: 'center',
          borderTopRightRadius: responsiveHeight(4),
          borderTopLeftRadius: responsiveHeight(4),
        },
      }}>
      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <AntDesign
                name="home"
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="HomeStack"
        component={HomeStack}
      />

      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <MaterialIcons
                name={'storefront'}
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    alignSelf: 'center',
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="Shop"
        component={ShopStack}
      />

      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <Feather
                name={'shopping-cart'}
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    alignSelf: 'center',
                    left: 3,
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="Bookings"
        component={ViewBookings}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <View style={styles.bottomTabs}>
              <Feather
                name="user"
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        }}
        name="UserProfile"
        component={UserProfile}
      />
    </Tab.Navigator>
  );
}

function DayCareBottomStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          margin: 0,
          height: responsiveHeight(7),
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <AntDesign
                name="home"
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="Home"
        component={DayCareHome}
      />

      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <Ionicons
                name={'bag-handle-outline'}
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    alignSelf: 'center',
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="Jobs"
        component={Jobs}
      />

      <Tab.Screen
        options={({route}) => ({
          tabBarIcon: ({focused, size}) => (
            <View style={styles.bottomTabs}>
              <Ionicons
                name={'chatbox-ellipses-outline'}
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    alignSelf: 'center',
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        })}
        name="Chat"
        component={Chat}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <View style={styles.bottomTabs}>
              <Feather
                name="user"
                size={25}
                color={focused ? '#554292' : '#BFBFBF'}
              />
              {focused && (
                <View
                  style={{
                    height: 2,
                    marginTop: 3,
                    width: responsiveWidth(4),
                    backgroundColor: Colors.themeText,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export {UserBottomStack, DayCareBottomStack};

const styles = StyleSheet.create({
  bottomTabs: {
    alignItems: 'center',
    position: 'relative',
    top: responsiveHeight(1),
  },
});
