import { Request, Response, NextFunction } from "express";

/**
 * Tipo para funções de controller async
 * Aceita funções com ou sem o parâmetro next
 * Usa generics para aceitar qualquer tipo de Request
 */
type AsyncRequestHandler = (
  req: Request<any, any, any, any>,
  res: Response,
  next?: NextFunction
) => Promise<Response | void>;

/**
 * Wrapper para funções async que captura erros automaticamente
 * Elimina a necessidade de try/catch em cada controller
 *
 * Uso:
 * router.get('/', asyncHandler(controller.getAll));
 */
const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
