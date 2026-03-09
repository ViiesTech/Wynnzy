import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {images} from '../../../assets/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../../assets/colors';
import {Button} from '../../../Components/Button';
import {clearToken} from '../../../redux/Slices';
import {useDispatch, useSelector} from 'react-redux';
import {getAllPets} from '../../../GlobalFunctions/Auth';
import {ImageBaseUrl} from '../../../BaseUrl';
import {useIsFocused} from '@react-navigation/native';
import UserHeader from '../../../Components/UserHeader';

const UserProfile: React.FC = ({navigation}: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user?.userData);
  const {profileImage, fullName, _id} = userData || {};

  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const getAllPetsHandler = async () => {
    try {
      const response = await getAllPets(_id);
      setData(response?.data || []);
    } catch (error) {
      console.log('Error fetching pets:', error);
    }
  };

  useEffect(() => {
    if (isFocused && _id) {
      getAllPetsHandler();
    }
  }, [isFocused, _id]);

  const renderHeader = () => (
    <Fragment>
      <View style={styles.backIconContainer}>
        <UserHeader
          title="Profile"
          navigation={navigation}
          centerText={true}
          editProfile={true}
          whiteTitle={true}
        />
      </View>
      <Image source={images.cover} style={styles.coverImage} />
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImage
              ? {uri: `${ImageBaseUrl}${profileImage}`}
              : images.userDummy
          }
          style={styles.profileImage}
        />
      </View>
      <View style={styles.spacer} />
      <Text style={styles.userName}>{fullName}</Text>

      <View style={styles.myPetsContainer}>
        <Text style={[styles.myPetsText]}>My Pets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPetProfile')}
          style={styles.addPet}>
          <Text style={styles.addPetText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.petItem}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PetProfile', {_id: item?._id})}>
        <Image
          source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
          style={styles.petImage}
        />
        <View style={styles.editIconContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddPetProfile', {
                petId: item?._id,
              })
            }
            style={styles.editIcon}>
            <MaterialIcons
              name={'edit'}
              size={responsiveFontSize(1.8)}
              color={'#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.petNameContainer}>
          <Text style={styles.petName}>{item?.petName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item?._id || index.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
      <View style={styles.footerContainer}>
        <Button
          handlePress={() => dispatch(clearToken())}
          title="Logout"
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
          width={responsiveWidth(90)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
  },
  backIconContainer: {
    position: 'absolute',
    zIndex: 10,
    top: 10,
    width: '100%',
  },
  coverImage: {
    height: responsiveHeight(25),
    width: responsiveWidth(100),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    height: responsiveHeight(14),
    width: responsiveHeight(14),
    alignSelf: 'center',
    marginTop: responsiveHeight(-7),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    height: responsiveHeight(14),
    width: responsiveHeight(14),
    borderRadius: responsiveHeight(7),
    borderWidth: 4,
    borderColor: Colors.white,
  },
  spacer: {height: responsiveHeight(2)},
  userName: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '900',
    color: Colors.labelText,
  },
  petItem: {
    width: responsiveWidth(43),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  petImage: {
    height: responsiveHeight(18),
    width: '100%',
    backgroundColor: Colors.lightGray,
  },
  editIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  editIcon: {
    backgroundColor: Colors.buttonBg,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  petNameContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
  },
  petName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
  },
  myPetsContainer: {
    height: 45,
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: responsiveHeight(1),
    // backgroundColor: 'red',
  },
  myPetsText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    color: Colors.labelText,
  },
  footerContainer: {
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addPet: {
    height: 30,
    width: 75,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonBg,
  },
  addPetText: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.white,
  },
});

export default UserProfile;
