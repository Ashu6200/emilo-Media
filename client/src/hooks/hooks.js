import { useContext } from 'react';
import { ThemeProviderContext } from '../utils/theme-provider';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  initSocket,
} from '../utils/SocketProvider';
import { emiloMediaApi } from '../store/apiService';

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export const useSocket = () => {
  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.authStore);
  const { token } = authStore;

  useEffect(() => {
    initSocket(token);
    connectSocket(token);

    const socket = getSocket();
    socket.on('likeUpdate', ({ postId, likers }) => {
      dispatch(
        emiloMediaApi.util.updateQueryData('getAllPost', undefined, (draft) => {
          const post = draft.find((p) => p._id === postId);
          if (post) {
            post.likes = likers;
          }
        })
      );
    });
    socket.on('unlikeUpdate', ({ postId, likers }) => {
      dispatch(
        emiloMediaApi.util.updateQueryData('getAllPost', undefined, (draft) => {
          const post = draft.find((p) => p._id === postId);
          if (post) {
            post.likes = likers;
          }
        })
      );
    });
    socket.on('viewUpdate', ({ postId, views }) => {
      dispatch(
        emiloMediaApi.util.updateQueryData('getAllPost', undefined, (draft) => {
          const post = draft.find((p) => p._id === postId);
          if (post) {
            post.views = views;
          }
        })
      );
    });
    socket.on('newComment', ({ postId, comment }) => {
      dispatch(
        emiloMediaApi.util.updateQueryData('getComments', postId, (draft) => {
          draft.unshift(comment);
        })
      );
      dispatch(
        emiloMediaApi.util.invalidateTags([{ type: 'Post', id: postId }])
      );
    });
    socket.on('newReply', ({ commentId, reply }) => {
      dispatch(
        emiloMediaApi.util.updateQueryData(
          'getComments',
          reply.post,
          (draft) => {
            const parentComment = draft.find((c) => c._id === commentId);
            if (parentComment) {
              parentComment.replies = parentComment.replies || [];
              parentComment.replies.unshift(reply);
            }
          }
        )
      );
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch, token]);

  return null;
};
