import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  useGetYourProfileServiceQuery,
  // useUpdateYourProfileServiceMutation,
} from '../store/userFeatures/userService';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
// import { toast } from 'sonner';

const signUpSchema = yup.object().shape({
  fullName: yup.string(),
  bio: yup.string(),
  media: yup
    .mixed()
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return file && file.type.startsWith('image/');
    })
    .test('fileSize', 'Image must be less than 2MB', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return file && file.size <= 2 * 1024 * 1024;
    }),
});

const EditProfile = () => {
  const { data: userData, isLoading: isUserDataLoading } =
    useGetYourProfileServiceQuery();
  // const [updateYourProfileService, { isLoading }] =
  //   useUpdateYourProfileServiceMutation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      bio: '',
      media: null,
    },
  });
  useEffect(() => {
    if (userData && !isUserDataLoading) {
      setValue('fullName', userData.data?.fullName || '');
      setValue('bio', userData.data?.bio || '');
      if (userData.data?.profilePicture?.url) {
        setPreview(userData.data.profilePicture.url);
      }
    }
  }, [userData, setValue, isUserDataLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setValue('media', e.target.files);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setValue('media', null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('bio', data.bio);

    if (selectedFile) {
      formData.append('media', selectedFile);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    // try {
    //   const response = await updateYourProfileService(formData).unwrap();
    //   if (response?.success) {
    //     toast.success('Successfully updated profile', {
    //       description: 'Your profile has been updated successfully',
    //     });
    //   }
    // } catch (err) {
    //   const status = err?.status || err?.data?.statusCode;
    //   const message = err?.data?.message || 'Something went wrong';
    //   if (status === 400) {
    //     toast.error(message || 'Invalid input');
    //   } else if (status === 500) {
    //     toast.error(message || 'Server error');
    //   } else {
    //     toast.error(message || 'Unexpected error');
    //   }
    // }
  };

  return (
    <form
      className={cn('flex flex-col gap-6')}
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Edit your profile</h1>
      </div>

      <div className='grid gap-4'>
        {/* Full Name */}
        <div className='grid gap-2'>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            type='text'
            placeholder='Ashu'
            {...register('fullName')}
          />
          <ErrorMessage
            errors={errors}
            name='fullName'
            render={({ message }) => (
              <p className='text-red-500 text-xs'>{message}</p>
            )}
          />
        </div>

        {/* Bio */}
        <div className='grid gap-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            placeholder='Type your message here.'
            id='bio'
            {...register('bio')}
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

        <div>
          <Label
            htmlFor='media'
            className='block text-sm font-medium text-primary'
          >
            Upload Image
          </Label>

          <input
            type='file'
            id='media'
            accept='image/*'
            className='mt-1 block w-full text-sm text-primary file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/80'
            onChange={handleFileChange}
          />

          {preview && (
            <div className='mt-3 relative inline-block'>
              <img
                src={preview}
                alt='Preview'
                className='w-32 h-32 object-cover rounded-lg border shadow'
              />
              <button
                type='button'
                onClick={handleRemoveFile}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600'
              >
                <X size={16} />
              </button>
            </div>
          )}

          <ErrorMessage
            errors={errors}
            name='media'
            render={({ message }) => (
              <p className='text-red-500 text-xs mt-1'>{message}</p>
            )}
          />
        </div>

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Edit Profile'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
