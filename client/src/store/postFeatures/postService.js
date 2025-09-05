import { emiloMediaApi } from '../apiService';

emiloMediaApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: (page = 1) => ({
        url: `/post/all?page=${page}`,
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 60,
      providesTags: (result, error) => {
        if (error) {
          return [{ type: 'Post', id: 'LIST' }];
        }
        if (result && result.data && Array.isArray(result.data)) {
          const tags = [
            ...result.data.map(({ _id }) => {
              return { type: 'Post', id: _id };
            }),
            { type: 'Post', id: 'LIST' },
          ];
          return tags;
        }
        return [{ type: 'Post', id: 'LIST' }];
      },
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
      providesTags: ['Like'],
    }),
    likeAndUnlikePostService: builder.mutation({
      query: (postId) => {
        return {
          url: `/post/likeAndUnlike/${postId}`,
          method: 'PUT',
          credentials: 'include',
        };
      },
      invalidatesTags: (result, error, postId) => {
        console.log('🔄 invalidatesTags called:');
        console.log('  - result:', result);
        console.log('  - error:', error);
        console.log('  - postId:', postId);

        if (error) {
          console.log('❌ Error occurred, no tags invalidated');
          return [];
        }

        const tagsToInvalidate = [
          { type: 'Post', id: postId },
          { type: 'Post', id: 'LIST' },
          { type: 'Like', id: postId },
          { type: 'Like', id: 'LIST' },
        ];

        console.log('🏷️ Invalidating tags:', tagsToInvalidate);
        return tagsToInvalidate;
      },
      async onQueryStarted(postId, { queryFulfilled, dispatch, getState }) {
        console.log('🚀 Like/Unlike onQueryStarted for postId:', postId);
        const patchResult = dispatch(
          emiloMediaApi.util.updateQueryData(
            'getAllPost',
            undefined,
            (draft) => {
              const post = draft.data?.find((p) => p._id === postId);
              console.log('🔍 Found post:', post);
              if (post) {
                console.log(
                  '🔄 Optimistic update - current likes:',
                  post.likes?.length || 0
                );
                const currentUserId = getState().auth?.user?._id;

                if (currentUserId) {
                  const hasLiked = post.likes?.includes(currentUserId);

                  if (hasLiked) {
                    post.likes = post.likes.filter(
                      (id) => id !== currentUserId
                    );
                    post.likesCount =
                      (post.likesCount || post.likes.length) - 1;
                    console.log('👎 Optimistically removed like');
                  } else {
                    post.likes = post.likes || [];
                    if (!post.likes.includes(currentUserId)) {
                      post.likes.push(currentUserId);
                    }
                    post.likesCount =
                      (post.likesCount || post.likes.length - 1) + 1;
                    console.log('👍 Optimistically added like');
                  }

                  console.log('🔄 New likes count:', post.likesCount);
                }
              }
            }
          )
        );

        try {
          console.log('⏳ Waiting for like/unlike request to complete...');
          const { data: response } = await queryFulfilled;

          console.log('📨 Like/Unlike response:', response);

          if (!response?.success) {
            console.error('❌ Like/Unlike failed:', response?.message);
            throw new Error(
              response?.message || 'Like/Unlike operation failed'
            );
          }

          console.log('✅ Like/Unlike completed successfully');
        } catch (error) {
          console.error('💥 Like/Unlike error:', error);

          // Revert optimistic update on error
          patchResult.undo();
          console.log('🔄 Reverted optimistic update due to error');

          throw error;
        }
      },
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
