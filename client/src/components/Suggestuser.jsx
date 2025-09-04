import { useGetSuggestedServiceQuery } from '../store/userFeatures/userService';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import UserItemSkeleton from './Loading/UserItemSkeleton';

const Suggestuser = () => {
  const authStore = useSelector((state) => state.authStore);
  const userId = authStore.user?._id;
  const { data: userList, isLoading } = useGetSuggestedServiceQuery(userId);
  return (
    <aside>
      <h2>Suggest User</h2>
      <p className='text-sm text-muted-foreground'>
        Explore and connect with other users on Emilo.
      </p>
      <div className='grid flex-1 auto-rows-min gap-6 py-4 overflow-y-auto'>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <UserItemSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {Array.isArray(userList.data) &&
              userList.data.length > 0 &&
              userList.data.map((item) => <User key={item._id} user={item} />)}
          </>
        )}
      </div>
    </aside>
  );
};

export default Suggestuser;

const User = ({ user }) => {
  return (
    <div key={user._id} className='flex items-center gap-4'>
      <Link
        to={`/users/${user._id}`}
        className='flex items-center justify-between gap-4'
      >
        <img
          src={
            user.profilePicture.url || '/images/authBG.jpg?height=32&width=32'
          }
          alt='User avatar'
          className='h-8 w-8 rounded-full ring-1 ring-zinc-200'
        />
        <div className='min-w-0 flex-1'>
          <h4 className='text-sm font-semibold'>{user.fullName}</h4>
          <p className='text-sm text-muted-foreground'>@{user.username}</p>
        </div>
      </Link>
    </div>
  );
};
