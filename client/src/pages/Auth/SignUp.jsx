import { useEffect } from 'react';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { useSelector } from 'react-redux';
import { useRegisterServiceMutation } from '../../store/authFeatures/authService';
import { toast } from 'sonner';

const signUpSchema = yup.object({
  fullName: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const SignUp = () => {
  const navigate = useNavigate();
  const authStoreData = useSelector((state) => state.authStore);
  const { isAuthenticated } = authStoreData;
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const [registerService] = useRegisterServiceMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = async (formData) => {
    try {
      const response = await registerService(formData).unwrap();
      if (response?.success) {
        toast.success('Sign up successfully', {
          description: 'You are being redirected to login page.',
        });
        navigate('/login');
      }
      reset();
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
    <form
      className={cn('flex flex-col gap-6')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>SignUp to create an account</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          Enter your email below to create your account
        </p>
      </div>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            type='text'
            placeholder='Ashu'
            {...register('fullName')}
            required
          />
          <ErrorMessage
            errors={errors}
            name='fullName'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='username'>UserName</Label>
          <Input
            id='username'
            type='text'
            placeholder='Ashu_65'
            {...register('username')}
            required
          />
          <ErrorMessage
            errors={errors}
            name='username'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='ashu@example.com'
            {...register('email')}
            required
          />{' '}
          <ErrorMessage
            errors={errors}
            name='email'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            required
            {...register('password')}
          />
          <ErrorMessage
            errors={errors}
            name='password'
            render={({ message }) => {
              <p className='text-red-500 text-xs'>{message}</p>;
            }}
          />
        </div>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          Sign Up
        </Button>
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
        <Button variant='outline' className='w-full' disabled={isSubmitting}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path
              d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
              fill='currentColor'
            />
          </svg>
          Login with GitHub
        </Button>
      </div>
      <div className='text-center text-sm'>
        Already have an account?{' '}
        <Link to='/login' className='underline underline-offset-4'>
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default SignUp;
