import { emiloMediaApi } from '../apiService';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPricingsService: builder.query({
      query: () => ({
        url: '/pricing/all',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Pricing'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data) {
            throw new Error(message);
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    createPricingService: builder.mutation({
      query: (formData) => ({
        url: '/pricing/create',
        method: 'POST',
        credentials: 'include',
        body: formData,
      }),
      invalidatesTags: ['Pricing'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data) {
            throw new Error(message);
          }
        } catch (error) {
          throw error?.error || error;
        }
      },
    }),
    updatePricingService: builder.mutation({
      query: (postId, formdata) => ({
        url: `/pricing/update/${postId}`,
        method: 'PUT',
        credentials: 'include',
        body: formdata,
      }),
      invalidatesTags: ['Pricing'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid server response format');
          }
          const { success, message, data } = response;
          if (!success || !data) {
            throw new Error(message);
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
  useGetAllPricingsServiceQuery,
  useCreatePricingServiceMutation,
  useUpdatePricingServiceMutation,
} = emiloMediaApi;
