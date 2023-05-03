const app = require('./app');
const debug = require('debug')('node-angular');
const http = require('http');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

const normalizePort = (val) => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges'.orange.underline);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`.bgBrightRed);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
console.log(
  `server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
);

// Handle unhandled promise Rejections (Global)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:  ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
