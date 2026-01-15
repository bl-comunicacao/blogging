/**
 * Wrapper para funções async que captura erros automaticamente
 * Elimina a necessidade de try/catch em cada controller
 * 
 * Uso:
 * router.get('/', asyncHandler(controller.getAll));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
