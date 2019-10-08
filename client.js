/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
require('dotenv').config();

const zmq = require('zeromq');
const debug = require('debug')('client');
const prompts = require('prompts');

const { PORT, HOST, DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

const port = PORT || 4044;
const host = HOST || '127.0.0.1';

const sock = zmq.socket('req');


(async () => {
  await sock.connect(`tcp://${host}:${port}`);

  sock.on('message', (message) => {
    const response = JSON.parse(message.toString());
    debug(response);
  });

  while (true) {
    const command = await prompts({
      type: 'text',
      name: 'value',
      message: 'What\'s your command?',
    });
    debug(`sending a command ${command.value}`);
    sock.send(['task', command.value]);

    const nextAction = await prompts({
      type: 'toggle',
      name: 'continue',
      message: 'Shall we continue?',
      initial: true,
      active: 'continue',
      inactive: 'exit',
    });

    if (!nextAction.continue) {
      process.exit();
      break;
    }
  }
})();
