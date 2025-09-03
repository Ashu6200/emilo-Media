import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useCreatePricingServiceMutation } from '../../store/pricingFeature/pricingService';
import { toast } from 'sonner';

const CreatePricingSchema = yup.object({
  city: yup.string().required('City is required'),
  pricePerView: yup.number().required('Price per view is required'),
  pricePerLike: yup.number().required('Price per like is required'),
});
const CreatePricing = () => {
  const [createPricingService] = useCreatePricingServiceMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(CreatePricingSchema),
    defaultValues: {
      city: '',
      pricePerView: 0,
      pricePerLike: 0,
    },
  });
  const onSubmit = async (formData) => {
    try {
      const response = await createPricingService(formData).unwrap();
      if (response?.success) {
        toast.success('Successfully created an Pricing', {
          description: 'You have been successfully created and Pricing',
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
    <>
      <form
        className={cn('flex flex-col gap-6 mx-auto max-w-4xl')}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Create an Pricing</h1>
          <p className='text-balance text-sm text-muted-foreground'>
            Enter your pricing details below to create Pricing
          </p>
        </div>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='city'>City</Label>
            <Input
              id='city'
              type='text'
              placeholder='raipur'
              {...register('city')}
              required
            />
            <ErrorMessage
              errors={errors}
              name='city'
              render={({ message }) => (
                <p className='text-red-500 text-xs'>{message}</p>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='pricePerView'>Price Per View</Label>
            <Input
              id='pricePerView'
              type='number'
              placeholder='19'
              {...register('pricePerView')}
              required
            />
            <ErrorMessage
              errors={errors}
              name='pricePerView'
              render={({ message }) => (
                <p className='text-red-500 text-xs'>{message}</p>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='pricePerLike'>Price Per Like</Label>
            <Input
              id='pricePerLike'
              type='number'
              placeholder='ashu@example.com'
              {...register('pricePerLike')}
              required
            />{' '}
            <ErrorMessage
              errors={errors}
              name='pricePerLike'
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
            {isSubmitting ? 'Creating...' : 'Create Pricing'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreatePricing;
