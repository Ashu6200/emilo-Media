import { useCallback, useContext, useRef } from 'react';
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
  const { token, isAuthenticated } = authStore;
  const socketInitialized = useRef(false);

  const handleLikeUpdate = useCallback(
    ({ postId, likers }) => {
      try {
        dispatch(
          emiloMediaApi.util.updateQueryData(
            'getAllPost',
            undefined,
            (draft) => {
              if (draft?.data) {
                const post = draft.data.find((p) => p._id === postId);
                if (post) {
                  post.likes = likers;
                }
              }
            }
          )
        );
      } catch (error) {
        console.error('Error handling like update:', error);
      }
    },
    [dispatch]
  );

  const handleUnlikeUpdate = useCallback(
    ({ postId, likers }) => {
      try {
        dispatch(
          emiloMediaApi.util.updateQueryData(
            'getAllPost',
            undefined,
            (draft) => {
              if (draft?.data) {
                const post = draft.data.find((p) => p._id === postId);
                if (post) {
                  post.likes = likers;
                }
              }
            }
          )
        );
      } catch (error) {
        console.error('Error handling unlike update:', error);
      }
    },
    [dispatch]
  );

  const handleNewComment = useCallback(
    ({ postId, comment }) => {
      try {
        dispatch(
          emiloMediaApi.util.updateQueryData(
            'getCommentList',
            postId,
            (draft) => {
              if (draft?.data) {
                draft.data.unshift(comment);
              }
            }
          )
        );
        dispatch(
          emiloMediaApi.util.invalidateTags([{ type: 'Post', id: postId }])
        );
      } catch (error) {
        console.error('Error handling new comment:', error);
      }
    },
    [dispatch]
  );

  const handleNewReply = useCallback(
    ({ commentId, reply }) => {
      try {
        dispatch(
          emiloMediaApi.util.updateQueryData(
            'getCommentList',
            reply.post,
            (draft) => {
              if (draft?.data) {
                const parentComment = draft.data.find(
                  (c) => c._id === commentId
                );
                if (parentComment) {
                  parentComment.replies = parentComment.replies || [];
                  parentComment.replies.unshift(reply);
                }
              }
            }
          )
        );
      } catch (error) {
        console.error('Error handling new reply:', error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }
    if (!socketInitialized.current) {
      initSocket(token);
      connectSocket(token);
      socketInitialized.current = true;
    }

    const socket = getSocket();
    if (!socket) {
      console.error('Failed to get socket instance');
      return;
    }

    socket.off('likeUpdate');
    socket.off('unlikeUpdate');
    socket.off('viewUpdate');
    socket.off('newComment');
    socket.off('newReply');

    socket.on('likeUpdate', handleLikeUpdate);
    socket.on('unlikeUpdate', handleUnlikeUpdate);
    socket.on('newComment', handleNewComment);
    socket.on('newReply', handleNewReply);
    return () => {
      if (socket) {
        socket.off('likeUpdate', handleLikeUpdate);
        socket.off('unlikeUpdate', handleUnlikeUpdate);
        socket.off('newComment', handleNewComment);
        socket.off('newReply', handleNewReply);
      }
    };
  }, [
    token,
    isAuthenticated,
    handleLikeUpdate,
    handleUnlikeUpdate,
    handleNewComment,
    handleNewReply,
  ]);
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        disconnectSocket();
        socketInitialized.current = false;
      }
    };
  }, [isAuthenticated]);

  return null;
};
