import {
  useAppprovePostServiceMutation,
  usePostListServiceQuery,
} from '../../store/mainFeatures/mainService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const PostList = () => {
  const {
    data: postList,
    isLoading,
    isError,
    error,
    isSuccess,
  } = usePostListServiceQuery();
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
                <TableContent key={item._id} item={item} />
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PostList;

const TableContent = ({ item }) => {
  const isApproved = item.approved;
  const [appprovePostService, { isLoading }] = useAppprovePostServiceMutation();
  const approveHandler = async () => {
    try {
      const response = await appprovePostService({
        postId: item._id,
        approved: !isApproved,
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
    <TableRow>
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
        <Button
          variant={'outline'}
          onClick={approveHandler}
          disabled={isLoading}
        >
          {isApproved ? 'Unapproved' : 'Approved'}
        </Button>
      </TableCell>
    </TableRow>
  );
};
