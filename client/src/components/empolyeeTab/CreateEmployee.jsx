import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useCreateEmployeeServiceMutation } from '../../store/mainFeatures/mainService';
import { toast } from 'sonner';

const CreateEmployeeSchema = yup.object({
  fullName: yup.string().required('Name is required'),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]+$/, 'Invalid username')
    .required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().required('Role is required'),
});

const CreateEmployee = () => {
  const [createEmployeeService] = useCreateEmployeeServiceMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(CreateEmployeeSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      role: 'manager',
    },
  });
  const onSubmit = async (formData) => {
    try {
      const response = await createEmployeeService(formData).unwrap();
      if (response?.success) {
        toast.success('Successfully created employee', {
          description: 'You have been successfully created an employee.',
        });
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
      className={cn('flex flex-col gap-6 mx-auto max-w-4xl')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Create an Employee</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          Enter your email below to create Empolyee
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
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='role'>Role</Label>
          <Select
            onValueChange={(value) => {
              setValue('role', value);
              trigger('role');
            }}
            defaultValue='manager'
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='manager'>Manager</SelectItem>
              <SelectItem value='accountant'>Accoutant</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage
            errors={errors}
            name='role'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <Button
          type='submit'
          className='w-full cursor-pointer'
          variant='secondary'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default CreateEmployee;
