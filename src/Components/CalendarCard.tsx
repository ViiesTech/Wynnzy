import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {SvgXml} from 'react-native-svg';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';
import {calendarIcon} from '../assets/icons';
import moment from 'moment';

const CalendarCard = ({onDateSelect}: {onDateSelect: (date: Date) => void}) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showCalendar = () => {
    setCalendarVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const hideCalendar = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setCalendarVisible(false));
  }, [fadeAnim]);

  const handleDateChange = (date: any) => {
    setSelectedDate(date); // ✅ Keep it as a Date object
    onDateSelect(date); // ✅ Send full Date object to parent
    hideCalendar();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.datePicker} onPress={showCalendar}>
        <Text style={[styles.dateText, !selectedDate && styles.placeholder]}>
          {selectedDate
            ? moment(selectedDate).format('MMMM DD, YYYY')
            : 'Select Date'}
        </Text>
        <SvgXml xml={calendarIcon} height={20} width={20} />
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        animationType="fade" // 'fade' works well as a fallback for the Animated View
        transparent={true}
        onRequestClose={hideCalendar}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.calendarContainer, {opacity: fadeAnim}]}>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedDayColor={Colors.buttonBg}
              selectedDayTextColor={Colors.white}
              todayBackgroundColor="#E6E6E6"
              minDate={new Date()} // Prevent past date selection
              width={responsiveWidth(90)}
              textStyle={{color: '#000'}}
            />

            <TouchableOpacity
              onPress={hideCalendar}
              style={styles.confirmButton}>
              <Text style={styles.closeButtonText}>Confirm Selection</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: responsiveHeight(2),
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(91),
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
    borderWidth: 1,
    borderColor: '#EEE',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  placeholder: {
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: responsiveHeight(1),
    padding: responsiveHeight(2),
    width: responsiveWidth(95),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: responsiveHeight(1.8),
    alignItems: 'center',
    width: '100%',
    borderRadius: responsiveHeight(1),
    backgroundColor: Colors.buttonBg,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: responsiveFontSize(2),
  },
});

export default CalendarCard;
