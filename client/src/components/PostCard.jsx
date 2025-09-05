import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

import {
  useLikeAndUnlikePostServiceMutation,
  useViewPostServiceMutation,
} from '../store/postFeatures/postService';
import { toast } from 'sonner';

import CommentList from './CommentList';
import LikeList from './LikeList';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useSelector } from 'react-redux';

const PostCard = ({ post }) => {
  const containerRef = useRef();
  const authStoreData = useSelector((state) => state.authStore);
  const { user } = authStoreData;
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [commentsLength, setCommentsLength] = useState(post.comments.length);
  const [viewPostService] = useViewPostServiceMutation();
  useEffect(() => {
    setLikesLength(post.likes.length);
    setCommentsLength(post.comments.length);
    if (post.likes.includes(user._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [post.comments.length, post.likes, user._id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.7 &&
          !hasBeenViewed
        ) {
          try {
            await viewPostService(post._id);
            setHasBeenViewed(true);
          } catch (error) {
            console.error('Failed to track view:', error);
          }
        }
      },
      {
        threshold: 0.7,
        rootMargin: '0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [post._id, hasBeenViewed, viewPostService]);
  const [likeAndUnlikePostService] = useLikeAndUnlikePostServiceMutation();
  const likeAndUnlikeHanlder = async () => {
    try {
      const response = await likeAndUnlikePostService(post._id).unwrap();
      if (response.success && response.statusCode === 200) {
        setIsLiked(!isLiked);
        if (isLiked) {
          setLikesLength(likesLength - 1);
        } else {
          setLikesLength(likesLength + 1);
        }
      }
    } catch (err) {
      console.log(err);
      const status = err?.status || err?.data?.statusCode;
      const message = err?.data?.message || 'Something went wrong';
      if (status === 400) {
        toast.error(message || 'Invalid input');
      } else if (status === 500) {
        toast.error(message || 'Server error');
      } else {
        toast.error(message || 'Unexpected error');
      }
    }
  };
  return (
    <Card
      ref={containerRef}
      className={
        'shadow-sm gap-0 bg-background border border-zinc-200 dark:border-zinc-900'
      }
    >
      <CardHeader className={'flex items-start gap-3 px-4'}>
        <img
          src={
            post.author?.profilePicture.url ||
            '/images/authBG.jpg?height=32&width=32'
          }
          alt='Your avatar'
          className='h-10 w-10 rounded-full ring-1 ring-zinc-200 object-cover'
        />
        <Link to={`/users/${post.author._id}`} className='min-w-0 flex-1'>
          <h4 className='text-sm font-semibold'>{post.author.fullName}</h4>{' '}
          <p className='text-sm text-muted-foreground'>2 hours ago</p>
        </Link>
        <Button
          variant='ghost'
          className='rounded-md p-2 text-primary hover:bg-zinc-100'
        >
          <MoreHorizontal size={20} />
        </Button>
      </CardHeader>
      <CardContent>
        <p className='py-4 text-sm text-primary text-pretty'>{post.content}</p>
        {post.media?.length > 0 && (
          <div className='grid gap-2'>
            {post.media.length == 1 ? (
              <>
                {post.media.map((file, index) => (
                  <div
                    key={file._id || index}
                    className='rounded-2xl overflow-hidden'
                  >
                    {file.type === 'image' && (
                      <img
                        src={file.url}
                        alt={`post media ${index + 1}`}
                        className='w-full object-cover'
                      />
                    )}

                    {file.type === 'video' && (
                      <video
                        src={file.url}
                        controls
                        className='w-full object-cover'
                      />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                <Carousel className='w-full'>
                  <CarouselContent>
                    {post.media.map((file, index) => (
                      <CarouselItem
                        key={file._id || index}
                        className='rounded-2xl overflow-hidden'
                      >
                        {file.type === 'image' && (
                          <img
                            src={file.url}
                            alt={`post media ${index + 1}`}
                            className='w-full object-cover'
                          />
                        )}

                        {file.type === 'video' && (
                          <video
                            src={file.url}
                            controls
                            className='w-full object-cover'
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className={'left-0'} />
                  <CarouselNext className={'right-0'} />
                </Carousel>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className='flex items-center gap-6 pt-4'>
        <div className='flex items-center gap-1'>
          <Heart
            size={18}
            onClick={likeAndUnlikeHanlder}
            color={isLiked ? 'red' : 'black'}
            fill={isLiked ? 'red' : 'white'}
          />
          <LikeList id={post._id}>
            <Button variant='ghost' size='sm'>
              {likesLength > 0 ? likesLength : ''} Like
            </Button>
          </LikeList>
        </div>
        <CommentList
          id={post._id}
          setCommentsLength={setCommentsLength}
          commentsLength={commentsLength}
        >
          <div className='flex items-center gap-1'>
            <Button variant='ghost' size='sm'>
              <MessageCircle size={18} />
              {commentsLength > 0 ? commentsLength : ''} Comment
            </Button>
          </div>
        </CommentList>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
