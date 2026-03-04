import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {BoldText, NormalText} from './Titles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {calendar, pin, time as timeIcon} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {Colors} from '../assets/colors';
import {Button} from './Button';
import {ImageBaseUrl} from '../BaseUrl';
import moment from 'moment';

interface BookingCardProps {
  data: any;
  handlePress: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({data, handlePress}) => {
  const displayImage = data?.categoryId?.image || data?.images?.[0];

  // Helper to get status colors dynamically
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accept':
      case 'accepted':
        return {bg: '#E8F5E9', text: '#2E7D32'}; // Green
      case 'reject':
      case 'rejected':
        return {bg: '#FFEBEE', text: '#C62828'}; // Red
      default:
        return {bg: '#E8EAFE', text: '#2A1D51'}; // Blue (Pending)
    }
  };

  const statusStyle = getStatusStyles(data?.status);
  console.log('Data:------', data?.address);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.cardContainer}>
      <View style={styles.row}>
        {/* Left Side: Image */}
        <Image
          style={styles.image}
          source={{uri: `${ImageBaseUrl}${displayImage}`}}
          resizeMode="cover"
        />

        {/* Middle Section: Details */}
        <View style={styles.contentSection}>
          <BoldText
            color={Colors.themeText}
            fontSize={responsiveFontSize(2)}
            fontWeight="700"
            title={data?.categoryId?.categoryName || 'Service Name'}
            numberOfLines={1}
          />

          <View style={styles.infoRowContainer}>
            {/* Date and Time Row */}
            <View style={styles.iconTextRow}>
              <View style={styles.subItem}>
                <SvgIcons xml={calendar} height={14} width={14} />
                <NormalText
                  fontSize={responsiveFontSize(1.4)}
                  color="#9DA5B3"
                  title={moment(data?.selectDate).format('MMM DD, YYYY')}
                />
              </View>
              {/* <View style={styles.subItem}>
                <SvgIcons xml={timeIcon} height={14} width={14} />
                <NormalText
                  fontSize={responsiveFontSize(1.4)}
                  color="#9DA5B3"
                  title={moment(data?.selectDate).format('hh:mm A')}
                />
              </View> */}
            </View>

            {/* Address Row */}
            <View style={styles.subItem}>
              <SvgIcons xml={pin} height={14} width={14} />
              <NormalText
                fontSize={responsiveFontSize(1.4)}
                color="#9DA5B3"
                title={data?.address || 'Address'}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>

        {/* Right Side: Price & Status */}
        <View style={styles.rightSide}>
          <Button
            activeOpacity={1}
            textColor={statusStyle.text}
            textFont={responsiveFontSize(1.6)}
            title={data?.status || 'Pending'}
            bgColor={statusStyle.bg}
            height={responsiveHeight(3.5)}
            width={responsiveWidth(25)}
            borderRadius={responsiveHeight(0.5)}
            handlePress={() => {}} // Disabled interaction
          />
          <NormalText
            fontWeight="800"
            fontSize={responsiveFontSize(2)}
            color={Colors.themeText}
            title={`$${data?.total?.toFixed(1) || 0}`}
            alignSelf="flex-end"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: responsiveHeight(1.5),
    borderColor: '#F0F0F0',
    borderWidth: 1.5,
    padding: responsiveHeight(1.5),
    backgroundColor: Colors.white,
    marginBottom: responsiveHeight(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsiveWidth(3),
  },
  image: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    borderRadius: responsiveHeight(1),
    backgroundColor: Colors.lightGray,
  },
  contentSection: {
    flex: 1,
    gap: responsiveHeight(0.8),
  },
  infoRowContainer: {
    gap: 6,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1, // Ensures long text doesn't push price out
    paddingTop: responsiveHeight(1),
  },
  rightSide: {
    height: responsiveHeight(10),
    justifyContent: 'space-between',
  },
});

export default BookingCard;

// import {
//   View,
//   TouchableOpacity,
//   Image,
//   ViewStyle,
//   ImageStyle,
// } from 'react-native';
// import React from 'react';
// import {BoldText, NormalText} from './Titles';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../assets/responsive_dimensions';
// import {calendar, pin, time as timeIcon} from '../assets/icons';
// import SvgIcons from './SvgIcons';
// import {Colors} from '../assets/colors';
// import {Button} from './Button';
// import {ImageBaseUrl} from '../BaseUrl';
// import moment from 'moment';
// interface BookingCardProps {
//   data: any;
//   handlePress: () => void;
// }
// const BookingCard: React.FC<BookingCardProps> = ({data, handlePress}) => {
//   const displayImage = data?.categoryId?.image || data?.images?.[0];

//   return (
//     <TouchableOpacity
//       activeOpacity={0.7}
//       onPress={handlePress}
//       style={{
//         borderRadius: responsiveHeight(1),
//         borderColor: '#EFEFEF',
//         borderWidth: 2,
//         paddingVertical: responsiveHeight(2),
//         paddingHorizontal: responsiveHeight(1),
//       }}>
//       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//         <View style={{flexDirection: 'row', gap: responsiveHeight(1)}}>
//           <Image
//             style={{
//               height: responsiveHeight(9.5),
//               width: responsiveWidth(19),
//               borderRadius: responsiveHeight(1),
//               backgroundColor: Colors.lightGray,
//             }}
//             source={{
//               uri: `${ImageBaseUrl}${displayImage}`,
//             }}
//           />
//           <View
//             style={{maxWidth: responsiveWidth(55), gap: responsiveHeight(1)}}>
//             <Button
//               activeOpacity={1}
//               textColor="#2A1D51"
//               alignSelf="auto"
//               textFont={responsiveFontSize(1.8)}
//               title={data?.status}
//               bgColor="#E8EAFE"
//               height={responsiveHeight(5)}
//               width={responsiveWidth(30)}
//               borderColor={''}
//               borderRadius={0}
//               xml={''}
//               handlePress={() => {}}
//             />
//             <BoldText
//               color={Colors.themeText}
//               fontSize={responsiveFontSize(2.2)}
//               fontWeight="600"
//               title={data?.categoryId?.categoryName}
//             />
//             {data?.description && (
//               <NormalText
//                 fontSize={responsiveFontSize(1.5)}
//                 color="#9DA5B3"
//                 title={data?.description}
//               />
//             )}
//             <View style={{gap: 10, marginTop: 5}}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: responsiveHeight(1),
//                 }}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: responsiveHeight(1),
//                   }}>
//                   <SvgIcons xml={calendar} height={20} width={20} />
//                   <NormalText
//                     fontSize={responsiveFontSize(1.5)}
//                     color="#9DA5B3"
//                     alignSelf="none"
//                     title={moment(data?.selectDate).format('MMM DD, YYYY')}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: responsiveHeight(1),
//                   }}>
//                   <SvgIcons xml={timeIcon} height={20} width={20} />
//                   <NormalText
//                     fontSize={responsiveFontSize(1.5)}
//                     color="#9DA5B3"
//                     alignSelf="none"
//                     title={moment(data?.selectDate).format('hh:mm A')}
//                   />
//                 </View>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: responsiveHeight(1),
//                 }}>
//                 <SvgIcons xml={pin} height={20} width={20} />
//                 <NormalText
//                   fontSize={responsiveFontSize(1.5)}
//                   color="#9DA5B3"
//                   alignSelf="none"
//                   title={data?.address}
//                 />
//               </View>
//             </View>
//           </View>
//         </View>
//         <View>
//           <NormalText
//             fontWeight="800"
//             fontSize={responsiveFontSize(2.2)}
//             color={Colors.themeText}
//             title={`$${data?.total}`}
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default BookingCard;
