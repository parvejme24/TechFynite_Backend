import { Request, Response } from "express";
export declare const getAllLicenses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLicenseById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const validateLicense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const revokeLicense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLicenseStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserLicenses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=license.controller.d.ts.map