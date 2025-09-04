import { Skeleton } from '../ui/skeleton';

const UserItemSkeleton = () => {
  return (
    <div className='flex items-center gap-4'>
      <Skeleton className='h-8 w-8 rounded-full' />

      <div className='min-w-0 flex-1'>
        <Skeleton className='h-4 w-24 mb-1' />
        <Skeleton className='h-3 w-16' />
      </div>
    </div>
  );
};

export default UserItemSkeleton;
