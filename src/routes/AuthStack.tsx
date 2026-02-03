import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/authScreens/Login';
import Register from '../screens/authScreens/Register';
import ForgotPass from '../screens/authScreens/ForgotPass';
import Otp from '../screens/authScreens/Otp';
import ResetPass from '../screens/authScreens/ResetPass';
import SelectType from '../screens/authScreens/SelectType';
type authParams = {
  Login:undefined,
  Signup:undefined,
  ForgotPass:undefined,
  Otp:undefined,
  ResetPass:undefined,
  SelectType:undefined,
}

const Stack = createNativeStackNavigator<authParams>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Register} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="ResetPass" component={ResetPass} />
      <Stack.Screen name="SelectType" component={SelectType} />
    </Stack.Navigator>
  );
}
