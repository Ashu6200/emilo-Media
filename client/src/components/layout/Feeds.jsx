import { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import { useGetAllPostQuery } from '../../store/postFeatures/postService';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCardSkeleton from '../Loading/PostCardSkeleton';

const Feeds = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);

  const {
    data: paginatedData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllPostQuery(page);
  useEffect(() => {
    if (isSuccess && paginatedData?.data) {
      setAllPosts((prev) => {
        const existingPostIds = new Set(prev.map((post) => post._id));
        const newPosts = paginatedData.data.filter(
          (post) => !existingPostIds.has(post._id)
        );

        return [...prev, ...newPosts];
      });
    }
  }, [isSuccess, paginatedData]);

  if (isLoading && page === 1) {
    return <PostCardSkeleton />;
  }

  if (isError) {
    return (
      <section className='flex justify-center items-center h-40'>
        <p className='text-red-500'>
          {error?.data?.message || 'Failed to fetch posts.'}
        </p>
      </section>
    );
  }

  if (isSuccess && allPosts.length === 0) {
    return (
      <section className='flex justify-center items-center h-40'>
        <p className='text-gray-400'>No posts available yet.</p>
      </section>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={() => setPage((prev) => prev + 1)}
      hasMore={paginatedData?.data?.length >= 10}
      loader={<h4 className='text-center'>Loading more...</h4>}
      className='space-y-4'
    >
      {allPosts.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </InfiniteScroll>
  );
};

export default Feeds;
