import {launchImageLibrary} from 'react-native-image-picker';
import {BaseUrl} from '../BaseUrl';
import axios from 'axios';
import {ShowToast} from './Auth';

export const selectImageFromGallery = () => {
  return new Promise((resolve, reject) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        resolve(null);
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        reject(response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        resolve(response.assets[0].uri);
      } else {
        resolve(null);
      }
    });
  });
};

export const getBusinessProfileById = async managerId => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getBusinessByManager?managerId=${managerId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllServices = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getAllServices`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getServiceById = async serviceId => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getService?serviceId=${serviceId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicesByCategory = async (managerId, status) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/servicesByManagerId?status=${status}&managerId=${managerId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addReview = async (
  userId,
  managerId,
  stars,
  satisfaction,
  responsiveness,
  amenities,
  comment,
) => {
  let data = JSON.stringify({
    userId: userId,
    managerId: managerId,
    stars: stars,
    satisfaction: satisfaction,
    responsiveness: responsiveness,
    amenities: amenities,
    comment: comment,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/createReview`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllReviews = async managerId => {
  let data = '';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getAllReview?managerId=${managerId}`,
    headers: {},
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getReviewById = async reviewId => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getReviewById?reviewId=${reviewId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (id, navigation) => {
  let data = JSON.stringify({
    id: id,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/deleteReview`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      navigation.navigate('BottomStack');
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);
    throw error;
  }
};

export const fetchNearbyBusinesses = async (latitude, longitude) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/nearByBusinesses?longitude=${74.8607}&latitude=${24.8617}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllBusinesses = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getAllBusinesses`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllServicesByManagerId = async managerId => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getAllCategories?managerId=${managerId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllServicesByCategory = async (
  managerId,
  serviceCategoryId,
) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/servicesByManagerId?managerId=${managerId}&status=Active&serviceCategory=${serviceCategoryId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const bookService = async (
  userId,
  petId,
  managerId,
  serviceId,
  categoryId,
  total,
  address,
  selectedDate,
) => {
  let data = JSON.stringify({
    userId: userId,
    petId: petId,
    managerId: managerId,
    // "serviceId": [
    //   "6834d8e1d8e5379b8676ef36",
    //   "683e1646a26eeee81593c275"
    // ],
    serviceId: serviceId,
    categoryId: categoryId,
    total: total,
    address: address,
    // "selectDate": "14-05-2025"
    selectDate: selectedDate,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/createBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookingsByUserId = async (userId, status) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/bookingsByUserId?userId=${userId}&status=${status}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllBookingsByManagerId = async (managerId, status) => {
  let data = '';
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/bookingsByManagerId?managerId=${managerId}&status=${status}`,
    headers: {},
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const searchBusiness = async name => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/searchBusiness?name=${name}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
