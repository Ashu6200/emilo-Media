const { appServer } = require('./app');
const { connectDB, config } = require('./configs');
const createData = require('./data');
const server = async () => {
  await connectDB();
  // createData();
  appServer.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};
server();
