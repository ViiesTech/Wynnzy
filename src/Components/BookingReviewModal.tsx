import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating-widget';

// Assets & Utils
import {Colors} from '../assets/colors';
import {images} from '../assets/images';
import {chevronDown} from '../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';

// Components
import {Button} from './Button';
import SvgIcons from './SvgIcons';
import Rating from './Rating';
import {BoldText, NormalText} from './Titles';

// API
import {addReview} from '../GlobalFunctions';
import {ShowToast} from '../GlobalFunctions/Auth';

interface BookingReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  managerId: string;
  navigation: any;
}

const BookingReviewModal: React.FC<BookingReviewModalProps> = ({
  isVisible,
  onClose,
  userId,
  managerId,
  navigation,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [feedbackGiven, setFeedBackGiven] = useState(false);
  const [reviewDetails, setReviewDetails] = useState({
    satisfaction: 'Good',
    responsiveness: 'Good',
    amenities: 'Good',
  });

  // Reset state whenever modal is opened
  useEffect(() => {
    if (isVisible) {
      setRating(0);
      setComment('');
      setFeedBackGiven(false);
      setReviewDetails({
        satisfaction: 'Good',
        responsiveness: 'Good',
        amenities: 'Good',
      });
    }
  }, [isVisible]);

  const addReviewHandler = async () => {
    if (rating === 0) {
      return ShowToast('error', 'Please provide a star rating');
    }

    const {satisfaction, responsiveness, amenities} = reviewDetails;
    let payload = {
      userId: userId,
      managerId: managerId,
      stars: rating,
      satisfaction: satisfaction,
      responsiveness: responsiveness,
      amenities: amenities,
      comment: comment,
    };
    console.log('payload in addReview:-', JSON.stringify(payload, null, 2));
    setReviewLoading(true);
    try {
      const response = await addReview(JSON.stringify(payload));
      console.log('response in addReview:-', response);
      if (response?.success) {
        setFeedBackGiven(true);
      } else {
        ShowToast('error', response?.message || 'Submission failed');
      }
    } catch (error) {
      ShowToast('error', 'Could not submit review');
      console.log('error in addReview:-', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => !reviewLoading && handleClose()}
      onSwipeComplete={handleClose}
      swipeDirection="down"
      style={styles.modalStyle}
      avoidKeyboard={true} // Modal-specific prop to handle keyboard
      propagateSwipe={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={styles.modalContent}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {feedbackGiven ? (
              <View style={styles.successContainer}>
                <Image source={images.green} style={styles.successImage} />
                <BoldText
                  title="Submitted!"
                  fontSize={responsiveFontSize(3)}
                  alignSelf="center"
                />
                <NormalText
                  mrgnTop={10}
                  txtAlign="center"
                  alignSelf="center"
                  title="Thanks for sharing your feedback with us!"
                />
                <Button
                  mrgnTop={30}
                  handlePress={() => {
                    handleClose();
                    navigation.navigate('BottomStack');
                  }}
                  title="Go to Home"
                  bgColor={Colors.buttonBg}
                  textColor={Colors.white}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingTop: responsiveHeight(2),
                  paddingBottom: responsiveHeight(4),
                }}>
                <View style={styles.ratingSection}>
                  <BoldText
                    title="How was your experience?"
                    fontSize={responsiveFontSize(2.2)}
                  />
                  <StarRating
                    rating={rating}
                    onChange={setRating}
                    starSize={35}
                    color={Colors.buttonBg}
                    animationConfig={{scale: 1.1}}
                  />
                </View>

                <View style={styles.ratingsList}>
                  <Rating
                    activeCategory={reviewDetails.satisfaction}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, satisfaction: v}))
                    }
                    headerTitle="Overall Satisfaction"
                  />
                  <Rating
                    activeCategory={reviewDetails.responsiveness}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, responsiveness: v}))
                    }
                    headerTitle="Responsiveness"
                  />
                  <Rating
                    activeCategory={reviewDetails.amenities}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, amenities: v}))
                    }
                    headerTitle="Amenities"
                  />
                </View>

                <TextInput
                  onChangeText={setComment}
                  value={comment}
                  placeholder="Tell us more about the service (optional)..."
                  placeholderTextColor={'#969AA8'}
                  multiline
                  style={styles.commentInput}
                />

                <Button
                  isLoading={reviewLoading}
                  handlePress={addReviewHandler}
                  title="Submit Review"
                  bgColor={Colors.buttonBg}
                  textColor={Colors.white}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BookingReviewModal;

const styles = StyleSheet.create({
  modalStyle: {margin: 0, justifyContent: 'flex-end'},
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  successContainer: {alignItems: 'center', paddingVertical: 50},
  successImage: {
    height: 90,
    width: 90,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  closeBtn: {alignSelf: 'center', padding: 5},
  ratingSection: {alignItems: 'center', gap: 10, marginVertical: 20},
  ratingsList: {gap: 0},
  commentInput: {
    minHeight: 100,
    color: '#000',
    padding: 15,
    backgroundColor: '#F8F9FA',
    marginTop: 25,
    marginBottom: 20,
    borderRadius: 15,
    textAlignVertical: 'top',
    fontSize: responsiveFontSize(1.8),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
});
