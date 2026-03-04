/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header2 from '../../../Components/Header2';
import {heart, rating} from '../../../assets/icons';
import {images} from '../../../assets/images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import SvgIcons from '../../../Components/SvgIcons';
import {Colors} from '../../../assets/colors';
import CategoryCard from '../../../Components/CategoryCard';
import {Button} from '../../../Components/Button';
import {getBusinessProfile, ShowToast} from '../../../GlobalFunctions/Auth';
import {getAllCategoriesByManagerId} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';
import {NormalText} from '../../../Components/Titles';

const StoreDetails = ({navigation, route}: any) => {
  const {_id, managerId} = route?.params;
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, servicesRes] = await Promise.all([
        getBusinessProfile(_id),
        getAllCategoriesByManagerId(managerId),
      ]);

      setStoreDetails(profileRes.data);
      setCategories(servicesRes.data);
    } catch (err) {
      ShowToast('error', 'Failed to load store data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  console.log('categories:-', JSON.stringify(categories, null, 2));

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

      <View style={styles.contentWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header Info */}
          <View style={styles.headerRow}>
            <View style={{flex: 1}}>
              <Text style={styles.heading}>
                {storeDetails?.fullName || 'Store Name'}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Reviews', {
                    managerId: storeDetails?.managerId,
                    ratings: storeDetails?.ratings,
                    totalReviews: storeDetails?.totalreviews,
                  })
                }
                style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                  <SvgIcons xml={rating} height={13} width={13} />
                  <Text style={styles.ratingText}>
                    {storeDetails?.ratings || 0}
                  </Text>
                </View>
                <Text style={styles.ratingLabel}>Rating</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.heartBtn}>
              <SvgIcons xml={heart} height={20} width={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.desc}>{storeDetails?.bio}</Text>

          {/* Gallery Section */}
          {storeDetails?.image?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading}>Gallery</Text>
              <View style={styles.galleryGrid}>
                {storeDetails.image.map((item: any, index: number) => {
                  // If it's the 3rd item and we are in a 2-column mindset, make it full width
                  const isFullWidth =
                    index === 2 && storeDetails.image.length === 3;
                  return (
                    <Image
                      key={index}
                      source={{uri: `${ImageBaseUrl}${item}`}}
                      style={[
                        styles.galleryImage,
                        {
                          width: isFullWidth
                            ? responsiveWidth(92)
                            : responsiveWidth(44),
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          )}

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.heading}>Categories</Text>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  style={{marginTop: 20}}
                  size="large"
                  color={Colors.buttonBg}
                />
              </View>
            ) : categories?.length > 0 ? (
              <View style={{marginTop: 10}}>
                {categories.map((item: any) => (
                  <CategoryCard
                    key={item?._id}
                    data={item}
                    selected={currentService === item?._id}
                    onPress={() => {
                      setCurrentService((prev: any) =>
                        prev === item?._id ? null : item?._id,
                      );
                    }}
                  />
                ))}
              </View>
            ) : (
              <NormalText
                mrgnTop={responsiveHeight(1.5)}
                fontSize={responsiveFontSize(2)}
                title="No categories available."
              />
            )}
          </View>

          {/* Action Button */}
          {categories?.length > 0 && (
            <View style={{marginVertical: 20}}>
              <Button
                handlePress={() =>
                  currentService
                    ? navigation.navigate('AllServices', {
                        serviceId: currentService,
                        managerId,
                      })
                    : ShowToast('error', 'Please select a category')
                }
                title="Next"
                bgColor={Colors.buttonBg}
                textColor={Colors.white}
                borderRadius={10}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  backImage: {
    height: responsiveHeight(35),
    width: responsiveWidth(100),
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -30,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: responsiveWidth(4),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {color: Colors.black, fontSize: responsiveFontSize(1.6)},
  ratingLabel: {color: Colors.black, fontSize: responsiveFontSize(1.6)},
  heartBtn: {
    backgroundColor: Colors.buttonBg,
    padding: 10,
    borderRadius: 12,
  },
  desc: {
    color: Colors.txtColor,
    fontSize: responsiveFontSize(1.8),
    lineHeight: 22,
    marginTop: 15,
  },
  section: {
    marginTop: 25,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  galleryImage: {
    height: responsiveHeight(18),
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: Colors.lightGray,
  },
});

export default StoreDetails;
