import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { ShowToast } from '../GlobalFunctions/Auth';

// Define types for initial state
interface UserState {
  user: any[];
  userType: string;
  userData: Record<string, any>;
  businessProfileData: Record<string, any>;
  token: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: [],
  userType: '',
  userData: {},
  businessProfileData: {},
  token: '',
  isLoading: false,
  error: null,
};

// Define return type of API response
interface LoginResponse {
  status: string;
  token: string;
  userData: object;
}

// Async Thunk with TypeScript
export const UserLogin = createAsyncThunk<LoginResponse, AxiosRequestConfig>(
  'auth/UserLogin',
  async (config, { rejectWithValue }) => {
    try {
      const response = await axios.request<LoginResponse>(config);
      console.log('response===>>>', JSON.stringify(response.data));
      console.log('response===>>>', response.data.token);
      if (response.data.success) {
        ShowToast('success', 'Login Successful');
        return response?.data;
      } else {
        ShowToast('success', response?.data?.message);

        return rejectWithValue('Login failed');
      }
    } catch (error: any) {
      console.log('errpr', error.response.data.message);
      ShowToast('error', error.response.data.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

// Redux Slice with TypeScript
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = '';
      state.userData = {};
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action: PayloadAction<Record<string, any>>) => {
      state.userData = action.payload;
    },
    setBusinessProfileData: (state, action: PayloadAction<Record<string, any>>) => {
      state.businessProfileData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UserLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userData = action.payload.data;
        console.log('action.payload<<<<=====', action.payload);
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // ✅ Ensured `error` is always a string
      });
  },
});

export const { clearToken, setUserData, setToken, setBusinessProfileData } = authSlice.actions;
export default authSlice.reducer;
