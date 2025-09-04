import { Skeleton } from '../ui/skeleton';

const ProfileCardSkeleton = () => {
  return (
    <div className='space-y-4'>
      <section className='overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-900'>
        <div
          className="h-16 w-full bg-[url('/images/authBG.jpg')] bg-cover bg-center"
          aria-hidden='true'
        />
        <div className='-mt-6 px-4 pb-4'>
          <Skeleton className='h-18 w-18 rounded-full border-2 border-white ring-1 ring-zinc-200' />

          <Skeleton className='mt-2 h-6 w-32' />

          <div className='mt-1 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          <div className='flex items-center justify-between mt-6'>
            <div>
              <Skeleton className='h-5 w-8 mb-1' />
              <div className='text-xs text-muted-foreground'>Posts</div>
            </div>
            <div>
              <Skeleton className='h-5 w-8 mb-1' />
              <div className='text-xs text-muted-foreground'>Followers</div>
            </div>
            <div>
              <Skeleton className='h-5 w-8 mb-1' />
              <div className='text-xs text-muted-foreground'>Following</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCardSkeleton;
