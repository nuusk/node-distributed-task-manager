require('dotenv').config();

const zmq = require('zeromq');
const debug = require('debug')('client');
const { seconds } = require('./helpers/time');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

const sock = zmq.socket('req');

sock.connect(`tcp://${host}:${port}`);

setInterval(() => {
  const command = 'ls';
  debug(`sending a command ${command}`);
  sock.send(['task', command]);
}, seconds(1));

sock.on('message', (message) => {
  debug(message.toString());
});
