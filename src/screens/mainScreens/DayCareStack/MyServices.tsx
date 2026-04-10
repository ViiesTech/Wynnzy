import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import DaycareHeader from '../../../Components/DaycareHeader';
import {GetAllMyServices} from '../../../redux/Slices';
import ServiceCard from '../../../Components/ServiceCard';
import {NormalText} from '../../../Components/Titles';
import SvgIcons from '../../../Components/SvgIcons';
import {plus} from '../../../assets/icons';
import {useIsFocused} from '@react-navigation/native';

const MyServices = ({navigation}: any) => {
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const {_id} = useSelector((state: any) => state.user?.userData);
  const dispatch = useDispatch<any>();
  const isFocused = useIsFocused();

  const fetchServices = useCallback(
    async (isRefreshing = false) => {
      if (!isRefreshing) {
        setLoader(true);
      }
      dispatch(GetAllMyServices(_id))
        ?.unwrap()
        ?.then((res: any) => {
          setServicesData(res?.data || []);
        })
        ?.catch((err: any) => {
          console.log('Error fetching services:', err);
        })
        ?.finally(() => {
          setLoader(false);
          setRefreshing(false);
        });
    },
    [_id, dispatch],
  );

  useEffect(() => {
    if (isFocused) {
      fetchServices();
    }
  }, [fetchServices, isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices(true);
  };

  const renderItem = ({item}: any) => (
    <ServiceCard
      data={item}
      activeOpacity={1}
      handleEdit={() =>
        navigation.navigate('CreateService', {serviceData: item})
      }
    />
  );

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {!loader && (
        <NormalText
          title="No services found. Add your first service!"
          fontSize={responsiveFontSize(2.2)}
          color="#666"
          txtAlign="center"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <DaycareHeader
        title="My Services"
        centerText={true}
        navigation={navigation}
      />

      <View style={styles.mainContainer}>
        {loader && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.buttonBg} />
          </View>
        ) : (
          <FlatList
            data={servicesData}
            renderItem={renderItem}
            keyExtractor={(item: any) => item?._id?.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={listEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.buttonBg]}
              />
            }
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateService')}>
        <SvgIcons xml={plus} height={25} width={25} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: responsiveHeight(10),
    paddingTop: responsiveHeight(2),
  },
  emptyContainer: {
    flex: 1,
    marginTop: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(10),
  },
  fab: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    right: responsiveWidth(6),
    backgroundColor: Colors.buttonBg,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
