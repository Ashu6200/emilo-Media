import { toast } from 'sonner';
import {
  useApprovedPostListServiceQuery,
  usePaymentServiceMutation,
} from '../../store/mainFeatures/mainService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';

const AccountList = () => {
  const {
    data: postList,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useApprovedPostListServiceQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className='flex flex-col gap-6 mx-auto max-w-7xl'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>List of Post</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          List of all post presnt in the Emilo Media
        </p>
      </div>
      {isSuccess && (
        <Table>
          <TableHeader>
            <TableRow>
              {Object.entries(postList.data.header).map(([key, label]) => (
                <TableHead key={key}>{label}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postList.data.posts.length > 0 &&
              postList.data.posts.map((item) => (
                <TableContent item={item} key={item._id} />
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AccountList;

const TableContent = ({ item }) => {
  const isPaid = item.Paid;
  const [paymentService, { isLoading }] = usePaymentServiceMutation();
  const paidHanlder = async () => {
    try {
      const response = await paymentService({
        postId: item._id,
        paid: !isPaid,
      }).unwrap();
      if (response?.success) {
        toast.success('Sign in successfully', {
          description: 'You are being redirected to Feeds page.',
        });
      }
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
    <TableRow key={item._id}>
      <TableCell>{item._id}</TableCell>
      <TableCell>{item.location.city}</TableCell>
      <TableCell>{item.paid ? 'Yes' : 'No'}</TableCell>
      <TableCell>{item.approved ? 'Yes' : 'No'}</TableCell>
      <TableCell>{item.author.fullName}</TableCell>
      <TableCell>{item.botViews}</TableCell>
      <TableCell>{item.botLikes}</TableCell>
      <TableCell>{item.views.length}</TableCell>
      <TableCell>{item.likes.length}</TableCell>
      <TableCell>
        Views: {item.calculatedPrice.viewPrice}
        <br />
        Likes: {item.calculatedPrice.likePrice}
        <br />
        Total: {item.calculatedPrice.totalPrice}
      </TableCell>
      <TableCell>{item.validViewsCount}</TableCell>
      <TableCell>{item.validLikesCount}</TableCell>
      <TableCell>
        <Button variant={'outline'} onClick={paidHanlder} disabled={isLoading}>
          {isPaid ? 'Unpaid' : 'Paid'}
        </Button>
      </TableCell>
    </TableRow>
  );
};
