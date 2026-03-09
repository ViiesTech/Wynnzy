import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {backWhite, edit, notification} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {Colors} from '../assets/colors';
import {useSelector} from 'react-redux';
import {ImageBaseUrl} from '../BaseUrl';
import {NormalText} from './Titles';

const UserHeader = ({
  home,
  title,
  whiteTitle,
  bellIcon,
  editProfile,
  navigation,
  centerText = false,
  backIcon = false,
}: any) => {
  const {userData} = useSelector((state: any) => state.user);
  const {profileImage, fullName} = userData || {};

  return (
    <View
      style={[
        styles.headerView,
        {justifyContent: centerText ? 'center' : 'space-between'},
      ]}>
      <View style={centerText ? styles.absoluteLeft : null}>
        {home && (
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: profileImage
                  ? `${ImageBaseUrl}${profileImage}`
                  : 'https://via.placeholder.com/150',
              }}
              style={styles.profileImage as any}
            />
            <View style={styles.nameContainer}>
              <NormalText
                title="Hello,"
                fontSize={responsiveFontSize(1.8)}
                color="#666"
              />
              <NormalText
                title={fullName || 'Guest'}
                fontWeight="700"
                fontSize={responsiveFontSize(2.2)}
              />
            </View>
          </View>
        )}
        {backIcon && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonContainer}>
            <SvgIcons xml={backWhite} height={20} width={20} />
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <NormalText
          title={title}
          color={whiteTitle ? Colors.white : Colors.labelText}
          alignSelf="center"
          fontWeight="900"
          fontSize={responsiveFontSize(2.7)}
        />
      )}

      <View
        style={[
          styles.rightIconsContainer,
          centerText && styles.absoluteRight,
        ]}>
        {bellIcon && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.notificationContainer}>
            <SvgIcons xml={notification} height={25} width={25} />
          </TouchableOpacity>
        )}

        {editProfile && (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditUserProfile')}
            style={styles.editContainer}>
            <SvgIcons xml={edit} height={25} width={25} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  headerView: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  profileImage: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    borderRadius: responsiveHeight(3),
    backgroundColor: '#f0f0f0',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
    // backgroundColor: 'red',
  },
  notificationContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButtonContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
  },
  editContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  absoluteLeft: {
    position: 'absolute',
    left: responsiveWidth(4),
    zIndex: 10,
  },
  absoluteRight: {
    position: 'absolute',
    right: responsiveWidth(4),
    zIndex: 10,
  },
});
