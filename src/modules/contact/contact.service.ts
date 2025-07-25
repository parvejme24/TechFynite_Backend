import { ContactFormRequest, ContactForm } from './contact.types';
import { ContactModel } from './contact.model';
import { sendEmail } from '../auth/auth.utils';

export const ContactService = {
  create: async (data: ContactFormRequest): Promise<ContactForm> => {
    const contact = ContactModel.create(data);
    // Optionally send an email notification to admin
    try {
      await sendEmail(
        process.env.CONTACT_NOTIFY_EMAIL || 'parvej@techfynite.com',
        'New Contact Form Submission',
        `New contact form submitted by ${data.fullName} (${data.email})\n\nProject Details: ${data.projectDetails}\nBudget: ${data.budget}\nCompany: ${data.companyName}\nService: ${data.serviceRequred}`
      );
    } catch (e) {
      // Log but don't fail the request
      console.error('Failed to send contact notification email:', e);
    }
    return contact;
  },
  /**
   * Get all contacts with optional filtering, searching, sorting, and pagination
   * @param options { keyword?: string, fromDate?: string, toDate?: string, serviceRequred?: string, page?: number, pageSize?: number }
   * @returns { data: ContactForm[], total: number }
   */
  getAll: (options?: {
    keyword?: string;
    fromDate?: string;
    toDate?: string;
    serviceRequred?: string;
    page?: number;
    pageSize?: number;
  }): { data: ContactForm[]; total: number } => {
    let contacts = ContactModel.getAll();

    // Filter by serviceRequred
    if (options?.serviceRequred) {
      contacts = contacts.filter(c => c.serviceRequred === options.serviceRequred);
    }

    // Filter by date range
    if (options?.fromDate) {
      const from = new Date(options.fromDate);
      contacts = contacts.filter(c => new Date(c.createdAt) >= from);
    }
    if (options?.toDate) {
      const to = new Date(options.toDate);
      contacts = contacts.filter(c => new Date(c.createdAt) <= to);
    }

    // Keyword search (search in all string fields)
    if (options?.keyword) {
      const keyword = options.keyword.toLowerCase();
      contacts = contacts.filter(c =>
        c.projectDetails.toLowerCase().includes(keyword) ||
        c.budget.toLowerCase().includes(keyword) ||
        c.fullName.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.companyName.toLowerCase().includes(keyword) ||
        c.serviceRequred.toLowerCase().includes(keyword)
      );
    }

    // Sort by createdAt (recent to old)
    contacts = contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const page = options?.page && options.page > 0 ? options.page : 1;
    const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 9;
    const total = contacts.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = contacts.slice(start, end);

    return { data, total };
  },
}; 