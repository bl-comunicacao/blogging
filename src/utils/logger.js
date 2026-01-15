/**
 * Sistema de logging estruturado
 * Em produção, pode ser substituído por winston ou pino
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta,
  };

  if (isDevelopment) {
    // Em desenvolvimento, formatação mais legível
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);
  } else {
    // Em produção, JSON estruturado
    console.log(JSON.stringify(logEntry));
  }

  return logEntry;
};

const logger = {
  error: (message, meta = {}) => {
    if (!isTest) {
      formatMessage('error', message, meta);
    }
  },

  warn: (message, meta = {}) => {
    if (!isTest) {
      formatMessage('warn', message, meta);
    }
  },

  info: (message, meta = {}) => {
    if (!isTest) {
      formatMessage('info', message, meta);
    }
  },

  debug: (message, meta = {}) => {
    if (isDevelopment && !isTest) {
      formatMessage('debug', message, meta);
    }
  },
};

module.exports = logger;
