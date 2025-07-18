import { ContactForm, ContactFormRequest } from './contact.types';

const contactForms: ContactForm[] = [];

export const ContactModel = {
  create: (data: ContactFormRequest): ContactForm => {
    const newContact: ContactForm = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    contactForms.push(newContact);
    return newContact;
  },
  getAll: (): ContactForm[] => contactForms,
}; 