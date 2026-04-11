import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors} from '../assets/colors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {mapAPIKey} from '../BaseUrl';

const GooglePlaces = ({
  onAddressSelect,
  placeholder = 'Address',
}: {
  onAddressSelect: (address: string) => void;
  placeholder?: string;
}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      minLength={3}
      debounce={200}
      nearbyPlacesAPI="GooglePlacesSearch"
      onPress={(data, details = null) => {
        onAddressSelect(data.description);
      }}
      onFail={error => console.error('GooglePlaces Error:', error)}
      query={{
        key: mapAPIKey,
        language: 'en',
      }}
      textInputProps={{
        placeholderTextColor: '#CCCCCC',
      }}
      styles={{
        container: {
          flex: 0,
        },
        textInput: {
          height: 50,
          color: Colors.black,
          fontSize: responsiveHeight(2),
          borderColor: '#EEEEEE',
          borderWidth: 2,
          borderRadius: responsiveHeight(1),
          paddingHorizontal: responsiveWidth(3),
          backgroundColor: Colors.white,
        },
        listView: {
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: '#EEEEEE',
          borderRadius: 5,
          elevation: 5,
          zIndex: 999,
        },
      }}
    />
  );
};

export default GooglePlaces;
