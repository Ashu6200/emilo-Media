import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';
import { logout } from './authFeatures/authSlice';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl + `/api`;
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    console.warn('Failed to decode token:', e);
    return true;
  }
};
const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState, dispatch, endpoint }) => {
    const state = getState();
    const token = state.authStore?.token;
    headers.delete('Content-Type');
    const jsonEndpoints = ['loginService', 'registerService', 'getUserProfile'];
    if (jsonEndpoints.includes(endpoint)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    const publicEndpoints = ['loginService', 'registerService'];
    if (token && !publicEndpoints.includes(endpoint)) {
      if (isTokenExpired(token)) {
        dispatch(logout());
      } else {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  },
});

export const emiloMediaApi = createApi({
  reducerPath: 'emiloMedia',
  baseQuery: baseQuery,
  tagTypes: [
    'User',
    'Post',
    'Like',
    'Comment',
    'Employee',
    'Pricing',
    'approvePost',
    'paidPost',
  ],
  endpoints: (builder) => ({
    getLiveStatus: builder.query({
      query: () => ({
        url: '/live',
        method: 'GET',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Live status:', data);
        } catch (error) {
          console.error('Error fetching live status:', error);
        }
      },
    }),
    getHealthStatus: builder.query({
      query: () => '/health',
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Health status:', data);
        } catch (error) {
          console.error('Error fetching health status:', error);
        }
      },
    }),
  }),
});

export const { useGetLiveStatusQuery, useGetHealthStatusQuery } = emiloMediaApi;
