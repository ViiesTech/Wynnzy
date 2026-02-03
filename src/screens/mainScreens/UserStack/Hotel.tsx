/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import { Button } from '../../../Components/Button';
import { Colors } from '../../../assets/colors';

const Hotel: React.FC = () => {
  const [selected, setSelected] = useState('Hotels');
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={images.resturant}
          style={{ height: responsiveHeight(40), width: responsiveWidth(100) }}
        />
        <View style={{ position: 'absolute', zIndex: 10, gap: 15,justifyContent:'center' }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: responsiveFontSize(5),
              fontWeight: 'bold',
            }}>
            Doli
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: responsiveFontSize(2.3),
              fontWeight: '400',
            }}>
            Lexington
          </Text>

          <View
            style={{
              padding: 10,
              paddingHorizontal:responsiveHeight(3),
              backgroundColor: '#FFFFFF',
              borderRadius: 200,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: responsiveFontSize(2),
                fontWeight: 'bold',
              }}>
              4.9
            </Text>
            <AntDesign
              name={'star'}
              color={'#F9B908'}
              size={responsiveFontSize(2)}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          bottom: 20,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          flex: 1,
          backgroundColor: 'white',
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: selected === 'Hotels' ? Colors.buttonBg : '#FFFFFF',
              borderRadius: 200,
            }}
            onPress={() => setSelected('Hotels')}>
            <Text
              style={[
                styles.headog,
                { color: selected === 'Hotels' ? '#FFFFFF' : 'black' },
              ]}>
              Hotels
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: selected === 'Foods' ? Colors.buttonBg : '#FFFFFF',
              borderRadius: 200,
            }}
            onPress={() => setSelected('Foods')}>
            <Text
              style={[
                styles.headog,
                { color: selected === 'Foods' ? '#FFFFFF' : 'black' },
              ]}>
              Foods
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: selected === 'Activities' ? Colors.buttonBg : '#FFFFFF',
              borderRadius: 200,
            }}
            onPress={() => setSelected('Activities')}>
            <Text
              style={[
                styles.headog,
                { color: selected === 'Activities' ? '#FFFFFF' : 'black' },
              ]}>
              Activities
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Image
            source={images.dog6}
            style={{
              height: responsiveHeight(30),
              width: responsiveWidth(40),
              borderRadius: 20,
            }}
          />

          <View>
            <Image
              source={images.dog6}
              style={{
                height: responsiveHeight(30),
                width: responsiveWidth(40),
                borderRadius: 20,
              }}
            />
            <View
              style={{
                position: 'absolute',
                zIndex: 10,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'black',
                opacity: 0.7,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: responsiveFontSize(3), fontWeight: '400' }}>10+</Text>
            </View>

          </View>
        </View>
        <View style={{ paddingTop: 15, gap: 5 }}>
          <Text style={{ fontSize: responsiveFontSize(2.1), fontWeight: 'bold', marginVertical: responsiveHeight(1) }}>DETAILS</Text>

          <Text style={{ fontSize: responsiveFontSize(2), marginBottom: responsiveHeight(1) }}>There are so many foods you must eat in Bali but this article might be too long if we list all of it. This guide includes some tra..<Text style={{ color: Colors.themeText, fontWeight: '700' }}> Read More</Text></Text>

          <Button textColor="white" title="Continue" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} handlePress={function (): void {
            console.log('hi');
          }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Hotel;

const styles = StyleSheet.create({
  headog: {
    fontSize: responsiveFontSize(2.5),
    color: '#000000',
  },
});
