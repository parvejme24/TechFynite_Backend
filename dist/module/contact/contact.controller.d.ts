import { Request, Response } from "express";
export declare const getAllContacts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getContactById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getContactsByUserEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addNewContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const sendContactReply: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getContactStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=contact.controller.d.ts.map