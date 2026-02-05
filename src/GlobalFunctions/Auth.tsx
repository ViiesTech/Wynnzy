import {BaseUrl} from '../BaseUrl';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {setBusinessProfileData, setUserData, UserLogin} from '../redux/Slices';

export const socialLoginTypes = {
  google: 'Google',
  apple: 'Apple',
};

export const ShowToast = (type: string, text: string) => {
  return Toast.show({
    type: type,
    text1: text,
  });
};

export const Signup = async (
  fullname: string,
  email: string,
  password: string,
  type: string,
): Promise<any> => {
  let data = JSON.stringify({
    fullName: fullname,
    email: email.toLowerCase(),
    password: password,
    type: type,
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/signup`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const handleLogin = async (
  email: string,
  password: string,
  dispatch: any,
) => {
  let data = JSON.stringify({
    email: email.toLowerCase(),
    password: password,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/login`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  dispatch(UserLogin(config));
};
export const SocialLogin = (body: any, dispatch: any) => {
  const {email, nickName, type, socialId} = body;
  let data = JSON.stringify({
    email: email.toLowerCase(),
    nickName: nickName,
    type: type,
    socialId: socialId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/socialLogin`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  return dispatch(UserLogin(config));
};
export const forgetPasswordApi = async (email: string) => {
  let data = JSON.stringify({
    email: email,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/forgetPassword`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    console.log('ress', response.data);
    return response.data;
  } catch (error) {
    console.log('error', error.response.data.message);
    throw error.response.data.message;
  }
};
export const resetPassword = async (email: string, password: any) => {
  let data = JSON.stringify({
    email: email,
    newPassword: password,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/resetPassword`,
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
export const verifyOtp = async (email: string, otp: number, token: string) => {
  console.log('email<><><>', email);
  console.log('otp<><><><>', otp);
  let data = JSON.stringify({
    email: email,
    Otp: otp,
    addSignUpToken: token,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/verifyOtp`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const verifyOtpPassword = async (email: string, otp: number) => {
  console.log('email<><><>', email);
  console.log('otp<><><><>', otp);
  let data = JSON.stringify({
    email: email,
    Otp: otp,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/verifyPasswordOTP`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const resendOtp = async (email: string) => {
  let data = JSON.stringify({
    email: email,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/resendOtp`,
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

export const createBusinessProfile = async (
  managerId: string,
  image: any,
  fullName: string,
  businessName: string,
  contactNo: any,
  bio: string,
  experienceLvl: number,
  bType: string,
  services: string,
  address: string,
  certificates: any,
  portfolioImages: any,
  locationName: string,
  lat: number,
  lng: number,
  dispatch: any,
  navigation: any,
  userData: any,
) => {
  let data = new FormData();
  // data.append('candayName', candyName);
  data.append('managerId', managerId);
  data.append('profileImage', {
    uri: image,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
  data.append('fullName', fullName);
  data.append('businessName', businessName);
  data.append('contactNumber', contactNo);
  data.append('bio', bio);
  data.append('expLevel', experienceLvl);
  data.append('bType', JSON.stringify(bType));
  data.append('services', JSON.stringify(services));
  data.append('address', address);
  certificates.forEach((file, index) => {
    data.append('certificate', {
      uri: file.uri,
      name: file.name || `certificate_${index}.pdf`,
      type: file.type || 'application/pdf',
    });
  });
  portfolioImages.forEach((file, index) => {
    data.append('image', {
      uri: file.uri,
      name: file.name || `certificate_${index}.pdf`,
      type: file.type || 'application/pdf',
    });
  });
  data.append('locationName', locationName);
  data.append('longitude', lng);
  data.append('latitude', lat);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/createBProfile`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  console.log('data', data);
  try {
    const response = await axios.request(config);
    console.log('Post Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      dispatch(setUserData({...userData, profileCreated: true}));
      dispatch(setBusinessProfileData(response.data.data));
      navigation.navigate('BottomStack');
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error(
      'Error creating post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
export const editBusinessProfile = async ({
  id,
  image,
  fullName,
  storeName,
  bType,
  address,
  services,
  certificates,
  portfolio,
  contactNo,
  bio,
  experienceLvl,
  location,
  dispatch,
  navigation,
}: {
  id: string;
  image: any;
  fullName: string;
  storeName: string;
  bType?: string;
  address?: string;
  services?: string;
  certificates?: any[];
  portfolio?: any[];
  contactNo?: string;
  bio?: string;
  experienceLvl?: number;
  location?: {lat: number; lng: number; address: string};
  dispatch?: any;
  navigation?: any;
}) => {
  const data = new FormData();
  data.append('businessProfileId', id);
  if (bType) {
    data.append('bType', bType);
  }
  if (image) {
    data.append('profileImage', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  }
  if (fullName) {
    data.append('fullName', fullName);
  }
  if (storeName) {
    data.append('businessName', storeName);
  }
  if (address) {
    data.append('address', address);
  }
  if (services) {
    data.append('services', services);
  }
  if (contactNo) {
    data.append('contactNo', contactNo);
  }
  if (bio) {
    data.append('bio', bio);
  }
  if (experienceLvl !== undefined) {
    data.append('experienceLvl', experienceLvl.toString());
  }
  if (location) {
    data.append('lat', location.lat.toString());
    data.append('lng', location.lng.toString());
    data.append('location', location.address);
  }
  if (certificates?.length) {
    certificates.forEach((file, index) => {
      data.append('certificate', {
        uri: file.uri,
        name: file.name || `certificate_${index}.pdf`,
        type: file.type || 'application/pdf',
      });
    });
  }
  if (portfolio?.length) {
    portfolio.forEach((file, index) => {
      data.append('image', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });
  }
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/updateBProfile`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  // console.log('data', data);
  try {
    const response = await axios.request(config);
    console.log('Post Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      dispatch(setBusinessProfileData(response.data.data));
      navigation.goBack();
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error(
      'Error Updating Post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
  // axios request code remains the same...
};

export const createPetProfile = async (
  userId: string,
  petName: string,
  dob: any,
  breed: string,
  size: string,
  specialCareNeed: string,
  petImages: any,
  weight: string,
  height: string,
  color: string,
  profileImage: any,
  behaviour: string,
  description: string,
) => {
  let data = new FormData();
  data.append('userId', userId);
  data.append('petName', petName);
  // data.append('dob', '12-2-2024');
  data.append('dob', dob);
  data.append('breed', breed);
  data.append('size', size);
  data.append('specialCareNeed', specialCareNeed);
  petImages.forEach((uri, index) => {
    data.append('petImages', {
      uri,
      name: `petImage${index}.jpg`,
      type: 'image/jpeg',
    });
  });
  data.append('weight', Number(weight));
  data.append('height', Number(height));
  data.append('color', color);
  data.append('profileImage', {
    uri: profileImage,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
  data.append('behaviour', behaviour);
  data.append('description', description);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/createPet`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log('Post Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error(
      'Error creating post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
export const editPetProfile = async (
  userId: string,
  petName: string,
  dob: any,
  breed: string,
  size: string,
  specialCareNeed: string,
  petImages: any,
  weight: string,
  height: string,
  color: string,
  profileImage: any,
  behaviour: string,
  description: string,
) => {
  let data = new FormData();
  data.append('id', userId);
  if (petName) {
    data.append('petName', petName);
  }
  // data.append('dob', '12-2-2024');
  if (dob) {
    data.append('dob', dob);
  }
  if (breed) {
    data.append('breed', breed);
  }
  if (size) {
    data.append('size', size);
  }
  if (specialCareNeed) {
    data.append('specialCareNeed', specialCareNeed);
  }
  if (petImages) {
    petImages.forEach((uri, index) => {
      data.append('petImages', {
        uri,
        name: `petImage${index}.jpg`,
        type: 'image/jpeg',
      });
    });
  }
  if (weight) {
    data.append('weight', Number(weight));
  }
  if (height) {
    data.append('height', Number(height));
  }
  if (color) {
    data.append('color', color);
  }
  if (profileImage) {
    data.append('profileImage', {
      uri: profileImage,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  }
  if (behaviour) {
    data.append('behaviour', behaviour);
  }
  if (description) {
    data.append('description', description);
  }
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/updatePet`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log('Edit Profile Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error(
      'Error creating post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllPets = async (userId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getAllPets?userId=${userId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPetProfile = async (petProfileId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getPet?petProfileId=${petProfileId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getBusinessProfile = async (businessId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getBProfile?businessId=${businessId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (
  userId: string,
  image: any,
  fullName: string,
  navigation: any,
  dispatch: any,
) => {
  let data = new FormData();
  data.append('userId', userId);
  if (image) {
    data.append('Image', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  }
  if (fullName) {
    data.append('fullName', fullName);
  }
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}/user/updateUser`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log('Post Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      dispatch(setUserData(response.data.data));
      navigation.goBack();
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);

    console.error(
      'Error creating post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/getUser?userId=${userId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateBookingStatus = async (
  bookingId: string,
  status: string,
) => {
  let data = JSON.stringify({
    bookingId: bookingId,
    status: status,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/updateBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (err) {
    ShowToast('error', err.response.data.message);
    throw err;
  }
};
export const deleteBooking = async (bookingId: string) => {
  let data = JSON.stringify({
    id: bookingId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}user/deleteBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    ShowToast('error', error?.response?.data?.message);
    throw error;
  }
};
export const getAllProducts = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}/getAllProducts`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
