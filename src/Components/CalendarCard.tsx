import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Easing } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { SvgXml } from 'react-native-svg';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
import { calendarIcon } from '../assets/icons';

const CalendarCard = ({ onDateSelect }: { onDateSelect: (date: Date) => void }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const showCalendar = () => {
    setCalendarVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300, // Smooth fade-in
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideCalendar = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200, // Smooth fade-out
      useNativeDriver: true,
    }).start(() => setCalendarVisible(false)); // Close modal after fade-out
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);        // ✅ Keep it as a Date object
    onDateSelect(date);           // ✅ Send full Date object to parent
    hideCalendar();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.datePicker} onPress={showCalendar}>
        <Text style={[styles.dateText, !selectedDate && styles.placeholder]}>
          {selectedDate ? selectedDate.toDateString() : 'Select Date'}
        </Text>
        <SvgXml xml={calendarIcon} height={20} width={20} />
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        animationType="none" // Disable default animation
        transparent={true}
        onRequestClose={hideCalendar}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.calendarContainer, { opacity: fadeAnim }]}>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedDayColor={Colors.buttonBg}
              selectedDayTextColor={Colors.white}
              todayBackgroundColor={Colors.buttonBg}
            />
            <TouchableOpacity onPress={hideCalendar} style={styles.confirmButton}>
              <Text style={styles.closeButtonText}>Confirm</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(91),
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: responsiveHeight(2.5),
    width: responsiveWidth(95),
  },
  confirmButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: responsiveHeight(1.7),
    alignItems: 'center',
    width: responsiveWidth(80),
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
});

export default CalendarCard;
