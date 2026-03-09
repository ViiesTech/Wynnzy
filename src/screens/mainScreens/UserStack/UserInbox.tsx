import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import DaycareHeader from '../../../Components/DaycareHeader';
import {Colors} from '../../../assets/colors';
import {responsiveFontSize} from '../../../assets/responsive_dimensions';
import SvgIcons from '../../../Components/SvgIcons';
import * as Icons from '../../../assets/icons';
import {ImageBaseUrl} from '../../../BaseUrl';
import UserHeader from '../../../Components/UserHeader';

const UserInbox = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hello! I would like to know more about...',
      time: '10:00 AM',
      unreadCount: 2,
      avatar: null,
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Thank you for the update!',
      time: 'Yesterday',
      unreadCount: 0,
      avatar: null,
    },
    {
      id: '3',
      name: 'Pet Care Center',
      lastMessage: 'See you next weekend!',
      time: 'Wednesday',
      unreadCount: 0,
      avatar: null,
    },
  ]);
  const renderChatItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('UserChat', {chatData: item})}
      activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image
            source={{uri: `${ImageBaseUrl}${item.avatar}`}}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader title="Inbox" navigation={navigation} centerText={true} />
        <View style={styles.searchContainer}>
          <View style={styles.searchInner}>
            <View style={styles.searchIconContainer}>
              <SvgIcons xml={Icons.search} width={20} height={20} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="#9DA5B3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default UserInbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    marginTop: 10,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    paddingVertical: 0,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  placeholderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.buttonBg,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: Colors.black,
  },
  timeText: {
    fontSize: responsiveFontSize(1.4),
    color: '#8E8E93',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: responsiveFontSize(1.7),
    color: '#6B7280',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
