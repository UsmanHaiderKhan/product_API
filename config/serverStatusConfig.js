const config = {
  title: `BizHub '${
    process.env.SERVER_STATUS_ENV ?? process.env.NODE_ENV
  }' Backend Server Status`,
  path: '/status',
  spans: [
    {
      interval: 1,
      retention: 60,
    },
    {
      interval: 5,
      retention: 60,
    },
    {
      interval: 15,
      retention: 60,
    },
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: [getHealthCheckConfig()],
  ignoreStartsWith: '/admin',
};

function getHealthCheckConfig() {
  let healthChk = {};
  if (
    process.env.SERVER_STATUS_ENV &&
    process.env.SERVER_STATUS_ENV === 'local'
  ) {
    healthChk = {
      protocol: 'http',
      host: 'localhost',
      port: process.env.PORT,
      path: '/api/v1/health',
    };
  } else if (process.env.NODE_ENV === 'development') {
    healthChk = {
      protocol: 'https',
      host: 'bizhub-api.herokuapp.com',
      path: '/api/v1/health',
    };
  } else if (process.env.NODE_ENV === 'production') {
    healthChk = {
      protocol: 'https',
      host: 'api.bizhub.gy',
      path: '/api/v1/health',
    };
  }
  return healthChk;
}

module.exports = config;
