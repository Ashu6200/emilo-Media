import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const signUpSchema = yup.object({
  fullName: yup.string().required('Name is required'),
  bio: yup.string().max(150, 'Bio must be at most 150 characters'),
});
const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = (data) => {};
  return (
    <form
      className={cn('flex flex-col gap-6')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Edit your profile</h1>
      </div>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            type='fullName'
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
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            placeholder='Type your message here.'
            id='bio'
            type='bio'
            {...register('bio')}
            required
            rows={5}
            cols={30}
          />
          <ErrorMessage
            errors={errors}
            name='bio'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          Edit Profile
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
