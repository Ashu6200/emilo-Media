import { emiloMediaApi } from '../apiService';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: (page = 1) => ({
        url: `/post/all?page=${page}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
      }),
      providesTags: ['Post'],
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
    getExplorePost: builder.query({
      query: (page = 1) => ({
        url: `/post/explore?page=${page}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
      }),
      providesTags: ['Post'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page > 1) {
          currentCache.push(...newItems);
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
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
    createPostService: builder.mutation({
      query: (formData) => ({
        url: '/post/create',
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Post'],
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
          console.log(error);
          throw error?.error || error;
        }
      },
    }),
    getLikeduserList: builder.query({
      query: (postId) => ({
        url: `/post/likes/${postId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
      }),
      providesTags: ['Post'],
    }),
    getCommentList: builder.query({
      query: (postId) => ({
        url: `/post/comments/${postId}`,
        method: 'GET',
        credentials: 'include',
        keepUnusedDataFor: 60,
      }),
      providesTags: ['Comment'],
    }),
    likeAndUnlikePostService: builder.mutation({
      query: (postId) => ({
        url: `/post/likeAndUnlike/${postId}`,
        method: 'PUT',
        credentials: 'include',
      }),
      invalidatesTags: ['Post'],
    }),
    viewPostService: builder.mutation({
      query: (postId) => ({
        url: `/post/view/${postId}`,
        method: 'PUT',
        credentials: 'include',
      }),
      invalidatesTags: ['Post'],
    }),
    postCommentService: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/post/comments-add/${postId}`,
        method: 'POST',
        credentials: 'include',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    updateCommentService: builder.mutation({
      query: ({ postId, commentId, content }) => ({
        url: `/post/comments-update/${postId}/${commentId}`,
        method: 'PUT',
        credentials: 'include',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteCommentService: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/post/comments-delete/${postId}/${commentId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Post'],
    }),
    commentReplyService: builder.mutation({
      query: ({ postId, commentId, content }) => ({
        url: `/post/comments-reply-add/${postId}/${commentId}`,
        method: 'POST',
        credentials: 'include',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    updatedReplyService: builder.mutation({
      query: ({ postId, commentId, replyId, content }) => ({
        url: `/post/comments-reply-update/${postId}/${commentId}/${replyId}`,
        method: 'PUT',
        credentials: 'include',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteReplyService: builder.mutation({
      query: ({ postId, commentId, replyId }) => ({
        url: `/post/comments-reply-delete/${postId}/${commentId}/${replyId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useGetExplorePostQuery,
  useGetLikeduserListQuery,
  useGetCommentListQuery,
  useCreatePostServiceMutation,
  useLikeAndUnlikePostServiceMutation,
  useViewPostServiceMutation,
  usePostCommentServiceMutation,
  useUpdateCommentServiceMutation,
  useDeleteCommentServiceMutation,
  useCommentReplyServiceMutation,
  useUpdatedReplyServiceMutation,
  useDeleteReplyServiceMutation,
} = emiloMediaApi;
