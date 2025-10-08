import { Request, Response, NextFunction } from "express";
export declare const validateCreateOrder: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateUpdateOrderStatus: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateOrderId: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateOrderQuery: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=order.validate.d.ts.map