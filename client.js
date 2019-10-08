const zmq = require('zeromq');
const { seconds } = require('./helpers/time');

const sock = zmq.socket('req');

sock.connect('tcp://127.0.0.1:3000');
console.log('Bound to port 3000');

setInterval(() => {
  console.log('sending a command');
  const command = 'ls';
  sock.send(['task', command]);
}, seconds(1));

sock.on('message', (message) => {
  console.log(message.toString());
});
