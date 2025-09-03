import {
  GalleryVerticalEnd,
  Home,
  LogOut,
  PenLine,
  Search,
  Users,
} from 'lucide-react';

import { Link, NavLink } from 'react-router';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ThemeSwitcher from '../ThemeSwitcher';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authFeatures/authSlice';
import { useGetYourProfileServiceQuery } from '../../store/userFeatures/userService';

const Navbar = () => {
  const dispatch = useDispatch();
  const authStoreData = useSelector((state) => state.authStore);
  const { isAuthenticated } = authStoreData;
  const { data: profileData } = useGetYourProfileServiceQuery();
  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Create', path: '/create', icon: <PenLine size={20} /> },
  ];
  return (
    <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4'>
      <div className='flex items-center gap-3'>
        <Link to='/' className='flex items-center gap-2 font-medium'>
          <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
            <GalleryVerticalEnd className='size-4' />
          </div>
          <span className='hidden md:block'>Emilo Media</span>
        </Link>
        <label className='relative hidden md:block'>
          <Search
            className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'
            size={18}
          />
          <input
            type='search'
            placeholder='Search'
            className='h-10 w-72 rounded-md border border-zinc-200 bg-zinc-100 pl-9 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100'
          />
        </label>
      </div>
      <nav className='flex items-center gap-4'>
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `grid place-items-center gap-1 text-center text-xs ${
                isActive ? 'text-primary' : 'text-primary/50 '
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
        <ThemeSwitcher />
        <Button variant='ghost' className='rounded-full' size='icon'>
          <Link to='/me'>
            <Avatar>
              <AvatarImage
                src={
                  profileData?.data?.profilePicture.url ||
                  '/images/authBG.jpg?height=44&width=44'
                }
                alt='Profile'
                className={'object-cover'}
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Link>
        </Button>
        {isAuthenticated && (
          <Button
            variant='destructive'
            className='rounded-full'
            size='icon'
            onClick={() => dispatch(logout())}
          >
            <LogOut size={25} />
          </Button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
