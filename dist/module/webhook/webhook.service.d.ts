import { LemonSqueezyWebhookPayload, WebhookProcessingResult } from "./webhook.type";
export declare class WebhookService {
    private readonly LEMONSQUEEZY_WEBHOOK_SECRET;
    verifyWebhookSignature(payload: string, signature: string): boolean;
    processOrderCreated(payload: LemonSqueezyWebhookPayload): Promise<WebhookProcessingResult>;
    processOrderUpdated(payload: LemonSqueezyWebhookPayload): Promise<WebhookProcessingResult>;
    private mapLemonSqueezyStatus;
    private determineLicenseType;
    private generateLicenseKeys;
    private generateLicenseKey;
}
//# sourceMappingURL=webhook.service.d.ts.map