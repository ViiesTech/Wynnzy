/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';

interface PickerProps {
  mrgnTop?: number;
  placeHolder?: string;
  items?: any;
  setItems?: any;
  value?: any;
  setValue?: any;
  zIndexValue?: number;
  shadow?: boolean;
  multiple?: boolean;
}

const PickerCard: React.FC<PickerProps> = ({
  mrgnTop,
  placeHolder,
  items,
  setItems,
  value,
  setValue,
  zIndexValue = 1000,
  shadow = false,
  multiple = true,
}) => {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState<string | null>(null);
  // const [items, setItems] = useState([
  //   { label: 'Service 1', value: 'service1' },
  //   { label: 'Service 2', value: 'service2' },
  //   { label: 'Service 3', value: 'service3' },
  // ]);

  return (
    <View style={[styles.container, {marginTop: mrgnTop, zIndex: zIndexValue}]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeHolder ? placeHolder : 'Select Service'}
        placeholderStyle={{color: '#808CA0'}}
        multiple={multiple}
        mode="BADGE"
        badgeTextStyle={{color: Colors.white}}
        badgeDotColors={Colors.white}
        badgeColors={Colors.buttonBg}
        style={[styles.dropdown, shadow && styles.shadow]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          {zIndex: open ? 2000 : 1},
        ]} // Adjusting zIndex based on open state
        textStyle={styles.textStyle}
        zIndex={zIndexValue}
      />
      {/* {value && <Text style={styles.selectedText}>Selected: {value}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  label: {
    fontSize: 18, // Customize size as needed
    color: '#000', // Label color
    marginBottom: 8, // Space between label and dropdown
  },
  dropdown: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderRadius: 8,
    height: responsiveHeight(7.5),
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute', // Ensure the dropdown is positioned above other elements
    top: responsiveHeight(7.5), // Adjust top positioning if needed
  },
  textStyle: {
    fontSize: 16,
    color: '#3B4B68',
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3B4B68',
  },
  shadow: {
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PickerCard;
