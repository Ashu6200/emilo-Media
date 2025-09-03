import { emiloMediaApi } from '../apiService';
import { login } from './authSlice';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    loginService: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data) {
            throw new Error(message || 'Login failed');
          }
          const user = response.data;
          const { _id, email, role, token } = user;
          dispatch(login({ user: { _id, email, role }, token: token }));
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    registerService: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data) {
            throw new Error(message || 'Login failed');
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const { useLoginServiceMutation, useRegisterServiceMutation } =
  emiloMediaApi;
