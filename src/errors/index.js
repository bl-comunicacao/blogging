/**
 * Exporta todas as classes de erro customizadas
 */
module.exports = {
  AppError: require('./AppError'),
  NotFoundError: require('./NotFoundError'),
  ValidationError: require('./ValidationError'),
  UnauthorizedError: require('./UnauthorizedError'),
  ForbiddenError: require('./ForbiddenError'),
};
