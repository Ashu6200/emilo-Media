const { default: mongoose } = require('mongoose');

const comment = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [40, 'Comment cannot exceed 40 characters'],
    },
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [40, 'Reply cannot exceed 40 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: [280, 'Post content cannot exceed 280 characters'],
      required: [true, 'Post content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          // required: true,
        },
        url: {
          type: String,
          // required: true,
        },
        publicId: {
          type: String,
          // required: true,
        },
        thumbnail: {
          // type: String,
        },
      },
    ],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pricing',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [comment],
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    botViews: { type: Number, default: 0 },
    botLikes: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });
const PostModel = mongoose.model('Post', postSchema);
module.exports = PostModel;
