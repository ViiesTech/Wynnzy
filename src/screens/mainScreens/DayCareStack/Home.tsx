import React, {Fragment, useEffect, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Header3} from '../../../Components/Header2';
import {NormalText} from '../../../Components/Titles';
import SmallButtons from '../../../Components/SmallButtons';
import SvgIcons from '../../../Components/SvgIcons';
import {back2, forward, profile, smiley, tag} from '../../../assets/icons';
import {images} from '../../../assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {GetManagerStats} from '../../../redux/Slices';
import DaycareHeader from '../../../Components/DaycareHeader';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Home = ({navigation}: any) => {
  const [activeMonthIndex, setActiveMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state: any) => state.user?.userData);
  const _id = userData?._id || userData?.id || userData?.user?._id || userData?.user?.id;
  const {token} = useSelector((state: any) => state.user);
  const dispatch = useDispatch<any>();
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    getStats();
  }, [activeMonthIndex, activeYear]);

  // console.log('activeMonthIndex:-', activeMonthIndex);
  // console.log('activeYear:-', activeYear);
  // console.log('token:-', token);

  const getStats = async () => {
    setLoader(true);
    dispatch(
      GetManagerStats({
        managerId: _id,
        month: activeMonthIndex + 1,
        year: activeYear,
      }),
    )
      ?.unwrap()
      ?.then((res: any) => setStatsData(res?.data))
      ?.catch((err: any) => console.log('err:-', err))
      ?.finally(() => setLoader(false));
  };

  const handleNext = () => {
    setActiveMonthIndex(prev => {
      if (prev === 11) {
        setActiveYear(year => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setActiveMonthIndex(prev => {
      if (prev === 0) {
        setActiveYear(year => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  // Sub-component for clean rendering
  const StatItem = ({value, label, icon}: any) => (
    <View style={styles.statRow}>
      <View style={styles.chartCircle}>
        <View style={styles.innerChartCircle}>
          <SvgIcons xml={icon} height={20} width={20} />
        </View>
      </View>
      <View>
        <NormalText
          title={value}
          fontWeight="900"
          fontSize={responsiveFontSize(3.3)}
        />
        <NormalText
          title={label}
          fontWeight="600"
          fontSize={responsiveFontSize(1.8)}
          color="#666"
        />
      </View>
    </View>
  );

  const getCurrentMonthStats = () => {
    if (!statsData || !statsData[0]) {
      return null;
    }
    const yearData = statsData[0].years?.find(
      (y: any) => y.year === activeYear,
    );
    if (!yearData) {
      return null;
    }
    const monthData = yearData.months?.find(
      (m: any) => m.month === activeMonthIndex + 1,
    );
    return monthData;
  };

  const currentMonthStats = getCurrentMonthStats();

  // console.log('statsData:-', JSON.stringify(statsData, null, 2));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: Colors.white}}
      contentContainerStyle={styles.container}>
      <DaycareHeader home bellIcon navigation={navigation} />

      <NormalText
        title="Dashboard"
        fontSize={responsiveFontSize(2.8)}
        mrgnTop={responsiveHeight(2)}
        fontWeight="800"
      />

      {/* Filter Tabs */}
      {/* <View style={styles.filterContainer}>
        {['Month', 'Year'].map(item => (
          <SmallButtons
            key={item}
            title={item}
            width={responsiveWidth(40)}
            // You can pass an isActive prop to SmallButtons to toggle Colors.buttonBg vs transparent
          />
        ))}
      </View> */}

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={handlePrev}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <SvgIcons xml={back2} height={20} width={20} />
          </TouchableOpacity>
          <NormalText
            title={`${MONTHS[activeMonthIndex]} ${activeYear}`}
            fontSize={responsiveFontSize(2.1)}
            fontWeight="700"
            color={Colors.white}
          />
          <TouchableOpacity
            onPress={handleNext}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <SvgIcons xml={forward} height={20} width={20} />
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={images.circleProgress}
          style={styles.progressImage}
          resizeMode="contain">
          <View style={styles.progressTextContainer}>
            {loader ? (
              <View style={{left: responsiveWidth(3)}}>
                <ActivityIndicator size={'large'} color={Colors.white} />
              </View>
            ) : (
              <Fragment>
                <NormalText
                  title={currentMonthStats?.earning || '0'}
                  fontSize={responsiveFontSize(3.5)}
                  fontWeight="700"
                  alignSelf="center"
                  color={Colors.white}
                />
                <NormalText
                  title="Earnings"
                  fontSize={responsiveFontSize(2)}
                  fontWeight="700"
                  color={'#80E1DF'}
                  alignSelf="center"
                />
              </Fragment>
            )}
          </View>
        </ImageBackground>

        <View style={styles.divider} />

        <View style={styles.statusRow}>
          <View style={styles.iconCircle}>
            <SvgIcons xml={smiley} height={25} width={25} />
          </View>
          <View>
            <NormalText
              title="You’re doing good!"
              color={Colors.white}
              fontWeight="800"
            />
            <NormalText
              title="You almost reached your goal"
              color={'#80E1DF'}
              fontWeight="400"
            />
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatItem
          value={statsData?.[0]?.totalBookings || '0'}
          label="Overall Bookings"
          icon={profile}
        />
        <View style={styles.horizontalLine} />
        <StatItem
          value={statsData?.[0]?.totalEarning || '0'}
          label="Overall Earnings"
          icon={tag}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    padding: responsiveHeight(2),
  },
  filterContainer: {
    width: '100%',
    backgroundColor: Colors.buttonBg,
    flexDirection: 'row',
    marginTop: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveHeight(1.5),
    gap: responsiveHeight(2),
    borderRadius: 12,
  },
  progressCard: {
    height: responsiveHeight(45),
    backgroundColor: Colors.buttonBg,
    padding: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveHeight(1.8),
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressImage: {
    height: responsiveHeight(25),
    width: '100%',
    marginVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    // left: '39%',
    left: responsiveWidth(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1.5),
    marginTop: responsiveHeight(2),
  },
  iconCircle: {
    backgroundColor: Colors.white,
    padding: responsiveHeight(1),
    borderRadius: 50,
  },
  statsContainer: {
    backgroundColor: Colors.white,
    borderRadius: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    padding: responsiveHeight(2),
    gap: responsiveHeight(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(2),
  },
  chartCircle: {
    height: responsiveWidth(18),
    width: responsiveWidth(18),
    borderWidth: 5,
    borderLeftColor: '#E9ECF1',
    borderTopColor: Colors.buttonBg,
    borderRightColor: Colors.buttonBg,
    borderBottomColor: Colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(9),
  },
  innerChartCircle: {
    backgroundColor: '#F5F7F9',
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#D7DCE1',
  },
});

export default Home;
