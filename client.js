require('dotenv').config();

const zmq = require('zeromq');
const { seconds } = require('./helpers/time');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

const sock = zmq.socket('req');

sock.connect(`tcp://${host}:${port}`);

setInterval(() => {
  const command = 'ls';
  console.log(`sending a command ${command}`);
  sock.send(['task', command]);
}, seconds(1));

sock.on('message', (message) => {
  console.log(message.toString());
});
