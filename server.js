require('dotenv').config();

const zmq = require('zeromq');
const { exec } = require('child_process');

const sock = zmq.socket('rep');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

console.log(`tcp://${host}:${port}`);
sock.bindSync(`tcp://${host}:${port}`);

sock.on('message', (topicBuffer, message) => {
  console.log('He wants me to execute a command');
  const command = message.toString();
  console.log(command);
  const topic = topicBuffer.toString();
  switch (topic) {
    case 'task':
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          sock.send(stdout);
        }
      });
      break;
    default: break;
  }
});
