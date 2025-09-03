import React, { useState } from 'react';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { useCreatePostServiceMutation } from '../../store/postFeatures/postService';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const CreatePost = () => {
  const [createPostService, { isLoading }] = useCreatePostServiceMutation();
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const MAX_FILES = 3;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_CHARACTERS = 280;
  const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    if (!content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (content.length > MAX_CHARACTERS) {
      newErrors.content = `Content cannot exceed ${MAX_CHARACTERS} characters`;
      isValid = false;
    }
    if (files.length > MAX_FILES) {
      newErrors.files = `You can only upload up to ${MAX_FILES} files`;
      isValid = false;
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      newErrors.files = `Total file size cannot exceed ${Math.round(
        MAX_TOTAL_SIZE / (1024 * 1024)
      )}MB`;
      isValid = false;
    }
    files.forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        newErrors.files = 'Only images and videos are allowed';
        isValid = false;
      }
      if (file.size > MAX_FILE_SIZE) {
        newErrors.files = `Each file must be smaller than ${
          MAX_FILE_SIZE / (1024 * 1024)
        } MB`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files`);
      return;
    }
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid image or video`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `${file.name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
        );
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const postHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('content', content);
    files.forEach((file) => formData.append('media', file));

    // Debug: Log what we're sending
    console.log('Sending data:');
    console.log('Content:', content);
    console.log('Files:', files);
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await createPostService(formData).unwrap();

      if (response?.success) {
        toast.success('Post created successfully!');
        setContent('');
        setFiles([]);
        setErrors({});
      } else {
        toast.error(response?.message || 'Post creation failed');
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.log('Error status:', err?.status);
      console.log('Error data:', err?.data);
      console.log('Error message:', err?.data?.message);

      const status = err?.status;
      const message = err?.data?.message;

      // Show the exact error message from server
      if (message) {
        toast.error(`Server error: ${message}`);
      } else {
        toast.error(`HTTP ${status}: Something went wrong`);
      }
    }
  };

  return (
    <section className='mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 px-4 py-4'>
      <h1 className='text-2xl font-semibold text-primary'>Create New Post</h1>
      <p className='text-sm text-muted-foreground'>
        Share your thoughts, photos, and videos with the world.
      </p>
      <div className=''>
        <form className='space-y-4' onSubmit={postHandler}>
          {/* Content */}
          <div>
            <Label
              htmlFor='content'
              className='block text-sm font-medium text-primary'
            >
              Content
            </Label>
            <Textarea
              id='content'
              rows='5'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
              placeholder='Write a Content...'
            />
            <div className='mt-1 flex justify-between text-sm'>
              <div>
                {errors.content && (
                  <span className='text-red-500'>{errors.content}</span>
                )}
              </div>
              <span
                className={`${
                  content.length > 280 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {content.length}/280 characters
              </span>
            </div>
          </div>
          <div>
            <Label
              htmlFor='media'
              className='block text-sm font-medium text-primary'
            >
              Upload Media
            </Label>
            <input
              type='file'
              id='media'
              accept='image/*,video/*'
              multiple
              onChange={handleFileChange}
              className='mt-1 block w-full text-sm text-primary file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/80'
            />
            {errors.files && (
              <p className='mt-1 text-sm text-red-500'>{errors.files}</p>
            )}
          </div>
          {files.length > 0 && (
            <div className='mt-4 grid grid-cols-3 gap-2'>
              {files.map((file, idx) => (
                <div key={idx} className='relative rounded border p-1'>
                  <Button
                    type='button'
                    onClick={() => removeFile(idx)}
                    className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600'
                  >
                    <X size={14} />
                  </Button>
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='h-32 w-full rounded object-cover'
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className='h-32 w-full rounded object-cover'
                    />
                  )}
                  <p className='mt-1 truncate text-xs text-muted-foreground'>
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Button
            type='submit'
            variant='default'
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
