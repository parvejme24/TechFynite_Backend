"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactStats = exports.deleteContact = exports.getContactById = exports.getContactsByUserEmail = exports.getUserContacts = exports.sendContactReply = exports.getAllContacts = exports.addNewContact = void 0;
const contact_service_1 = require("./contact.service");
const contactService = new contact_service_1.ContactService();
const addNewContact = async (req, res) => {
    const contactData = req.body;
    const contact = await contactService.addNewContact(contactData);
    return res.status(201).json({
        success: true,
        message: "Contact submitted successfully",
        data: contact,
    });
};
exports.addNewContact = addNewContact;
const getAllContacts = async (req, res) => {
    const { page = 1, limit = 10, status, search } = req.query;
    const result = await contactService.getAllContacts(page, limit, status, search);
    return res.status(200).json({
        success: true,
        message: "Contacts fetched successfully",
        data: result.contacts,
        pagination: result.pagination,
    });
};
exports.getAllContacts = getAllContacts;
const sendContactReply = async (req, res) => {
    const { id: contactId } = req.params;
    const { subject, message } = req.body;
    const userId = req.user?.id;
    const reply = await contactService.sendContactReply(contactId, userId, {
        subject,
        message,
    });
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
exports.sendContactReply = sendContactReply;
const getUserContacts = async (req, res) => {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const result = await contactService.getUserContacts(userId, page, limit);
    return res.status(200).json({
        success: true,
        message: "User contacts fetched successfully",
        data: result.contacts,
        pagination: result.pagination,
    });
};
exports.getUserContacts = getUserContacts;
const getContactsByUserEmail = async (req, res) => {
    const { userEmail } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await contactService.getContactsByUserEmail(userEmail, page, limit);
    return res.status(200).json({
        success: true,
        message: "Contacts fetched successfully",
        data: result.contacts,
        pagination: result.pagination,
    });
};
exports.getContactsByUserEmail = getContactsByUserEmail;
const getContactById = async (req, res) => {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);
    return res.status(200).json({
        success: true,
        message: "Contact fetched successfully",
        data: contact,
    });
};
exports.getContactById = getContactById;
const deleteContact = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const result = await contactService.deleteContact(id, userId, userRole);
    return res.status(200).json({
        success: true,
        message: result.message,
    });
};
exports.deleteContact = deleteContact;
const getContactStats = async (req, res) => {
    const { period, startDate, endDate } = req.query;
    const stats = await contactService.getContactStats(period, startDate, endDate);
    return res.status(200).json({
        success: true,
        message: "Contact statistics fetched successfully",
        data: stats,
    });
};
exports.getContactStats = getContactStats;
//# sourceMappingURL=contact.controller.js.map