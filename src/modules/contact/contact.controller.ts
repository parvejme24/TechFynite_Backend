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

/**
 * GET /contact
 * Query params:
 *   - keyword: string (search in all fields)
 *   - fromDate: string (ISO date)
 *   - toDate: string (ISO date)
 *   - serviceRequred: string (filter by service)
 *   - page: number (default 1)
 *   - pageSize: number (default 9)
 * Returns: { data: ContactForm[], total: number }
 */
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const { keyword, fromDate, toDate, serviceRequred, page, pageSize } = req.query;
    const result = ContactService.getAll({
      keyword: keyword as string | undefined,
      fromDate: fromDate as string | undefined,
      toDate: toDate as string | undefined,
      serviceRequred: serviceRequred as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
    });
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch contact forms' });
  }
}; 