const cors = require('cors');
const { config } = require('./configs');
const cloudinary = require('cloudinary').v2;
const {
  asyncHandler,
  errorHandler,
  socketAuthenticate,
} = require('./middlewares');
const { apiResponse, apiError } = require('./utils');
const {
  authRouter,
  userRouter,
  postRouter,
  pricingRouter,
  mainController,
} = require('./routes');
const http = require('http');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const appServer = http.createServer(app);
const io = new Server(appServer, {
  cors: {
    origin: config.ORIGIN.split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: config.ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Origin',
      'Accept',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: '50mb',
  })
);

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  })
);
app.use(
  express.raw({
    limit: '50mb',
  })
);

app.get(
  '/api/live',
  asyncHandler((req, res, _next) => {
    const message = 'Welcome to EmiloMedia API';
    apiResponse(req, res, 200, message, null);
  })
);
app.get(
  '/api/health',
  asyncHandler((req, res, _next) => {
    const message = 'EmiloMedia API health check';
    apiResponse(req, res, 200, message, {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  })
);
app.get('/api/test-cloudinary', async (req, res, next) => {
  try {
    const result = await cloudinary.api.ping();
    return apiResponse(req, res, 200, 'Cloudinary test successful', result);
  } catch (err) {
    console.error(err);
    console.log(err);
    return apiError(next, err, req, 500);
  }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/main', mainController);

app.use((req, _res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  apiError(next, error, req, 404);
});
io.use((socket, next) => socketAuthenticate(socket, next));

io.on('connection', (socket) => {
  console.log('User connected');
  socket.join(socket.user.id.toString());
  socket.on('disconnect', () => console.log('User disconnected'));
});

app.use(errorHandler);

module.exports = { appServer, io };
