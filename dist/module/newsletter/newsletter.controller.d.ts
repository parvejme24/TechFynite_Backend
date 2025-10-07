import { Request, Response } from "express";
export declare const subscribeNewsletter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllNewsletterSubscribers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteNewsletterSubscriber: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const newsletterStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=newsletter.controller.d.ts.map