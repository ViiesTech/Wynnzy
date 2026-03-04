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

const CalendarCard = ({
  onDatesSelect,
}: {
  onDatesSelect: (dates: Date[]) => void;
}) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
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

  const handleDateChange = (date: any, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'END_DATE') {
      const startDate = selectedDates[0];
      const endDate = moment(date).startOf('day').toDate();
      const range: Date[] = [];
      let current = moment(startDate);
      while (current.isSameOrBefore(endDate)) {
        range.push(current.toDate());
        current.add(1, 'days');
      }
      setSelectedDates(range);
      onDatesSelect(range);
    } else {
      const startDate = moment(date).startOf('day').toDate();
      setSelectedDates([startDate]);
      onDatesSelect([startDate]);
    }
  };

  const formatDates = () => {
    if (selectedDates.length === 0) {return 'Select Date';}
    if (selectedDates.length === 1)
      {return moment(selectedDates[0]).format('MMMM DD, YYYY');}
    return `${moment(selectedDates[0]).format('MMM DD')} - ${moment(
      selectedDates[selectedDates.length - 1],
    ).format('MMM DD, YYYY')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.datePicker} onPress={showCalendar}>
        <Text
          style={[
            styles.dateText,
            selectedDates.length === 0 && styles.placeholder,
          ]}>
          {formatDates()}
        </Text>
        <SvgXml xml={calendarIcon} height={20} width={20} />
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideCalendar}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.calendarContainer, {opacity: fadeAnim}]}>
            <CalendarPicker
              allowRangeSelection={true}
              onDateChange={handleDateChange}
              selectedDayColor={Colors.buttonBg}
              selectedDayTextColor={Colors.white}
              todayBackgroundColor="#E6E6E6"
              minDate={new Date()}
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
