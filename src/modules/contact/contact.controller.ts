import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { ContactFormRequest, UpdateContactStatusRequest, UpdateContactRequest, ReplyEmailRequest } from './contact.types';
import { sendEmail } from '../auth/auth.utils';
import { UserRole } from '../../generated/prisma';

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * POST /contacts
 * Public: Add new contact (anyone can submit)
 */
export const addNewContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data: ContactFormRequest = req.body;
    const userId = req.user?.userId; // Add user ID if logged in, otherwise null
    
    const contact = await ContactService.create(data, userId);
    res.status(201).json({ 
      success: true,
      message: 'Contact form submitted successfully', 
      data: contact 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to submit contact form' 
    });
  }
};

/**
 * GET /contacts
 * Admin/Super Admin: Get all contacts
 */
export const getAllContacts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { keyword, fromDate, toDate, serviceRequred, page, pageSize } = req.query;
    const result = await ContactService.getAll({
      keyword: keyword as string | undefined,
      fromDate: fromDate as string | undefined,
      toDate: toDate as string | undefined,
      serviceRequred: serviceRequred as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
    });
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch contact forms' 
    });
  }
};

/**
 * GET /contacts/user
 * User: Get all contacts for logged-in user (requires user account)
 */
export const getUserContacts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account required to view contacts' 
      });
    }
    
    const contacts = await ContactService.getByUserId(userId);
    res.json({ 
      success: true, 
      data: contacts 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch user contacts' 
    });
  }
};

/**
 * GET /contacts/:id
 * Admin/Super Admin: Get any contact by ID
 * User: Get contact by ID (only if user owns it)
 */
export const getContactById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    const contact = await ContactService.getById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check access permissions
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && contact.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch contact'
    });
  }
};

/**
 * DELETE /contacts/:id
 * User: Delete contact (only if user owns it)
 */
export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Check if contact exists
    const contact = await ContactService.getById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Only user can delete their own contact (not admin)
    if (contact.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own contacts'
      });
    }

    await ContactService.delete(id);
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete contact'
    });
  }
};

/**
 * PATCH /contacts/:id/status
 * Admin/Super Admin: Change contact status
 */
export const changeContactStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateContactStatusRequest = req.body;

    // Check if contact exists
    const exists = await ContactService.contactExists(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const contact = await ContactService.updateStatus(id, data);
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update contact status'
    });
  }
};

/**
 * POST /contacts/:id/reply
 * Admin/Super Admin: Send email/reply for contact
 */
export const sendContactReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message, replyTo } = req.body as ReplyEmailRequest;
    
    // Validate required fields
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }
    
    // Get contact details
    const contact = await ContactService.getById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Send reply email
    const replyFrom = replyTo || process.env.CONTACT_REPLY_EMAIL || 'noreply@techfynite.com';
    const emailContent = `
Reply from Admin:

Subject: ${subject}

Message:
${message}

---
Original Contact Details:
Name: ${contact.fullName}
Email: ${contact.email}
Company: ${contact.companyName}
Service: ${contact.serviceRequred}
Project Details: ${contact.projectDetails}
Budget: ${contact.budget}
    `;

    await sendEmail(
      contact.email,
      `Re: ${subject}`,
      emailContent
    );

    // Add reply to database
    const userId = req.user?.userId;
    if (userId) {
      await ContactService.addReply(id, userId, subject, message);
    }

    // Update contact status to 'Replied'
    await ContactService.updateStatus(id, { status: 'Replied' });

    res.json({
      success: true,
      message: 'Reply email sent successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send reply email'
    });
  }
};

/**
 * POST /contacts/:id/resend
 * Admin/Super Admin: Resend contact notification
 */
export const resendContactNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await ContactService.getById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Resend email notification to admin
    await sendEmail(
      process.env.CONTACT_NOTIFY_EMAIL || 'admin@techfynite.com',
      'Contact Form Resent',
      `Contact form resent by ${contact.fullName} (${contact.email})\n\nProject Details: ${contact.projectDetails}\nBudget: ${contact.budget}\nCompany: ${contact.companyName}\nService: ${contact.serviceRequred}`
    );

    res.json({
      success: true,
      message: 'Contact notification resent successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend contact notification'
    });
  }
};

/**
 * POST /contacts/:id/replies
 * Admin/Super Admin: Add internal reply to contact
 */
export const addContactReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Check if contact exists
    const contact = await ContactService.getById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Add reply to database
    const reply = await ContactService.addReply(id, userId, subject, message);

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: reply
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add reply'
    });
  }
};

/**
 * GET /contacts/:id/replies
 * Admin/Super Admin: Get all replies for a contact
 */
export const getContactReplies = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    // Check if contact exists
    const contact = await ContactService.getById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Only admins can view replies
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const replies = await ContactService.getReplies(id);

    res.json({
      success: true,
      data: replies
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch replies'
    });
  }
};

/**
 * DELETE /contacts/replies/:replyId
 * Admin/Super Admin: Delete a reply
 */
export const deleteContactReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { replyId } = req.params;
    const userRole = req.user?.role;

    // Only admins can delete replies
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await ContactService.deleteReply(replyId);

    res.json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete reply'
    });
  }
}; 