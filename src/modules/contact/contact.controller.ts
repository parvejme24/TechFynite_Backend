import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { ContactFormRequest } from './contact.types';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const data: ContactFormRequest = req.body;
    const contact = await ContactService.create(data);
    res.status(201).json({ message: 'Contact form submitted successfully', contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = ContactService.getAll();
    res.json(contacts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch contact forms' });
  }
}; 