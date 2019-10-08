const zmq = require('zeromq');
const { exec } = require('child_process');

const sock = zmq.socket('rep');

sock.bindSync('tcp://127.0.0.1:3000');

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
