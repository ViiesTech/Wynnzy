import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Colors} from '../../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../../../assets/responsive_dimensions';
import SvgIcons from '../../../Components/SvgIcons';
import {forward} from '../../../assets/icons';
import {ImageBaseUrl} from '../../../BaseUrl';
import TextHeader from '../../../Components/TextHeader';
import DaycareHeader from '../../../Components/DaycareHeader';
import UserHeader from '../../../Components/UserHeader';

const Chat = ({navigation, route}: any) => {
  const {businessProfileData} = useSelector((state: any) => state.user);
  const {profileImage} = businessProfileData || {};
  const chatData = route?.params?.chatData;
  console.log('chatData:-', chatData);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I would like to know more about your daycare services.',
      sender: 'user',
      time: '10:00 AM',
    },
    {
      id: '2',
      text: 'Hi there! We provide a variety of activities for pets. What specifically are you interested in?',
      sender: 'daycare',
      time: '10:02 AM',
    },
    {
      id: '3',
      text: 'Do you have overnight boarding available for next weekend?',
      sender: 'user',
      time: '10:05 AM',
    },
    {
      id: '4',
      text: 'Yes, we do have some slots open. Would you like me to share the pricing?',
      sender: 'daycare',
      time: '10:07 AM',
    },
  ]);

  const sendMessage = () => {
    if (inputMessage.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputMessage,
        sender: 'daycare',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      Keyboard.dismiss();
    }
  };

  const renderMessageItem = ({item}: any) => {
    const isDaycare = item.sender === 'daycare';
    return (
      <View
        style={[
          styles.messageWrapper,
          isDaycare ? styles.daycareWrapper : styles.userWrapper,
        ]}>
        {!isDaycare && (
          <View style={styles.userAvatarContainer}>
            <View style={styles.userProfilePlaceholder}>
              <Text style={styles.profileText}>{chatData?.name.charAt(0)}</Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isDaycare ? styles.daycareBubble : styles.userBubble,
          ]}>
          <Text style={isDaycare ? styles.daycareText : styles.userText}>
            {item.text}
          </Text>
          <Text style={isDaycare ? styles.daycareTime : styles.userTime}>
            {item.time}
          </Text>
        </View>

        {isDaycare && (
          <View style={styles.daycareAvatarContainer}>
            {profileImage ? (
              <FastImage
                source={{uri: `${ImageBaseUrl}${profileImage}`}}
                style={styles.avatarImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.daycareProfilePlaceholder}>
                <Text style={styles.profileText}>D</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader
        backIcon={true}
        navigation={navigation}
        title={chatData?.name}
        centerText={true}
      />

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <View style={styles.inputOuterContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#9DA5B3"
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              activeOpacity={0.8}
              style={styles.sendButton}>
              <View style={styles.iconCircle}>
                <SvgIcons xml={forward} height={20} width={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: responsiveHeight(2),
    flexGrow: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: responsiveHeight(2),
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  dateText: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: responsiveHeight(2),
    width: '100%',
  },
  daycareWrapper: {
    justifyContent: 'flex-end',
  },
  userWrapper: {
    justifyContent: 'flex-start',
  },
  userAvatarContainer: {
    marginRight: 8,
  },
  daycareAvatarContainer: {
    marginLeft: 8,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
  },
  messageBubble: {
    padding: responsiveHeight(1.6),
    borderRadius: 20,
    maxWidth: '78%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  daycareBubble: {
    backgroundColor: Colors.buttonBg,
    borderBottomRightRadius: 4,
  },
  userBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  daycareText: {
    color: Colors.white,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '500',
    lineHeight: 22,
  },
  userText: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '500',
    lineHeight: 22,
  },
  daycareTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: responsiveFontSize(1.1),
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.1),
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  userProfilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daycareProfilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputOuterContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  attachButton: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 10,
  },
  iconCircle: {
    backgroundColor: Colors.buttonBg,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.buttonBg,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
