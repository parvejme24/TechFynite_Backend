import { Contact, ContactReply, ContactStats, PaginatedContacts } from "./contact.type";

export interface IContactService {
  addNewContact(data: {
    projectDetails: string;
    budget: string;
    fullName: string;
    email: string;
    companyName: string;
    serviceRequired: string;
    userId?: string;
  }): Promise<Contact>;

  getAllContacts(page?: number, limit?: number, search?: string): Promise<PaginatedContacts>;

  getContactById(id: string): Promise<Contact | null>;

  getUserContacts(userId: string, page?: number, limit?: number): Promise<PaginatedContacts>;

  getContactsByUserEmail(userEmail: string, page?: number, limit?: number): Promise<PaginatedContacts>;

  deleteContact(id: string, userId?: string): Promise<{ success: boolean; message: string }>;

  sendContactReply(
    contactId: string,
    userId: string | undefined,
    data: { subject: string; message: string }
  ): Promise<ContactReply>;

  getContactReplies(contactId: string): Promise<ContactReply[]>;

  getContactStats(period?: string, startDate?: string, endDate?: string): Promise<ContactStats>;
}
