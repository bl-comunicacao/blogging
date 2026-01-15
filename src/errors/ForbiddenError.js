const AppError = require('./AppError');

/**
 * Erro para acesso proibido (403)
 */
class ForbiddenError extends AppError {
  constructor(message = 'Acesso proibido') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
