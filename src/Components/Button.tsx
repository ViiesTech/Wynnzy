import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';
import SvgIcons from './SvgIcons';

interface ButtonProps {
  title: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  xml?: string;
  width?: number | string;
  height?: number;
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline';
  textFont?: number;
  icon?: boolean;
  mrgnTop?: number;
  handlePress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
  isLoading?: boolean; // Added for loader support
  loaderColor?: string; // Optional: customize loader color
}

export const Button: FC<ButtonProps> = ({
  title,
  bgColor,
  textColor,
  borderColor,
  borderWidth = 0,
  xml,
  handlePress,
  width,
  alignSelf,
  borderRadius,
  height,
  mrgnTop,
  textFont,
  icon = false,
  activeOpacity = 0.7,
  disabled = false,
  isLoading = false,
  loaderColor,
}) => {
  // Disable button if explicitly disabled OR if currently loading
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      disabled={isButtonDisabled}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: isButtonDisabled ? '#cccccc' : bgColor, // Visual cue for disabled state
          borderWidth: borderWidth,
          borderColor: borderColor,
          marginTop: mrgnTop,
          width: width ? width : '100%',
          height: height ? height : responsiveHeight(7.2),
          alignSelf: alignSelf ? alignSelf : 'center',
          borderRadius: borderRadius ? borderRadius : responsiveHeight(1.4),
        } as any,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          color={loaderColor || textColor || Colors.white}
          size="small"
        />
      ) : icon ? (
        <View style={styles.iconContainer}>
          {xml && <SvgIcons xml={xml} width={25} height={25} />}
          <Text
            style={[
              styles.textStyle,
              {
                color: textColor,
                fontSize: textFont ? textFont : responsiveFontSize(2.4),
              },
            ]}>
            {title}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.textStyle,
            {
              color: textColor,
              fontSize: textFont ? textFont : responsiveFontSize(2.4),
            },
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveHeight(1.5),
  },
  textStyle: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

// /* eslint-disable react-native/no-inline-styles */
// import React, {FC} from 'react';
// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Colors} from '../assets/colors';
// import {
//   responsiveFontSize,
//   responsiveHeight,
// } from '../assets/responsive_dimensions';
// import SvgIcons from './SvgIcons';

// interface ButtonProps {
//   title: any;
//   bgColor: string;
//   textColor: string;
//   borderColor?: string;
//   borderWidth?: number;
//   borderRadius?: number;
//   xml?: string;
//   width?: number;
//   height?: number;
//   alignSelf?:
//     | 'auto'
//     | 'flex-start'
//     | 'flex-end'
//     | 'center'
//     | 'stretch'
//     | 'baseline';
//   textFont?: number;
//   icon?: boolean;
//   mrgnTop?: number;
//   handlePress?: () => void;
//   activeOpacity?: number;
//   disabled?: boolean;
// }

// export const Button: FC<ButtonProps> = ({
//   title,
//   bgColor,
//   textColor,
//   borderColor,
//   borderWidth = 0,
//   xml,
//   handlePress,
//   width,
//   alignSelf,
//   borderRadius,
//   height,
//   mrgnTop,
//   textFont,
//   icon = false,
//   activeOpacity = 0.7,
//   disabled = false,
// }) => {
//   return (
//     <TouchableOpacity
//       activeOpacity={activeOpacity}
//       onPress={handlePress}
//       disabled={disabled}
//       style={[
//         styles.buttonContainer,
//         {
//           backgroundColor: bgColor,
//           borderWidth: borderWidth,
//           borderColor: borderColor,
//           marginTop: mrgnTop,
//           width: width ? width : '100%',
//           height: height ? height : responsiveHeight(7.2),
//           alignSelf: alignSelf ? alignSelf : 'center',
//           borderRadius: borderRadius ? borderRadius : responsiveHeight(1.4),
//         },
//       ]}>
//       {icon ? (
//         <View style={styles.iconContainer}>
//           <SvgIcons xml={xml} width={25} height={25} />
//           <Text
//             style={[
//               styles.textStyle,
//               {
//                 color: textColor,
//                 fontSize: textFont ? textFont : responsiveFontSize(2.4),
//               },
//             ]}>
//             {title}
//           </Text>
//         </View>
//       ) : (
//         <Text
//           style={[
//             styles.textStyle,
//             {
//               color: textColor,
//               fontSize: textFont ? textFont : responsiveFontSize(2.4),
//             },
//           ]}>
//           {title}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   buttonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: responsiveHeight(1.5),
//   },
//   textStyle: {
//     color: Colors.white,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });
