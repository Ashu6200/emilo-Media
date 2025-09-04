import { useGetYourProfileServiceQuery } from '../store/userFeatures/userService';
import ProfileCardSkeleton from './Loading/ProfileCardSkeleton';

const ProfileCard = () => {
  const { data: profileData, isLoading } = useGetYourProfileServiceQuery();
  if (!profileData || isLoading) {
    return <ProfileCardSkeleton />;
  }
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
              profileData?.data?.profilePicture.url ||
              '/images/authBG.jpg?height=72&width=72&query=avatar'
            }
            alt='Your avatar'
            className='object-cover h-18 w-18 rounded-full border-2 border-white ring-1 ring-zinc-200'
          />
          <h2 className='mt-2 text-lg font-semibold text-primary'>
            {profileData?.data?.fullName ? profileData.data.fullName : ''}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground text-pretty'>
            {profileData.data.bio ? profileData.data.bio.slice(0, 150) : ''}
          </p>
          <div className='flex items-center justify-between mt-6'>
            <div>
              <div className='font-semibold'>
                {' '}
                {profileData.data?.postsCount ? profileData.data.postsCount : 0}
              </div>
              <div className='text-xs text-muted-foreground'>Posts</div>
            </div>
            <div>
              <div className='font-semibold'>
                {' '}
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
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
