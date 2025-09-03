import { BrowserRouter, Route, Routes } from 'react-router';
import StoreProvider from './utils/StoreProvider';
import { ThemeProvider } from './utils/theme-provider';
import Home from './pages/Main/Home';
import AuthLayout from './pages/Auth/AuthLayout';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import MainLayout from './pages/Main/MainLayout';
import Profile from './pages/Main/Profile';
import UserProfile from './pages/Main/UserProfile';
import { Toaster } from 'sonner';
import Notification from './pages/Main/Notification';
import Users from './pages/Main/Users';
import Dashboard from './pages/Main/Dashboard';
import CreatePost from './pages/Main/CreatePost';

function App() {
  return (
    <StoreProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/me' element={<Profile />} />
              <Route path='/notifications' element={<Notification />} />
              <Route path='/users' element={<Users />} />
              <Route path='/users/:id' element={<UserProfile />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/create' element={<CreatePost />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path='login' element={<SignIn />} />
              <Route path='register' element={<SignUp />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
