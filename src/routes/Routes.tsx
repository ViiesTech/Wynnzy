import React, {useEffect} from 'react';
import {AuthStack} from './AuthStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {UserStack} from './UserStack';
import {DayCareStack} from './DayCareStack';
import {useDispatch, useSelector} from 'react-redux';
import {clearToken} from '../redux/Slices';
type routeParams = {
  authStack: undefined;
  dayCareStack: undefined;
  userStack: undefined;
};

const Stack = createNativeStackNavigator<routeParams>();

export function Routes() {
  const {userData, token} = useSelector(state => state.user);

  // console.log('userData in Routes:-', userData);
  // console.log('token in Routes:-', token);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!token ? (
          <Stack.Screen name="authStack" component={AuthStack} />
        ) : userData?.type === 'User' ? (
          <Stack.Screen name="userStack" component={UserStack} />
        ) : (
          <Stack.Screen name="dayCareStack" component={DayCareStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
