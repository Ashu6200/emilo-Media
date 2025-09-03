const { config } = require('../configs');
const ApplicationEnvironment = require('../constants');

const apiError = (nextFun, err, req, errorStatusCode = 500) => {
  const errorObj = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req?.ip || null,
      method: req?.method,
      url: req?.originalUrl,
    },
    message:
      err instanceof Error
        ? err.message || 'Something went wrong'
        : 'Something went wrong',
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  };

  if (config.ENV === ApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return nextFun(errorObj);
};

module.exports = apiError;
