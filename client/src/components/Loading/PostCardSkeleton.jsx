import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const PostCardSkeleton = () => {
  return (
    <Card
      className={
        'shadow-sm gap-0 bg-background border border-zinc-200 dark:border-zinc-900'
      }
    >
      <CardHeader className={'flex items-start gap-3 px-4'}>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='min-w-0 flex-1'>
          <Skeleton className='h-4 w-24 mb-1' />
          <Skeleton className='h-3 w-16' />
        </div>
        <Skeleton className='h-8 w-8 rounded-md' />
      </CardHeader>
      <CardContent>
        <div className='py-4 space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
        <div className='grid gap-2'>
          <Skeleton className='w-full h-48 rounded-2xl' />
        </div>
      </CardContent>
      <CardFooter className='flex items-center gap-6 pt-4'>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-5 w-5' />
          <Skeleton className='h-8 w-16' />
        </div>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-5 w-5' />
          <Skeleton className='h-8 w-20' />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCardSkeleton;
