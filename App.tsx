import React, {useEffect} from 'react';
import {Routes} from './src/routes/Routes';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaView} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '590049783523-7s2k6cb3d4sfrv4tp1i91es5j7mrvf59.apps.googleusercontent.com',
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={{flex: 1}}>
            <Routes />
          </SafeAreaView>
          <Toast />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
