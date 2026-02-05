/* eslint-disable react-native/no-inline-styles */
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {responsiveHeight} from '../assets/responsive_dimensions';
import {dropDownBlue, filter2, menu, notifyTheme, share} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {Colors} from '../assets/colors';
import BackIcon from './BackIcon';
import {NormalText} from './Titles';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface Header3Props {
  rightIcon?: string;
  firstRightIcon?: boolean;
  textContainer?: boolean;
  onEditPress?: () => void;
}
const Header2 = ({handlePress}) => {
  return (
    <TouchableOpacity
      onPress={() => Alert.alert('working')}
      style={styles.headerView}>
      <BackIcon handlePress={handlePress} />
      <TouchableOpacity style={styles.backView}>
        <SvgIcons xml={share} height={20} width={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const Header3: React.FC<Header3Props> = ({
  textContainer = true,
  rightIcon,
  firstRightIcon = true,
  onEditPress,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: responsiveHeight(2),
        }}>
        <TouchableOpacity>
          <SvgIcons xml={menu} height={25} width={25} />
        </TouchableOpacity>
        {textContainer && (
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(1),
              }}>
              <NormalText color="grey" title="My location" />
              <TouchableOpacity>
                {/* <SvgIcons xml={dropDownBlue} height={10} width={10} /> */}
                <Ionicons
                  name="chevron-down-outline"
                  color={Colors.buttonBg}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            <NormalText
              fontWeight="700"
              color={'#131e5e'}
              title="location street, ID"
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: responsiveHeight(1.5),
        }}>
        {firstRightIcon && (
          <TouchableOpacity>
            <SvgIcons xml={filter2} height={30} width={30} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onEditPress}>
          <SvgIcons
            xml={rightIcon ? rightIcon : notifyTheme}
            height={30}
            width={30}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Header2;

const styles = StyleSheet.create({
  headerView: {
    position: 'absolute',
    flexDirection: 'row',
    top: responsiveHeight(3),
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backView: {
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
