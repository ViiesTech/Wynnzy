import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {images} from '../../../assets/images';
import {Colors} from '../../../assets/colors';
import {getPetProfile} from '../../../GlobalFunctions/Auth';
import {ImageBaseUrl} from '../../../BaseUrl';
import moment from 'moment';
import UserHeader from '../../../Components/UserHeader';
import FastImage from 'react-native-fast-image';

const PetProfile = ({navigation, route}: any) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {_id} = route?.params || {};

  useEffect(() => {
    if (_id) {
      _getPetProfile();
    }
  }, [_id]);

  const _getPetProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getPetProfile(_id);
      setData(response.data);
    } catch (error) {
      console.log('Error fetching pet profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) {
      return 'Age N/A';
    }
    const now = moment();
    const birth = moment(dob);
    const years = now.diff(birth, 'years');
    birth.add(years, 'years');
    const months = now.diff(birth, 'months');
    return `${years}y ${months}m`;
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Header Image & Floating Info Card */}
        <Fragment>
          <View style={styles.headerAbsoluteContainer}>
            <UserHeader
              navigation={navigation}
              backIcon={true}
              centerText={true}
            />
          </View>
          <FastImage
            source={{uri: `${ImageBaseUrl}${data?.profileImage}`}}
            style={styles.mainImage}
            resizeMode={FastImage.resizeMode.cover}
          />

          <View style={styles.blurCardContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={'light'}
              blurAmount={15}
              reducedTransparencyFallbackColor="white"
            />

            <View style={styles.headerInfoRow}>
              <View>
                <Text style={styles.petNameText}>{data?.petName}</Text>
                <Text style={styles.subTitleText}>
                  {data?.breed} • {calculateAge(data?.dob)}
                </Text>
              </View>
              <Image source={images.female} style={styles.genderIcon} />
            </View>
          </View>
        </Fragment>

        {/* About Section */}
        <View style={styles.aboutSectionHeader}>
          <Image source={images.paw} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>About {data?.petName}</Text>
        </View>

        <FlatList
          data={[
            {result: data?.weight ? `${data.weight} kg` : '-', title: 'Weight'},
            {result: data?.height ? `${data.height} cm` : '-', title: 'Height'},
            {result: data?.color || '-', title: 'Color'},
          ]}
          contentContainerStyle={styles.statsList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>{item.title}</Text>
              <Text style={styles.statsResult}>{item.result}</Text>
            </View>
          )}
        />

        {/* Description Section */}
        <View style={styles.sectionHeader}>
          <Image
            source={images.description}
            style={styles.sectionIcon}
            tintColor={Colors.themeText}
          />
          <Text style={styles.sectionTitle}>{data?.petName} Description</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{data?.description}</Text>
        </View>

        {/* Behavior Section */}
        <View style={styles.sectionHeader}>
          <Image
            source={images.smileys}
            style={styles.sectionIcon}
            tintColor={Colors.themeText}
          />
          <Text style={styles.sectionTitle}>{data?.petName} behavior</Text>
        </View>

        <View style={styles.behaviorContainer}>
          {data?.behaviour?.map((item: string, index: number) => (
            <View key={index} style={styles.behaviorTag}>
              <Text style={styles.behaviorText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Gallery Section */}
        <View style={styles.sectionHeader}>
          <FastImage
            source={images.gallery as any}
            style={styles.sectionIcon}
            tintColor={Colors.themeText}
          />
          <Text style={styles.sectionTitle}>{data?.petName} Gallery</Text>
        </View>

        {/* Dynamic Photo Grid */}
        <View style={{marginTop: 10}}>
          {data?.petImages?.map((_: any, index: number) => {
            if (index % 2 === 0) {
              const firstImage = data?.petImages[index];
              const secondImage = data?.petImages[index + 1];

              return secondImage ? (
                <View key={index} style={styles.photoRow}>
                  <FastImage
                    source={{uri: `${ImageBaseUrl}${firstImage}`}}
                    style={styles.gridImageHalf}
                  />
                  <FastImage
                    source={{uri: `${ImageBaseUrl}${secondImage}`}}
                    style={styles.gridImageHalf}
                  />
                </View>
              ) : (
                <FastImage
                  key={index}
                  source={{uri: `${ImageBaseUrl}${firstImage}`}}
                  style={styles.gridImageFull}
                />
              );
            }
            return null;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(4),
  },
  mainImage: {
    height: responsiveHeight(40),
    width: responsiveWidth(100),
  },
  headerAbsoluteContainer: {
    position: 'absolute',
    top: responsiveHeight(2),
    left: 0,
    right: 0,
    zIndex: 100,
    // backgroundColor: 'red',
  },
  blurCardContainer: {
    padding: 20,
    width: responsiveWidth(90),
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
    top: responsiveHeight(35),
    // bottom: responsiveHeight(-6),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  petNameText: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(3),
    fontWeight: '900',
  },
  subTitleText: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    marginTop: 2,
  },
  genderIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  aboutSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(90),
    alignSelf: 'center',
    gap: 10,
    marginTop: responsiveHeight(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(90),
    alignSelf: 'center',
    gap: 10,
    marginTop: responsiveHeight(3),
  },
  sectionIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    resizeMode: 'contain',
  },
  sectionTitle: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2),
    fontWeight: '900',
  },
  statsList: {
    paddingLeft: responsiveWidth(5),
    marginTop: 20,
    paddingRight: 20,
  },
  statsCard: {
    padding: 15,
    width: responsiveWidth(28),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#FAFAFA',
  },
  statsTitle: {
    color: '#A6A6A6',
    fontSize: responsiveFontSize(1.6),
  },
  statsResult: {
    color: Colors.buttonBg,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    backgroundColor: '#FAFAFA',
    width: responsiveWidth(90),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    paddingLeft: 15,
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
  },
  behaviorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginTop: 15,
    gap: 8,
  },
  behaviorTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: Colors.buttonBg,
    backgroundColor: '#FFF',
  },
  behaviorText: {
    color: '#555',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginBottom: 10,
  },
  gridImageHalf: {
    width: responsiveWidth(43.5),
    height: responsiveHeight(18),
    borderRadius: 12,
  },
  gridImageFull: {
    width: responsiveWidth(90),
    height: responsiveHeight(18),
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default PetProfile;
