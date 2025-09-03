const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../configs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minLength: [3, 'Full name must be at least 3 characters'],
      maxLength: [50, 'Full name must be at most 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [30, 'Username must be at most 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowerCase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
    },
    profilePicture: {
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
        type: String,
      },
    },
    bio: {
      type: String,
      maxLength: [160, 'Bio must be at most 160 characters'],
      trim: true,
      default: '',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'accountant'],
      default: 'user',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword) {
    throw new Error('Missing password field for comparison');
  }
  if (!enteredPassword || !this.password) {
    throw new Error('Missing password fields for comparison');
  }
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, config.SECRET_KEY, {
    expiresIn: '7d',
  });
};
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
