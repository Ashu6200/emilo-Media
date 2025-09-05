import { toast } from 'sonner';
import {
  useCommentReplyServiceMutation,
  useDeleteCommentServiceMutation,
  useDeleteReplyServiceMutation,
  useGetCommentListQuery,
  usePostCommentServiceMutation,
  useUpdateCommentServiceMutation,
  useUpdatedReplyServiceMutation,
} from '../store/postFeatures/postService';
import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { CircleX, Edit, Reply, Send, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { useSelector } from 'react-redux';

const CommentList = ({ children, id, setCommentsLength, commentsLength }) => {
  const [open, setOpen] = useState(false);
  const memoizedId = useMemo(() => id, [id]);
  const authStoreData = useSelector((state) => state.authStore);
  const { user } = authStoreData;
  const {
    data: commentList,
    isLoading,
    isError,
    error,
  } = useGetCommentListQuery(memoizedId, {
    skip: !open,
  });

  const [postCommentService] = usePostCommentServiceMutation();
  const [commentReplyService] = useCommentReplyServiceMutation();
  const [updateCommentService] = useUpdateCommentServiceMutation();
  const [deleteCommentService] = useDeleteCommentServiceMutation();
  const [updateReplyService] = useUpdatedReplyServiceMutation();
  const [deleteReplyService] = useDeleteReplyServiceMutation();

  const [content, setContent] = useState('');
  const [reply, setReply] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [commentId, setCommentId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState({
    type: '',
    id: '',
    parentId: '',
  });

  const replyHandler = (commentId, name) => {
    setReply(true);
    setReplyTo(name);
    setCommentId(commentId);
    setEditMode(false);
    setContent('');
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await deleteCommentService({
        postId: id,
        commentId,
      }).unwrap();
      if (response?.success) {
        setCommentsLength(commentsLength - 1);
      }
      if (response?.success) toast.success('Comment deleted successfully');
    } catch (err) {
      handleError(err);
    }
  };

  const deleteReply = async (replyId, commentId) => {
    try {
      const response = await deleteReplyService({
        postId: id,
        commentId,
        replyId,
      }).unwrap();
      if (response?.success) toast.success('Reply deleted successfully');
    } catch (err) {
      handleError(err);
    }
  };

  const updateComment = async (commentId) => {
    try {
      const response = await updateCommentService({
        postId: id,
        commentId,
        content,
      }).unwrap();
      if (response?.success) {
        setCommentsLength(commentsLength + 1);
        toast.success('Comment updated successfully');
        resetState();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const updateReply = async (replyId, commentId) => {
    try {
      const response = await updateReplyService({
        postId: id,
        commentId,
        replyId,
        content,
      }).unwrap();
      if (response?.success) {
        toast.success('Reply updated successfully');
        resetState();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (!content) {
        toast.error('Please enter a comment');
        return;
      }

      // Edit mode
      if (editMode) {
        if (editTarget.type === 'comment') {
          await updateComment(editTarget.id);
        } else if (editTarget.type === 'reply') {
          await updateReply(editTarget.id, editTarget.parentId);
        }
        return;
      }

      // Reply mode
      if (reply) {
        const response = await commentReplyService({
          postId: id,
          commentId,
          content,
        }).unwrap();
        if (response?.success) toast.success('Reply posted successfully');
        resetState();
        return;
      }

      // Normal comment
      const response = await postCommentService({
        postId: id,
        content,
      }).unwrap();
      if (response?.success) toast.success('Comment posted successfully');
      resetState();
    } catch (err) {
      handleError(err);
    }
  };

  const resetState = () => {
    setContent('');
    setReply(false);
    setReplyTo('');
    setCommentId('');
    setEditMode(false);
    setEditTarget({ type: '', id: '', parentId: '' });
  };

  const handleError = (err) => {
    console.log(err);
    const status = err?.status || err?.data?.statusCode;
    const message = err?.data?.message || 'Something went wrong';
    if (status === 400) toast.error(message || 'Invalid input');
    else if (status === 500) toast.error(message || 'Server error');
    else toast.error(message || 'Unexpected error');
  };
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='h-full flex flex-col overflow-hidden'>
        <SheetHeader>
          <SheetTitle>Commented By</SheetTitle>
          <SheetDescription>
            List of all the people who commented on this post.
          </SheetDescription>
        </SheetHeader>

        <div className='grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto'>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            commentList?.data?.map(
              (item) =>
                item && (
                  <div key={item._id} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between gap-4'>
                      <div className='min-w-0 flex items-start gap-4 justify-between'>
                        <img
                          src={
                            item.user?.profilePicture.url ||
                            '/images/authBG.jpg?height=32&width=32'
                          }
                          alt='User avatar'
                          className='h-8 w-8 rounded-full ring-1 ring-zinc-200 object-cover'
                        />
                        <div>
                          <h4 className='text-sm font-semibold'>
                            {item.user.fullName || ''}
                          </h4>
                          <p className='text-sm text-muted-foreground'>
                            @{item.user.username || ''}
                          </p>
                          <p className='text-sm text-primary text-pretty mt-2'>
                            {item.content || ''}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() =>
                            replyHandler(item._id, item.user.fullName)
                          }
                        >
                          <Reply />
                        </Button>
                        {user && item.user._id === user?._id && (
                          <>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => {
                                setContent(item.content);
                                setEditMode(true);
                                setEditTarget({
                                  type: 'comment',
                                  id: item._id,
                                });
                              }}
                            >
                              <Edit />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => deleteComment(item._id)}
                            >
                              <Trash />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    <div className='ml-8'>
                      {item.replies.length > 0 &&
                        item.replies.map(
                          (reply) =>
                            reply && (
                              <div
                                key={reply._id}
                                className='flex items-center justify-between gap-2'
                              >
                                <div className='flex items-center gap-4'>
                                  <img
                                    src={
                                      reply.user?.profilePicture.url ||
                                      '/images/authBG.jpg?height=32&width=32'
                                    }
                                    alt='User avatar'
                                    className='h-8 w-8 rounded-full ring-1 ring-zinc-200 object-cover'
                                  />
                                  <div>
                                    <h4 className='text-sm font-semibold'>
                                      {reply.user.fullName || ''}
                                    </h4>
                                    <p className='text-sm text-muted-foreground'>
                                      @{reply.user.username || ''}
                                    </p>
                                    <p className='text-sm text-primary text-pretty'>
                                      {reply.content || ''}
                                    </p>
                                  </div>
                                </div>
                                {user && reply.user._id === user._id && (
                                  <div className='flex items-center gap-2'>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      onClick={() => {
                                        setContent(reply.content);
                                        setEditMode(true);
                                        setEditTarget({
                                          type: 'reply',
                                          id: reply._id,
                                          parentId: item._id,
                                        });
                                      }}
                                    >
                                      <Edit />
                                    </Button>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      onClick={() =>
                                        deleteReply(reply._id, item._id)
                                      }
                                    >
                                      <Trash />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )
                        )}
                    </div>
                  </div>
                )
            )
          )}
        </div>

        <SheetFooter>
          {(reply || editMode) && (
            <div className='flex items-center gap-2'>
              <p>{reply ? `Replying to ${replyTo}` : 'Editing...'}</p>
              <CircleX
                onClick={resetState}
                size={18}
                className='cursor-pointer'
              />
            </div>
          )}
          <div className='relative w-full mt-4'>
            <Input
              id='comment'
              type='text'
              placeholder='Write a comment...'
              className='pr-10'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              onClick={handleComment}
              variant={'icon'}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            >
              <Send size={18} />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CommentList;
