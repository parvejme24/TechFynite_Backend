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
  getAll: (): ContactForm[] => ContactModel.getAll(),
}; 