require('dotenv').config();

const { exec } = require('child_process');
const zmq = require('zeromq');
const debug = require('debug')('server');

const sock = zmq.socket('rep');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

sock.bindSync(`tcp://${host}:${port}`);
debug(`Started running on tcp://${host}:${port}`);

sock.on('message', (topicBuffer, message) => {
  const topic = topicBuffer.toString();
  let result;
  const command = message.toString();
  debug(`Requested to run ${command}:`);
  switch (topic) {
    case 'task':
      result = exec(command, (err, stdout, stderr) => {
        if (err) {
          debug(err);
          sock.send(JSON.stringify({ err, statusCode: result.exitCode }));
        } else {
          debug(`stdout: ${stdout}`);
          debug(`stderr: ${stderr}`);
          sock.send(JSON.stringify({ stdout, statusCode: result.exitCode }));
        }
      });
      break;
    default: break;
  }
});
