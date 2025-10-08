import { IContactService } from "./contact.interface";
import { Contact, ContactReply, ContactStats, PaginatedContacts } from "./contact.type";
export declare class ContactService implements IContactService {
    addNewContact(data: {
        projectDetails: string;
        budget: string;
        fullName: string;
        email: string;
        companyName: string;
        serviceRequired: string;
        userId?: string;
    }): Promise<Contact>;
    getAllContacts(page?: number, limit?: number, status?: string, search?: string): Promise<PaginatedContacts>;
    getContactById(id: string): Promise<Contact | null>;
    getUserContacts(userId: string, page?: number, limit?: number): Promise<PaginatedContacts>;
    getContactsByUserEmail(userEmail: string, page?: number, limit?: number): Promise<PaginatedContacts>;
    deleteContact(id: string, userId?: string, userRole?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendContactReply(contactId: string, userId: string, data: {
        subject: string;
        message: string;
    }): Promise<ContactReply>;
    getContactReplies(contactId: string): Promise<ContactReply[]>;
    getContactStats(period?: string, startDate?: string, endDate?: string): Promise<ContactStats>;
}
//# sourceMappingURL=contact.service.d.ts.map