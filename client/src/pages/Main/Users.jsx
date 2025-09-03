import React from 'react';
import { Button } from '../../components/ui/button';
import {
  useFollowAndUnfollowUserServiceMutation,
  useGetAllUsersServiceQuery,
} from '../../store/userFeatures/userService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const Users = () => {
  const { data: userList, isLoading } = useGetAllUsersServiceQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <section className='mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 px-4 py-4'>
      <h1 className='text-2xl font-semibold text-primary'>Users Suggestion</h1>
      <p className='text-sm text-muted-foreground'>
        Explore and connect with other users on Emilo.
      </p>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {userList.data.map((item) => (
          <ProfileCard key={item._id} user={item} />
        ))}
      </div>
    </section>
  );
};

export default Users;

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const id = user._id;
  const [followAndUnfollowUserService, { isLoading }] =
    useFollowAndUnfollowUserServiceMutation();
  let isFollower = user.isFollower;
  const handleFollow = async () => {
    try {
      const response = await followAndUnfollowUserService(id).unwrap();
      if (response?.success) {
        toast.success('Followed successfully ', {
          description: `You have followed ${user.fullName}`,
        });
        isFollower = !isFollower;
      }
    } catch (err) {
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
    <div className='space-y-4'>
      <section className='overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-900'>
        <div
          className="h-16 w-full bg-[url('/images/authBG.jpg')] bg-cover bg-center"
          aria-hidden='true'
        />
        <div className='-mt-6 px-4 pb-4'>
          <img
            src={
              user.profilePicture.url ||
              '/images/authBG.jpg?height=72&width=72&query=avatar'
            }
            alt='Your avatar'
            className='h-18 w-18 rounded-full border-2 border-white ring-1 ring-zinc-200 object-cover'
          />
          <h2 className='mt-2 text-lg font-semibold text-primary'>
            {user?.fullName}
          </h2>
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-semibold'>
                {user.postsCount ? user.postsCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Posts</div>
            </div>
            <div>
              <div className='font-semibold'>
                {' '}
                {user.followersCount ? user.followersCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Followers</div>
            </div>
            <div>
              <div className='font-semibold'>
                {user.followingCount ? user.followingCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Following</div>
            </div>
          </div>
          <p className='mt-1 text-sm text-muted-foreground text-start'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quia, quod. acbacs Lorem ipsum dolor sit
          </p>
          <div className='flex items-center justify-between'>
            <Button
              disabled={isLoading}
              varient='outline'
              className={'mt-4 '}
              onClick={handleFollow}
            >
              {isFollower ? 'Unfollow' : 'Follow'}
            </Button>
            <Button
              varient='default'
              className={'mt-4 '}
              onClick={() => navigate(`/users/${id}`)}
            >
              View
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
