import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DayCareBottomStack } from './BottomStack';
import CreateBussProfile from '../screens/mainScreens/DayCareStack/CreateBussProfile';
import CreateProfile from '../screens/mainScreens/DayCareStack/CreateProfile';
import Submit from '../screens/mainScreens/DayCareStack/Submit';
import Filter from '../screens/commonScreens/Filter';
import FilterDetail from '../screens/mainScreens/DayCareStack/FilterDetail';
import Notification from '../screens/commonScreens/Notification';
import Reviews from '../screens/commonScreens/Reviews';
import { useSelector } from 'react-redux';
import ReviewDetails from '../screens/commonScreens/ReviewDetails';
import ViewOrders from '../screens/mainScreens/DayCareStack/ViewOrders';
import ViewBookedServices from '../screens/commonScreens/ViewBookedServices';
// Define types for the navigation parameters
type DayCareStackParams = {
  BottomStack: undefined;
  CreateBussProfile: undefined;
  CreateProfile: undefined;
  Filter: undefined;
  Filter2: undefined;
};

const Stack = createNativeStackNavigator<DayCareStackParams>();

export function DayCareStack() {
  const { profileCreated } = useSelector(state => state?.user?.userData);
  // console.log('profileCreated', profileCreated);
  return (
    <Stack.Navigator initialRouteName={profileCreated ? 'BottomStack' : 'CreateProfile'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomStack" component={DayCareBottomStack} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Submit" component={Submit} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="Filter" component={Filter} />
      {/* <Stack.Screen name="Map" component={Map} /> */}
      <Stack.Screen name="FilterDetail" component={FilterDetail} />
      <Stack.Screen name="ViewBookedServices" component={ViewBookedServices} />
      <Stack.Screen name="ViewOrders" component={ViewOrders} />
      <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="CreateBussProfile" component={CreateBussProfile} />

    </Stack.Navigator>
  );
}
