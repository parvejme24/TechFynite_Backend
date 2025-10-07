import { Request, Response } from "express";
import { ContactService } from "./contact.service";

const contactService = new ContactService();

// Add new contact (Public route)
export const addNewContact = async (req: Request, res: Response) => {
  const contactData = req.body;
  const contact = await contactService.addNewContact(contactData);

  return res.status(201).json({
    success: true,
    message: "Contact submitted successfully",
    data: contact,
  });
};

// Get all contacts (Admin/Super Admin only)
export const getAllContacts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query as any;
  const result = await contactService.getAllContacts(
    page,
    limit,
    status,
    search
  );

  return res.status(200).json({
    success: true,
    message: "Contacts fetched successfully",
    data: result.contacts,
    pagination: result.pagination,
  });
};

// Send contact reply (Admin/Super Admin only)
export const sendContactReply = async (req: Request, res: Response) => {
  const { id: contactId } = req.params;
  const { subject, message } = req.body;
  const userId = (req as any).user?.id;

  const reply = await contactService.sendContactReply(contactId, userId, {
    subject,
    message,
  });

  // Transform the response to include only profileImage and remove nested profile object
  const transformedReply = {
    ...reply,
    user: reply.user ? {
      id: reply.user.id,
      fullName: reply.user.fullName,
      email: reply.user.email,
      role: reply.user.role,
      profileImage: reply.user.profile?.avatarUrl || null,
    } : null,
  };

  return res.status(201).json({
    success: true,
    message: "Reply sent successfully",
    data: transformedReply,
  });
};

// Get user's contacts (User routes)
export const getUserContacts = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { page = 1, limit = 10 } = req.query as any;

  const result = await contactService.getUserContacts(userId, page, limit);

  return res.status(200).json({
    success: true,
    message: "User contacts fetched successfully",
    data: result.contacts,
    pagination: result.pagination,
  });
};

// Get contacts by user email
export const getContactsByUserEmail = async (req: Request, res: Response) => {
  const { userEmail } = req.params;
  const { page = 1, limit = 10 } = req.query as any;

  const result = await contactService.getContactsByUserEmail(
    userEmail,
    page,
    limit
  );

  return res.status(200).json({
    success: true,
    message: "Contacts fetched successfully",
    data: result.contacts,
    pagination: result.pagination,
  });
};

// Get contact by ID
export const getContactById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const contact = await contactService.getContactById(id);

  return res.status(200).json({
    success: true,
    message: "Contact fetched successfully",
    data: contact,
  });
};

// Delete contact
export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;

  const result = await contactService.deleteContact(id, userId, userRole);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
};

// Get contact statistics (Admin only)
export const getContactStats = async (req: Request, res: Response) => {
  const { period, startDate, endDate } = req.query as any;
  const stats = await contactService.getContactStats(period, startDate, endDate);

  return res.status(200).json({
    success: true,
    message: "Contact statistics fetched successfully",
    data: stats,
  });
};
