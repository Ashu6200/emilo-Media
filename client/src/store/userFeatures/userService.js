import { emiloMediaApi } from '../apiService';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersService: builder.query({
      query: () => ({
        url: '/user/all-users',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
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
    getYourProfileService: builder.query({
      query: () => ({
        url: '/user/me',
        method: 'GET',
        credentials: 'include',
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
    getUserProfileService: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'GET',
        credentials: 'include',
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
    updateYourProfileService: builder.mutation({
      query: (formData) => ({
        url: '/user/update_profile',
        method: 'PUT',
        credentials: 'include',
        body: formData,
      }),
      invalidatesTags: ['User'],
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
    followAndUnfollowUserService: builder.mutation({
      query: (userId) => ({
        url: `/user/followAndUnfollow/${userId}`,
        method: 'PUT',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          console.log(response);
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
    getFollowersListService: builder.query({
      query: (userId) => ({
        url: `/user/followers/${userId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
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
    getFollowingListService: builder.query({
      query: (userId) => ({
        url: `/user/following/${userId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
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
    getPostsListService: builder.query({
      query: (userId) => ({
        url: `/user/posts/${userId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
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
    getSeachUsersService: builder.query({
      query: (query) => ({
        url: `/user/search/q?=${query}`,
        method: 'GET',
        credentials: 'include',
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
    getSuggestedService: builder.query({
      query: (userId) => ({
        url: `/user/suggested/${userId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
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

export const {
  useGetAllUsersServiceQuery,
  useGetYourProfileServiceQuery,
  useGetUserProfileServiceQuery,
  useGetFollowersListServiceQuery,
  useGetFollowingListServiceQuery,
  useGetPostsListServiceQuery,
  useFollowAndUnfollowUserServiceMutation,
  useUpdateYourProfileServiceMutation,
  useGetSuggestedServiceQuery,
  useGetSeachUsersServiceQuery,
} = emiloMediaApi;
