/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images} from '../../../assets/images';
import Header2 from '../../../Components/Header2';
import {heart, rating} from '../../../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import SvgIcons from '../../../Components/SvgIcons';
import {Colors} from '../../../assets/colors';
import ServiceCard from '../../../Components/ServicesCard';
import {Button} from '../../../Components/Button';
import {
  getAllServicesByManagerId,
  getBusinessProfileById,
} from '../../../GlobalFunctions';
import {getBusinessProfile, ShowToast} from '../../../GlobalFunctions/Auth';
import {ImageBaseUrl} from '../../../BaseUrl';
import {NormalText} from '../../../Components/Titles';

interface galleryImagesTypes {
  id: number;
  image: ImageSourcePropType;
}

const galleryImages: galleryImagesTypes[] = [
  {
    id: 1,
    image: images.storedetail2,
  },
  {
    id: 2,
    image: images.storedetail3,
  },
  {
    id: 3,
    image: images.storedetail4,
  },
];

const StoreDetails = ({navigation, route}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [storeDetails, setStoreDetails] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {_id, managerId} = route?.params;
  const [currentService, setCurrentService] = useState();

  useEffect(() => {
    fetchBusinessProfileHandler();
    fetchAllServices();
  }, []);

  const fetchBusinessProfileHandler = async () => {
    const response = await getBusinessProfile(_id);
    console.log('rsponse', response);
    setStoreDetails(response.data);
  };

  const fetchAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await getAllServicesByManagerId(managerId);
      setServices(response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      ShowToast('error', err?.response?.data?.message);
      console.log('categoriess', response.data);
    }
  };

  console.log('storeDetails:-', JSON.stringify(storeDetails));
  return (
    <View style={styles.container}>
      <Image
        source={
          storeDetails?.image?.length > 0
            ? {uri: `${ImageBaseUrl}${storeDetails?.image?.[0]}`}
            : images.storedetail1
        }
        style={styles.backImage}
      />
      <Header2 />
      <View
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          flex: 1,
          bottom: 10,
          backgroundColor: Colors.white,
          zIndex: 10,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.storeView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.heading}>{storeDetails?.businessName}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Reviews', {
                    type: 'user',
                    managerId: storeDetails?.managerId,
                    ratings: storeDetails?.ratings,
                    totalReviews: storeDetails?.totalreviews,
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: responsiveHeight(1),
                }}>
                <View style={styles.ratingView}>
                  <SvgIcons xml={rating} height={13} width={13} />
                  <Text style={styles.ratingText}>
                    {storeDetails?.ratings || 0}
                  </Text>
                </View>
                <Text style={styles.rating}>Rating</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.heartView}>
              <SvgIcons xml={heart} height={20} width={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.desc}>{storeDetails?.bio}</Text>
          <View style={{paddingTop: responsiveHeight(2)}}>
            <Text style={styles.heading}>Gallery</Text>
            <View style={{marginTop: responsiveHeight(2)}}>
              <FlatList
                data={storeDetails?.image}
                numColumns={2}
                // keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                  <Image
                    source={{uri: `${ImageBaseUrl}${item}`}}
                    borderRadius={15}
                    style={[
                      styles.imageStyle,
                      {
                        width:
                          item.id == 3
                            ? responsiveWidth(92)
                            : responsiveWidth(45),
                      },
                    ]}
                  />
                )}
              />
            </View>
          </View>
          <View style={{paddingTop: responsiveHeight(2)}}>
            <Text style={styles.heading}>Services</Text>
            {/* <ServiceCard
              title="Grooming"
              cardStyle={{ marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2) }}
              price="$1,499.00"
              frequency="Per day"
              imageUrl="https://your-image-link.com/dog.jpg"
              selected={true}
              onPress={() => setSelected(!selected)}
            />
            <ServiceCard
              title="Grooming"
              price="$1,499.00"
              frequency="Per day"
              imageUrl="https://your-image-link.com/dog.jpg"
              selected={true}
              onPress={() => setSelected(!selected)}
            /> */}
            {isLoading ? (
              <View style={{marginTop: responsiveHeight(2)}}>
                <ActivityIndicator size="large" color={Colors.buttonBg} />
              </View>
            ) : services?.length ? (
              <FlatList
                data={services}
                renderItem={({item}) => (
                  <ServiceCard
                    onCardPress={() => setCurrentService(item._id)}
                    title={item?.categoryName}
                    imageUrl={item.image ? item.image : null}
                    selected={currentService === item._id}
                    onPress={() => setSelected(!selected)}
                  />
                )}
                keyExtractor={item => item._id.toString()}
              />
            ) : (
              <NormalText
                mrgnTop={responsiveHeight(1.5)}
                fontSize={responsiveFontSize(2.4)}
                fontWeight="600"
                title="No services available at the moment."
              />
            )}
          </View>
          {services?.length ? (
            <View style={{paddingTop: responsiveHeight(2)}}>
              <Button
                handlePress={() =>
                  currentService
                    ? navigation.navigate('AllServices', {
                        serviceId: currentService,
                        managerId,
                      })
                    : ShowToast(
                        'error',
                        'Plz Select A Service Category To Proceed',
                      )
                }
                textColor={Colors.white}
                title="Next"
                bgColor={Colors.buttonBg}
                borderColor={''}
                borderRadius={0}
                xml={''}
                width={0}
                height={0}
                textFont={0}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backImage: {
    height: responsiveHeight(40),
    width: responsiveWidth(100),
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  storeView: {
    flexGrow: 1,
    padding: responsiveHeight(2),
  },
  heading: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },
  heartView: {
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingView: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    height: responsiveHeight(3),
    width: responsiveWidth(15),
    borderRadius: 10,
  },
  ratingText: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
  },
  rating: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
  },
  desc: {
    color: Colors.txtColor,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(2.5),
  },
  imageStyle: {
    height: responsiveHeight(20),
    marginBottom: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1),
  },
});
