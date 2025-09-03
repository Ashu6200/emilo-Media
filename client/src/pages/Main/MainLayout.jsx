import { useSelector } from 'react-redux';
import Navbar from '../../components/layout/Navbar';
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useSocket } from '../../hooks/hooks';

const MainLayout = () => {
  const navigate = useNavigate();
  const authStoreData = useSelector((state) => state.authStore);
  const { isAuthenticated } = authStoreData;
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  useSocket();
  return (
    <div className='bg-background grid grid-rows-[auto,1fr]'>
      <header className='sticky top-0 z-50 h-16 border-b border-gray-200 dark:border-gray-900 bg-background/80 backdrop-blur-xl'>
        <Navbar />
      </header>
      <main className='min-h-0 overflow-hidden'>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
