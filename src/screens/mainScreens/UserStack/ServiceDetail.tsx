/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {ImageBaseUrl} from '../../../BaseUrl';
import {getAllPets, ShowToast} from '../../../GlobalFunctions/Auth';
import {
  getAllServicesByCategory,
  getServiceById,
} from '../../../GlobalFunctions';

// Components
import CalendarCard from '../../../Components/CalendarCard';
import {Button} from '../../../Components/Button';
import PickerCard from '../../../Components/PickerCard';
import {BoldText} from '../../../Components/Titles';
import Input from '../../../Components/Input';
import TextHeader from '../../../Components/TextHeader';

const ServiceDetail = ({navigation, route}: any) => {
  const {_id, managerId, serviceCategory, categoryId} = route?.params;
  const {userData} = useSelector((state: any) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [value, setValue] = useState<any[]>([]); // Selected extra services
  const [otherServices, setOtherServices] = useState([]);
  const [allPets, setAllPets] = useState([]);

  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [address, setAddress] = useState('');

  // Calculate Total Price
  const totalPrice =
    (data?.price || 0) +
    (value?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [serviceRes, petsRes, othersRes] = await Promise.all([
        getServiceById(_id),
        getAllPets(userData._id),
        getAllServicesByCategory(managerId, serviceCategory),
      ]);

      setData(serviceRes.data);
      setAllPets(petsRes.data);

      // Filter out current service from "Others" dropdown
      const filtered = othersRes.data
        .filter((item: any) => item._id !== _id)
        .map((item: any) => ({
          label: `${item.serviceName} ($${item.price})`,
          value: item,
        }));
      setOtherServices(filtered);
    } catch (error) {
      console.error('Error fetching service details:', error);
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

  const handleContinue = () => {
    if (!selectedPet) {
      return ShowToast('error', 'Please choose a pet.');
    }
    if (!address) {
      return ShowToast('error', 'Please enter a service address.');
    }
    if (!selectedDate) {
      return ShowToast('error', 'Please select a date.');
    }

    const selectedServiceIds = [_id, ...value.map(item => item._id)];

    navigation.navigate('Payment', {
      allServices: [data, ...value],
      petId: selectedPet,
      managerId,
      address,
      userId: userData._id,
      total: totalPrice,
      categoryId,
      serviceId: selectedServiceIds,
      selectDate: selectedDate,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <View style={styles.subContainer}>
        <TextHeader title="Services Details" />

        {/* Main Service Info */}
        <View style={styles.contentView}>
          {data?.images?.[0] && (
            <Image
              source={{uri: `${ImageBaseUrl}${data.images[0]}`}}
              style={styles.imageStyle}
            />
          )}
          <View style={{flex: 1}}>
            <BoldText
              fontSize={responsiveFontSize(2.3)}
              fontWeight={'800'}
              title={data?.serviceName}
            />
            <Text style={styles.desc} numberOfLines={3}>
              {data?.description}
            </Text>
            <Text style={styles.price}>${data?.price?.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.heading}>Choose a Pet</Text>

        {/* Pet Selection Grid using .map for ScrollView compatibility */}
        <View style={styles.petGrid}>
          {allPets.map((item: any) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.7}
              style={styles.petCard(selectedPet)}
              onPress={() => {
                setSelectedPet(prev => (prev === item._id ? null : item._id));
              }}>
              <Image
                source={{uri: `${ImageBaseUrl}${item?.petImages[0]}`}}
                style={styles.petImage}
              />
              <View style={styles.petNameContainer}>
                <Text style={styles.petName}>{item?.petName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <PickerCard
            value={value}
            setValue={setValue}
            items={otherServices}
            placeHolder="Add Extra Services"
            mrgnTop={responsiveHeight(1)}
          />

          <View style={{marginTop: responsiveHeight(2), width: '100%'}}>
            <Input
              placeHolder="Address"
              value={address}
              placeholderTxtColor={'#CCCCCC'}
              fontSize={responsiveHeight(2)}
              handlePress={(txt: string) => setAddress(txt)}
            />
          </View>

          <CalendarCard onDateSelect={setSelectedDate} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SubTotal:</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          handlePress={handleContinue}
          title="Continue to Payment"
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
          borderRadius={10}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, backgroundColor: '#fff'},
  subContainer: {padding: responsiveHeight(2)},
  heading: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
  },
  contentView: {
    paddingTop: responsiveHeight(2),
    flexDirection: 'row',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: responsiveHeight(2),
  },
  imageStyle: {
    height: responsiveHeight(15),
    width: responsiveHeight(15),
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  desc: {color: '#888', fontSize: responsiveFontSize(1.6), marginTop: 5},
  price: {
    marginTop: 8,
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },
  petCard: (selectedPet: string) => ({
    width: responsiveWidth(44),
    height: responsiveHeight(15),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: selectedPet ? Colors.buttonBg : 'transparent',
    overflow: 'hidden',
    // marginBottom: 15,
  }),
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: Colors.lightGray,
  },
  petNameContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  petName: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
  formContainer: {marginTop: 20, width: '100%'},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.themeText,
  },
  totalValue: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Colors.buttonBg,
  },
  buttonWrapper: {padding: responsiveHeight(2), marginBottom: 20},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ServiceDetail;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {images} from '../../../assets/images';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import CalendarCard from '../../../Components/CalendarCard';
// import {Colors} from '../../../assets/colors';
// import {Button} from '../../../Components/Button';
// import PickerCard from '../../../Components/PickerCard';
// import BackIcon from '../../../Components/BackIcon';
// import {BoldText} from '../../../Components/Titles';
// import Input from '../../../Components/Input';
// import {
//   getAllServicesByCategory,
//   getServiceById,
//   getServicesByCategory,
// } from '../../../GlobalFunctions';
// import {ImageBaseUrl} from '../../../BaseUrl';
// import {useSelector} from 'react-redux';
// import {getAllPets} from '../../../GlobalFunctions/Auth';
// import moment from 'moment';

// const ServiceDetail = ({navigation, route}: any) => {
//   const {_id, managerId, serviceCategory, categoryId} = route?.params;
//   const [value, setValue] = useState<any | null>();
//   const [data, setData] = useState([]);

//   const [services, setServices] = useState([]);
//   const [otherServices, setOtherServices] = useState([]);
//   const [allPets, setAllPets] = useState([]);
//   const [selectedPet, setSelectedPet] = useState();
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [address, setAddress] = useState();
//   const [selectedServiceIds, setSelectedServiceIds] = useState([_id]);
//   const [allServicesData, setAllServiceData] = useState([]);

//   const {userData} = useSelector(state => state.user);
//   const totalPrice =
//     (value?.reduce((sum, item) => sum + item.price, 0) || 0) +
//     (data?.price || 0);
//   console.log('categoryId', categoryId);
//   // const formattedDate = selectedDate
//   // ? `${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1)
//   //     .toString()
//   //     .padStart(2, '0')}-${selectedDate.getFullYear()}`
//   // : null;
//   // console.log('formattedDate', formattedDate);
//   useEffect(() => {
//     if (services.length > 0) {
//       const updatedTypes = services.map(item => ({
//         label: item.serviceName,
//         value: item,
//       }));
//       setOtherServices(updatedTypes);
//     }
//   }, [services]);
//   console.log(_id, managerId, serviceCategory);

//   const fetchService = async () => {
//     const response = await getServiceById(_id);
//     setData(response.data);
//   };
//   const fetchAllPets = async () => {
//     const response = await getAllPets(userData._id);
//     setAllPets(response.data);
//   };

//   const fetchOtherServices = async () => {
//     const response = await getAllServicesByCategory(managerId, serviceCategory);
//     const filteredServices = response.data.filter(item => item._id !== _id);
//     setServices(filteredServices);
//   };
//   useEffect(() => {
//     const selectedIds = value?.map(item => item._id) || [];
//     // Always include the main `_id` from route.params
//     setSelectedServiceIds([_id, ...selectedIds.filter(id => id !== _id)]);
//   }, [value]);
//   useEffect(() => {
//     fetchService();
//     fetchOtherServices();
//     fetchAllPets();
//   }, []);
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.container}>
//       <View style={styles.subContainer}>
//         <BackIcon />
//         <Text style={styles.heading}>Services Details</Text>
//         <View style={styles.contentView}>
//           {data.images ? (
//             <Image
//               source={{uri: `${ImageBaseUrl}${data?.images[0]}`}}
//               style={styles.imageStyle}
//             />
//           ) : null}
//           <View style={{flex: 1}}>
//             {/* <Text style={[styles.heading, { fontSize: responsiveFontSize(2), marginTop: responsiveHeight(0.1) }]}>Lorem Ipsum</Text> */}
//             <BoldText
//               fontSize={responsiveFontSize(2.3)}
//               fontWeight={'800'}
//               title={data?.serviceName}
//             />
//             <Text style={styles.desc}>{data?.description}</Text>
//             <Text style={styles.price}>${data?.price}</Text>
//           </View>
//         </View>
//         <Text style={styles.heading}>Choose a Pet for This Service</Text>
//         <FlatList
//           numColumns={2}
//           data={allPets}
//           keyExtractor={item => item._id}
//           columnWrapperStyle={{
//             justifyContent: 'space-between',
//           }}
//           contentContainerStyle={{
//             justifyContent: 'space-between',
//             gap: responsiveHeight(2),
//             marginTop: responsiveHeight(3),
//           }}
//           renderItem={({item}) => {
//             return (
//               <TouchableOpacity
//                 style={{}}
//                 onPress={() => setSelectedPet(item._id)}>
//                 <Image
//                   source={{uri: `${ImageBaseUrl}${item?.petImages[0]}`}}
//                   style={[
//                     styles.petImage,
//                     {
//                       borderWidth: selectedPet === item._id ? 4 : null,
//                       borderColor:
//                         selectedPet === item._id ? Colors.buttonBg : null,
//                       borderRadius: 10,
//                     },
//                   ]}
//                 />

//                 {/* {selectedPet === item._id && (
//                   <TouchableOpacity
//                     style={{
//                       height: responsiveHeight(3.5),
//                       position: 'absolute',
//                       top: responsiveHeight(1),
//                       right: responsiveHeight(1),
//                       width: responsiveWidth(7),
//                       borderRadius: responsiveHeight(2),
//                       backgroundColor: Colors.black,
//                     }}
//                   />
//                 )} */}

//                 <View style={styles.petNameContainer}>
//                   <Text style={styles.petName}>{item?.petName}</Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           }}
//         />

//         <View style={styles.inputContainer}>
//           <PickerCard
//             value={value}
//             setValue={setValue}
//             items={otherServices}
//             placeHolder="Other Available Services"
//             mrgnTop={responsiveHeight(2)}
//           />
//           <View style={{marginTop: responsiveHeight(2)}}>
//             <Input
//               placeHolder="Address"
//               placeholderTxtColor={'#CCCCCC'}
//               handlePress={address => setAddress(address)}
//               color={''}
//               fontSize={responsiveHeight(2)}
//               fontWeight={''}
//               backgroundColor={''}
//               xml={''}
//               setShowPassword={function (): void {
//                 throw new Error('Function not implemented.');
//               }}
//             />
//           </View>
//           <CalendarCard onDateSelect={setSelectedDate} />
//           <Text style={styles.heading}>SubTotal: ${totalPrice}</Text>
//         </View>
//       </View>
//       <View style={styles.buttonWrapper}>
//         <Button
//           handlePress={() =>
//             navigation.navigate('Payment', {
//               allServices: [data, ...(value || [])],
//               petId: selectedPet,
//               managerId,
//               address,
//               userId: userData._id,
//               total: totalPrice,
//               categoryId,
//               serviceId: selectedServiceIds,
//               selectDate: selectedDate,
//             })
//           }
//           textColor={Colors.white}
//           title="Continue"
//           bgColor={Colors.buttonBg}
//           borderColor={''}
//           borderRadius={0}
//           xml={''}
//           width={0}
//           height={0}
//           textFont={0}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default ServiceDetail;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   subContainer: {
//     padding: responsiveHeight(2),
//   },
//   backView: {
//     borderRadius: 10,
//     backgroundColor: Colors.buttonBg,
//     height: responsiveHeight(5),
//     width: responsiveHeight(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     color: Colors.themeText,
//     fontSize: responsiveFontSize(2.4),
//     fontWeight: 'bold',
//     marginTop: responsiveHeight(3.5),
//   },
//   contentView: {
//     paddingTop: responsiveHeight(3),
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 20,
//   },
//   imageStyle: {
//     height: responsiveHeight(18),
//     width: responsiveHeight(18),
//     borderRadius: responsiveHeight(1),
//   },
//   desc: {
//     color: '#dbdbdb',
//     fontSize: responsiveFontSize(1.7),
//     marginTop: responsiveHeight(0.5),
//     width: responsiveWidth(50),
//   },
//   price: {
//     marginTop: responsiveHeight(1),
//     color: Colors.black,
//     fontWeight: 'bold',
//     fontSize: responsiveFontSize(1.8),
//   },
//   inputContainer: {
//     paddingTop: responsiveHeight(4),
//     alignItems: 'center',
//   },
//   buttonWrapper: {
//     flex: 0.9,
//     padding: responsiveHeight(2),
//     justifyContent: 'flex-end',
//   },
//   petImage: {
//     width: responsiveWidth(44),
//     height: responsiveHeight(15),
//     borderRadius: 10,
//     overflow: 'hidden',
//   },

//   petNameContainer: {position: 'absolute', bottom: 10, left: 10},
//   petName: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: responsiveFontSize(2),
//   },
// });
