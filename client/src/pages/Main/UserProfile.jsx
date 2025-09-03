import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import PostCard from '../../components/PostCard';
import {
  useFollowAndUnfollowUserServiceMutation,
  useGetPostsListServiceQuery,
  useGetUserProfileServiceQuery,
} from '../../store/userFeatures/userService';
import { useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const UserProfile = () => {
  const { id } = useParams();
  const { data: profileData, isLoading: isProfileLoading } =
    useGetUserProfileServiceQuery(id);
  const [followAndUnfollowUserService, { isLoading }] =
    useFollowAndUnfollowUserServiceMutation();
  const { data: userPostsData, isLoading: isPostsLoading } =
    useGetPostsListServiceQuery(id);
  if (isProfileLoading) {
    return <div>Loading...</div>;
  }
  let isFollower = profileData.data.isFollower;
  const handleFollow = async () => {
    try {
      const response = await followAndUnfollowUserService(id).unwrap();
      if (response?.success) {
        toast.success('Followed successfully ', {
          description: `You have followed ${profileData?.data?.fullName}`,
        });
        isFollower = !isFollower;
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
    <section className='mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 px-4 py-4'>
      <div className='flex gap-8'>
        <img
          src={
            profileData?.data?.profilePicture.url ||
            '/images/authBG.jpg?height=256&width=256'
          }
          alt='profile-picture'
          className='object-contain max-w-42 h-42 w-42 rounded-full'
        />
        <div className='text-start'>
          <h1 className='font-semibold text-primary text-2xl flex items-center gap-4'>
            {profileData?.data?.fullName}
          </h1>
          <div className='flex items-center justify-start gap-4 m-4'>
            <div>
              <div className='font-semibold'>
                {' '}
                {profileData.data?.postsCount ? profileData.data.postsCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Posts</div>
            </div>
            <div>
              <div className='font-semibold'>
                {profileData.data?.followersCount
                  ? profileData.data.followersCount
                  : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Followers</div>
            </div>
            <div>
              <div className='font-semibold'>
                {' '}
                {profileData.data?.followingCount
                  ? profileData.data.followingCount
                  : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Following</div>
            </div>
          </div>
          <p className='font-medium text-primary text-sm'>
            {profileData.data.bio}
          </p>
          <Button
            disabled={isLoading}
            varient='outline'
            className={'mt-4 '}
            onClick={handleFollow}
          >
            {isFollower ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      </div>
      {!profileData.data.isPrivate && (
        <Tabs defaultValue='post' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='post'>Post</TabsTrigger>
          </TabsList>
          <TabsContent value='post'>
            {isPostsLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {userPostsData?.data.length > 0 &&
                  userPostsData?.data?.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
};

export default UserProfile;
