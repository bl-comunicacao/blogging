const { AppError } = require('../errors');
const logger = require('../utils/logger');

/**
 * Middleware global de tratamento de erros
 * Deve ser o último middleware na cadeia
 */
const errorHandler = (err, req, res, next) => {
  // Se já foi enviada uma resposta, delegar para o handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // Log do erro
  logger.error('Erro capturado', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode: err.statusCode || 500,
  });

  // Se for um erro operacional (AppError), usar suas propriedades
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erros de validação do PostgreSQL
  if (err.code === '23505') {
    // Unique violation
    return res.status(409).json({
      status: 'fail',
      message: 'Conflito: recurso já existe',
    });
  }

  if (err.code === '23503') {
    // Foreign key violation
    return res.status(400).json({
      status: 'fail',
      message: 'Erro de referência: recurso relacionado não existe',
    });
  }

  if (err.code === '23502') {
    // Not null violation
    return res.status(400).json({
      status: 'fail',
      message: 'Campos obrigatórios não preenchidos',
    });
  }

  // Erros de conexão com banco de dados
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      status: 'error',
      message: 'Serviço temporariamente indisponível',
    });
  }

  // Erro padrão para erros não tratados
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Erro interno do servidor'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
