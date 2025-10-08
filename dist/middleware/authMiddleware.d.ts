import { Request, Response, NextFunction } from "express";
export declare const authenticateUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkUserStatus: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authenticateAndCheckStatus: (((req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>) | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
export declare const authenticateAdminAndCheckStatus: (((req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>) | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
//# sourceMappingURL=authMiddleware.d.ts.map