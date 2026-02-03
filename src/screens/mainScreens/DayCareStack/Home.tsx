/* eslint-disable react-native/no-inline-styles */
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Header3 } from '../../../Components/Header2';
import { NormalText } from '../../../Components/Titles';
import SmallButtons from '../../../Components/SmallButtons';
import SvgIcons from '../../../Components/SvgIcons';
import { back2, forward, profile, smiley, tag } from '../../../assets/icons';
import { images } from '../../../assets/images';
import { clearToken } from '../../../redux/Slices';
import { useDispatch } from 'react-redux';

const Home = ({ navigation }) => {
  const [activeMonth, setActiveMonth] = useState('January');
  const data = [
    {
      id: 1,
      title: 'January',
    },
    {
      id: 2,
      title: 'February',
    },
    {
      id: 3,
      title: 'March',
    },
    {
      id: 4,
      title: 'April',
    },
    {
      id: 5,
      title: 'May',
    },
    {
      id: 6,
      title: 'June',
    },
    {
      id: 7,
      title: 'July',
    },
    {
      id: 8,
      title: 'August',
    },
    {
      id: 9,
      title: 'September',
    },
    {
      id: 10,
      title: 'October',
    },
    {
      id: 11,
      title: 'November',
    },
    {
      id: 12,
      title: 'December',
    },
  ];
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   dispatch(clearToken())
  // },[])
  const handleNext = () => {
    const currentMonth = data.find(item => item.title === activeMonth);
    const newId = currentMonth.id === 12 ? 1 : currentMonth.id + 1;
    const nextMonth = data.find(item => item.id === newId);
    setActiveMonth(nextMonth.title);
  };
  const handlePrev = () => {
    const currentMonth = data.find(item => item.title === activeMonth);
    const newId = currentMonth.id === 1 ? 12 : currentMonth.id - 1;
    const prevMonth = data.find(item => item.id === newId);
    setActiveMonth(prevMonth.title);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ebebeb', padding: responsiveHeight(2) }}>
      <Header3 onEditPress={() => navigation.navigate('Notification')} />

      <NormalText title="Dashboard" fontSize={responsiveFontSize(2.8)} mrgnTop={responsiveHeight(2)} fontWeight="800" />

      <View style={{ backgroundColor: Colors.buttonBg, flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', justifyContent: 'center', padding: responsiveHeight(2), gap: responsiveHeight(2) }}>
        <SmallButtons title="Day" />
        <SmallButtons title="Week" />
        <SmallButtons title="Month" />
      </View>

      <TouchableOpacity style={{ backgroundColor: Colors.buttonBg, padding: responsiveHeight(2), marginTop: responsiveHeight(2), borderRadius: responsiveHeight(1.8) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={handlePrev}>
            <SvgIcons xml={back2} height={20} width={20} />
          </TouchableOpacity>
          <NormalText title={`${activeMonth} 2025`} fontSize={responsiveFontSize(2.1)} fontWeight="700" color={Colors.white} />
          <TouchableOpacity onPress={handleNext}>
            <SvgIcons xml={forward} height={20} width={20} />
          </TouchableOpacity>
        </View>
        <Image source={images.progress} />
        <View style={{ height: 1.5, width: '100%', backgroundColor: '#FEFEFE' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}>
          <View style={{ backgroundColor: Colors.white, padding: responsiveHeight(1), borderRadius: responsiveHeight(2.5) }}>
            <SvgIcons xml={smiley} height={20} width={20} />
          </View>
          <View>
            <NormalText title="You’re doing good!" color={Colors.white} fontWeight="800" />
            <NormalText title="You almost reached your goal" color={'#80E1DF'} fontWeight="400" />
          </View>
        </View>


      </TouchableOpacity>

      <View style={{ backgroundColor: Colors.white, borderRadius: responsiveHeight(2), marginTop: responsiveHeight(2), padding: responsiveHeight(2), gap: responsiveHeight(2) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
          <View style={{
            height: responsiveHeight(10),
            width: responsiveWidth(20),
            borderWidth: 6,
            borderLeftColor: '#E9ECF1',
            borderTopColor: Colors.buttonBg,
            borderRightColor: Colors.buttonBg,
            borderBottomColor: Colors.buttonBg,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: responsiveHeight(5),
            borderRadius: responsiveHeight(5),
          }}>
            <View style={{ backgroundColor: '#F5F7F9', width: responsiveWidth(10), borderRadius: responsiveHeight(3), padding: responsiveHeight(1.3), alignItems: 'center' }}>
              <SvgIcons xml={profile} height={20} width={20} />
            </View>
          </View>
          <View>
            <NormalText title="1,235" fontWeight="900" fontSize={responsiveFontSize(3.3)} />
            <NormalText title="Visitors this month" fontWeight="600" fontSize={responsiveFontSize(2.3)} />
          </View>
        </View>
        <View style={{ height: 1, width: '100%', backgroundColor: '#D7DCE1' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
          <View style={{
            height: responsiveHeight(10),
            width: responsiveWidth(20),
            borderWidth: 6,
            borderLeftColor: '#E9ECF1',
            borderTopColor: Colors.buttonBg,
            borderRightColor: Colors.buttonBg,
            borderBottomColor: Colors.buttonBg,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: responsiveHeight(5),
            borderRadius: responsiveHeight(5),
          }}>
            <View style={{ backgroundColor: '#F5F7F9', width: responsiveWidth(10), borderRadius: responsiveHeight(3), padding: responsiveHeight(1.3), alignItems: 'center' }}>
              <SvgIcons xml={tag} height={20} width={20} />
            </View>
          </View>
          <View>
            <NormalText title="456" fontWeight="900" fontSize={responsiveFontSize(3.3)} />
            <NormalText title="Visitors this month" fontWeight="600" fontSize={responsiveFontSize(2.3)} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Home;
