require('dotenv').config();

const { exec } = require('child_process');
const zmq = require('zeromq');
const debug = require('debug')('server');

const sock = zmq.socket('rep');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

debug(`tcp://${host}:${port}`);
sock.bindSync(`tcp://${host}:${port}`);

sock.on('message', (topicBuffer, message) => {
  debug('He wants me to execute a command');
  const command = message.toString();
  debug(command);
  const topic = topicBuffer.toString();
  switch (topic) {
    case 'task':
      exec(command, (err, stdout, stderr) => {
        if (err) {
          debug(err);
        } else {
          debug(`stdout: ${stdout}`);
          debug(`stderr: ${stderr}`);
          sock.send(stdout);
        }
      });
      break;
    default: break;
  }
});
