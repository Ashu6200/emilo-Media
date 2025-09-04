import React, { useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import PostCard from '../../components/PostCard';
import EditProfile from '../../components/EditProfile';
import {
  useGetFollowersListServiceQuery,
  useGetFollowingListServiceQuery,
  useGetPostsListServiceQuery,
  useGetYourProfileServiceQuery,
} from '../../store/userFeatures/userService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import UserListSheet from '../../components/UserListSheet';
import { Button } from '../../components/ui/button';

const Profile = () => {
  const navigate = useNavigate();
  const authStoreData = useSelector((state) => state.authStore);
  const { isAuthenticated } = authStoreData;
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const userId = authStoreData.user?._id;
  const { data: profileData, isLoading: isProfileLoading } =
    useGetYourProfileServiceQuery();
  const { data: userPostsData, isLoading: isPostsLoading } =
    useGetPostsListServiceQuery(userId);
  if (isProfileLoading || isPostsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <section className='mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 px-4 py-4'>
      <div className='flex items-center gap-8 md:flex-row flex-col'>
        <img
          src={
            profileData?.data?.profilePicture.url ||
            '/images/authBG.jpg?height=256&width=256'
          }
          alt='profile-picture'
          className='object-contain max-w-42 h-42 w-42 rounded-full'
        />
        <div className='text-center md:text-start text-wrap'>
          <h1 className='font-semibold  text-center md:text-start text-primary text-2xl gap-4'>
            {profileData?.data?.fullName}
          </h1>
          <div className='flex items-center justify-center md:justify-start gap-4 m-4'>
            <div className='text-center'>
              <div className='font-semibold'>
                {profileData.data?.postsCount ? profileData.data.postsCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Posts</div>
            </div>
            <UserListSheet
              queryFunction={useGetFollowersListServiceQuery}
              userId={userId}
              title='Followers'
              description='List of user who follow you'
            >
              <div className='text-center'>
                <div className='font-semibold'>
                  {profileData.data?.followersCount
                    ? profileData.data.followersCount
                    : 0}
                </div>
                <div className='text-xs text-muted-foreground'>Followers</div>
              </div>
            </UserListSheet>
            <UserListSheet
              queryFunction={useGetFollowingListServiceQuery}
              userId={userId}
              title='Following'
              description='List of user who you follow'
            >
              <div className='text-center'>
                <div className='font-semibold'>
                  {profileData.data?.followingCount
                    ? profileData.data.followingCount
                    : 0}
                </div>
                <div className='text-xs text-muted-foreground'>Following</div>
              </div>
            </UserListSheet>
          </div>
          <p className='font-medium text-primary text-sm'>
            {profileData.data.bio}
          </p>
          {authStoreData.user?.role !== 'user' && (
            <Button
              variant='outline'
              onClick={() => navigate('/dashboard')}
              className={'mt-4'}
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>
      <Tabs defaultValue='post' className='w-full '>
        <TabsList className='w-full border shadow-xs dark:bg-input/20 dark:border-input'>
          <TabsTrigger value='post' className={''}>
            Post
          </TabsTrigger>
          <TabsTrigger value='editProfile'>Edit Profile</TabsTrigger>
        </TabsList>
        <TabsContent value='post' className={'flex flex-col gap-4'}>
          {userPostsData?.data.length > 0 &&
            userPostsData?.data?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </TabsContent>
        <TabsContent value='editProfile'>
          <EditProfile />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Profile;
