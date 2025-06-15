import { logger } from 'react-native-logs';

const config = {
  severity: 'debug', // minimum level to log
  transportOptions: {
    _def: '', // Add the required _def property
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'gray',
    },
  },
};

const log = logger.createLogger(config);

export default log;
