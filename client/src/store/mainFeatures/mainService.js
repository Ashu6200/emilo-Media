import { emiloMediaApi } from '../apiService';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployeesService: builder.query({
      query: () => ({
        url: '/main/get-employees',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Employee'],
      async onQueryStarted(_arg, { queryFulfilled }) {
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
    createEmployeeService: builder.mutation({
      query: (formData) => ({
        url: '/main/create-empolyee',
        method: 'POST',
        credentials: 'include',
        body: formData,
      }),
      invalidatesTags: ['Employee'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          console.log(response);
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
    appprovePostService: builder.mutation({
      query: ({ postId, approved }) => ({
        url: `/main/approved/${postId}`,
        method: 'PUT',
        credentials: 'include',
        body: { approved },
      }),
      invalidatesTags: ['approvePost'],
    }),
    postListService: builder.query({
      query: () => ({
        url: `/main/postlist`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['approvePost'],
    }),
    approvedPostListService: builder.query({
      query: () => ({
        url: `/main/aprovedPostlist`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['paidPost'],
    }),
    paymentService: builder.mutation({
      query: ({ postId, paid }) => ({
        url: `/main/payment/${postId}`,
        method: 'POST',
        credentials: 'include',
        body: { paid },
      }),
      invalidatesTags: ['paidPost'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllEmployeesServiceQuery,
  useCreateEmployeeServiceMutation,
  useAppprovePostServiceMutation,
  usePostListServiceQuery,
  useApprovedPostListServiceQuery,
  usePaymentServiceMutation,
} = emiloMediaApi;
