import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const UserListSheet = ({
  children,
  queryFunction,
  userId,
  title,
  description,
}) => {
  const memoizedId = useMemo(() => userId, [userId]);
  const [open, setOpen] = useState(false);
  const { data: userList, isLoading } = queryFunction(memoizedId, {
    skip: !open,
  });

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='h-full flex flex-col overflow-hidden'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className='grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto'>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            Array.isArray(userList?.data) &&
            userList.data.length > 0 &&
            userList.data.map((item) => (
              <div key={item._id} className='flex items-center gap-4'>
                <img
                  src={
                    item.profilePicture?.url ||
                    '/images/authBG.jpg?height=32&width=32'
                  }
                  alt='User avatar'
                  className='h-8 w-8 rounded-full ring-1 ring-zinc-200 object-cover'
                />
                <div className='min-w-0 flex-1'>
                  <h4 className='text-sm font-semibold'>{item.fullName}</h4>
                  <p className='text-sm text-muted-foreground'>
                    @{item.username}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserListSheet;
