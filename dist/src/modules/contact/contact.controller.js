"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactReply = exports.getContactReplies = exports.addContactReply = exports.resendContactNotification = exports.sendContactReply = exports.changeContactStatus = exports.deleteContact = exports.getContactById = exports.getUserContacts = exports.getAllContacts = exports.addNewContact = void 0;
const contact_service_1 = require("./contact.service");
const auth_utils_1 = require("../auth/auth.utils");
/**
 * POST /contacts
 * Public: Add new contact (anyone can submit)
 */
const addNewContact = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user?.userId; // Add user ID if logged in, otherwise null
        const contact = await contact_service_1.ContactService.create(data, userId);
        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: contact
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit contact form'
        });
    }
};
exports.addNewContact = addNewContact;
/**
 * GET /contacts
 * Admin/Super Admin: Get all contacts
 */
const getAllContacts = async (req, res) => {
    try {
        const { keyword, fromDate, toDate, serviceRequred, page, pageSize } = req.query;
        const result = await contact_service_1.ContactService.getAll({
            keyword: keyword,
            fromDate: fromDate,
            toDate: toDate,
            serviceRequred: serviceRequred,
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch contact forms'
        });
    }
};
exports.getAllContacts = getAllContacts;
/**
 * GET /contacts/user
 * User: Get all contacts for logged-in user (requires user account)
 */
const getUserContacts = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User account required to view contacts'
            });
        }
        const contacts = await contact_service_1.ContactService.getByUserId(userId);
        res.json({
            success: true,
            data: contacts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user contacts'
        });
    }
};
exports.getUserContacts = getUserContacts;
/**
 * GET /contacts/:id
 * Admin/Super Admin: Get any contact by ID
 * User: Get contact by ID (only if user owns it)
 */
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const contact = await contact_service_1.ContactService.getById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch contact'
        });
    }
};
exports.getContactById = getContactById;
/**
 * DELETE /contacts/:id
 * User: Delete contact (only if user owns it)
 */
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        // Check if contact exists
        const contact = await contact_service_1.ContactService.getById(id);
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
        await contact_service_1.ContactService.delete(id);
        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete contact'
        });
    }
};
exports.deleteContact = deleteContact;
/**
 * PATCH /contacts/:id/status
 * Admin/Super Admin: Change contact status
 */
const changeContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // Check if contact exists
        const exists = await contact_service_1.ContactService.contactExists(id);
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        const contact = await contact_service_1.ContactService.updateStatus(id, data);
        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update contact status'
        });
    }
};
exports.changeContactStatus = changeContactStatus;
/**
 * POST /contacts/:id/reply
 * Admin/Super Admin: Send email/reply for contact
 */
const sendContactReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, message, replyTo } = req.body;
        // Validate required fields
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }
        // Get contact details
        const contact = await contact_service_1.ContactService.getById(id);
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
        await (0, auth_utils_1.sendEmail)(contact.email, `Re: ${subject}`, emailContent);
        // Add reply to database
        const userId = req.user?.userId;
        if (userId) {
            await contact_service_1.ContactService.addReply(id, userId, subject, message);
        }
        // Update contact status to 'Replied'
        await contact_service_1.ContactService.updateStatus(id, { status: 'Replied' });
        res.json({
            success: true,
            message: 'Reply email sent successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send reply email'
        });
    }
};
exports.sendContactReply = sendContactReply;
/**
 * POST /contacts/:id/resend
 * Admin/Super Admin: Resend contact notification
 */
const resendContactNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contact_service_1.ContactService.getById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        // Resend email notification to admin
        await (0, auth_utils_1.sendEmail)(process.env.CONTACT_NOTIFY_EMAIL || 'admin@techfynite.com', 'Contact Form Resent', `Contact form resent by ${contact.fullName} (${contact.email})\n\nProject Details: ${contact.projectDetails}\nBudget: ${contact.budget}\nCompany: ${contact.companyName}\nService: ${contact.serviceRequred}`);
        res.json({
            success: true,
            message: 'Contact notification resent successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to resend contact notification'
        });
    }
};
exports.resendContactNotification = resendContactNotification;
/**
 * POST /contacts/:id/replies
 * Admin/Super Admin: Add internal reply to contact
 */
const addContactReply = async (req, res) => {
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
        const contact = await contact_service_1.ContactService.getById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        // Add reply to database
        const reply = await contact_service_1.ContactService.addReply(id, userId, subject, message);
        res.json({
            success: true,
            message: 'Reply added successfully',
            data: reply
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add reply'
        });
    }
};
exports.addContactReply = addContactReply;
/**
 * GET /contacts/:id/replies
 * Admin/Super Admin: Get all replies for a contact
 */
const getContactReplies = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user?.role;
        // Check if contact exists
        const contact = await contact_service_1.ContactService.getById(id);
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
        const replies = await contact_service_1.ContactService.getReplies(id);
        res.json({
            success: true,
            data: replies
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch replies'
        });
    }
};
exports.getContactReplies = getContactReplies;
/**
 * DELETE /contacts/replies/:replyId
 * Admin/Super Admin: Delete a reply
 */
const deleteContactReply = async (req, res) => {
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
        await contact_service_1.ContactService.deleteReply(replyId);
        res.json({
            success: true,
            message: 'Reply deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete reply'
        });
    }
};
exports.deleteContactReply = deleteContactReply;
