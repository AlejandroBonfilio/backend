const { createLogger, transports, format } = require('winston');

// Define los niveles de prioridad
const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Configuración para el logger de desarrollo (consola)
const developmentLogger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      level: 'debug', // Solo registra desde el nivel 'debug' en adelante
    }),
  ],
});

// Configuración para el logger de producción (archivo)
const productionLogger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: 'errors.log',
      level: 'error', // Registra desde el nivel 'error' en adelante en un archivo "errors.log"
    }),
  ],
});

// Define un método para cambiar entre el logger de desarrollo y producción
const getLogger = (env) => {
  return env === 'production' ? productionLogger : developmentLogger;
};

module.exports = getLogger;
