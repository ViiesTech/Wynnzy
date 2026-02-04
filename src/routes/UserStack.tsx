import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Location from '../screens/mainScreens/UserStack/Location';
import Filter from '../screens/commonScreens/Filter';
import Create_Pet_Profile from '../screens/mainScreens/UserStack/Create_Pet_Profile';
import Hotel from '../screens/mainScreens/UserStack/Hotel';
import ServiceDetail from '../screens/mainScreens/UserStack/ServiceDetail';
import PaymentMethod from '../screens/mainScreens/UserStack/PaymentMethod';
import AddNewCard from '../screens/mainScreens/UserStack/AddNewCard';
import Transfer_Successfully from '../screens/mainScreens/UserStack/Transfer_Successfully';
import StoreDetails from '../screens/mainScreens/UserStack/StoreDetails';
import ZipCode from '../screens/mainScreens/UserStack/ZipCode';
import Payment from '../screens/mainScreens/UserStack/Payment';
import PetProfile from '../screens/mainScreens/UserStack/PetProfile';
import UserProfile from '../screens/mainScreens/UserStack/UserProfile';
import {UserBottomStack} from './BottomStack';
import Filter2 from '../screens/mainScreens/UserStack/Filter2';
import Notification from '../screens/commonScreens/Notification';
import Reviews from '../screens/commonScreens/Reviews';
import EditUserProfile from '../screens/mainScreens/UserStack/EditUserProfile';
import AllHotels from '../screens/mainScreens/UserStack/AllHotels';
import AllServices from '../screens/mainScreens/UserStack/AllServices';
import ViewBookedServices from '../screens/commonScreens/ViewBookedServices';
import ReviewDetails from '../screens/commonScreens/ReviewDetails';

type UserStackParams = {
  BottomStack: undefined;
  Location: undefined;
  Filter: undefined;
  Filter2: undefined;
  StoreDetails: undefined;
  CreateProfile: undefined;
  ZipCode: undefined;
  Reviews: undefined;
  PetProfile: undefined;
  UserProfile: undefined;
  Notification: undefined;
  Hotel: undefined;
  Booking: undefined;
  PaymentMethod: undefined;
  AddCard: undefined;
  Payment: undefined;
  TransferSuccessfully: undefined;
};

const Stack = createNativeStackNavigator<UserStackParams>(); // Use the typed navigator

export function UserStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomStack" component={UserBottomStack} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="Filter2" component={Filter2} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
      <Stack.Screen name="CreateProfile" component={Create_Pet_Profile} />
      <Stack.Screen name="ZipCode" component={ZipCode} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Hotel" component={Hotel} />
      <Stack.Screen name="ViewBookedServices" component={ViewBookedServices} />
      <Stack.Screen name="AllHotels" component={AllHotels} />
      <Stack.Screen name="AllServices" component={AllServices} />
      <Stack.Screen name="Booking" component={ServiceDetail} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="AddCard" component={AddNewCard} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
      <Stack.Screen
        name="TransferSuccessfully"
        component={Transfer_Successfully}
      />
    </Stack.Navigator>
  );
}
