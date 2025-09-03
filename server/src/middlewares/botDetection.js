const botDetection = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress;

  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /automated/i,
    /headless/i,
  ];

  const isBot = botPatterns.some((pattern) => pattern.test(userAgent));

  const suspiciousPatterns = [
    !userAgent,
    userAgent.length < 10,
    /curl/i.test(userAgent),
    /wget/i.test(userAgent),
    /python/i.test(userAgent),
  ];

  const isSuspicious = suspiciousPatterns.some(
    (pattern) => pattern === true || (pattern.test && pattern.test(userAgent))
  );

  req.isBot = isBot || isSuspicious;
  req.userAgent = userAgent;
  req.clientIp = ip;

  next();
};
module.exports = botDetection;
