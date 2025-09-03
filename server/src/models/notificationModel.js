const { default: mongoose } = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
notificationSchema.index({ user: 1, createdAt: -1 });
const NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;
