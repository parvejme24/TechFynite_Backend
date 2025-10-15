import { Request, Response } from "express";
import { contactService } from "./contact.service";
import { IContactQuery } from "./contact.interface";

// Get all contacts (Admin/Super Admin only)
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const query: IContactQuery = (req as any).validatedQuery || req.query;
    const result = await contactService.getAllContacts(query);
    
    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: result.contacts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get contact by ID
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await contactService.getContactById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get contacts by user email
export const getContactsByUserEmail = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;
    
    const contacts = await contactService.getContactsByUserEmail(userEmail);
    
    return res.status(200).json({
      success: true,
      message: "User contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching user contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new contact (Public route)
export const addNewContact = async (req: Request, res: Response) => {
  try {
    const contactData = (req as any).validatedBody || req.body;
    
    const contact = await contactService.createContact(contactData);
    
    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update contact
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = (req as any).validatedBody || req.body;
    
    // Check if contact exists
    const contactExists = await contactService.contactExists(id);
    if (!contactExists) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        data: null,
      });
    }
    
    const updatedContact = await contactService.updateContact(id, updateData);
    
    if (!updatedContact) {
      return res.status(500).json({
        success: false,
        message: "Failed to update contact",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete contact
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if contact exists
    const contactExists = await contactService.contactExists(id);
    if (!contactExists) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        data: null,
      });
    }
    
    const deleted = await contactService.deleteContact(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete contact",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Send contact reply (Admin/Super Admin only)
export const sendContactReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message } = (req as any).validatedBody || req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
        data: null,
      });
    }
    
    // Check if contact exists
    const contactExists = await contactService.contactExists(id);
    if (!contactExists) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        data: null,
      });
    }
    
    const replyData = {
      subject,
      message,
      contactId: id,
      userId,
    };
    
    const reply = await contactService.createContactReply(replyData);
    
    return res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: reply,
    });
  } catch (error) {
    console.error("Error sending contact reply:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get contact statistics (Admin/Super Admin only)
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const stats = await contactService.getContactStats();
    
    return res.status(200).json({
      success: true,
      message: "Contact statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching contact statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
