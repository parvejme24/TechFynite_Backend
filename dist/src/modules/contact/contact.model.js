"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const contactForms = [];
exports.ContactModel = {
    create: (data) => {
        const newContact = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'PENDING',
        };
        contactForms.push(newContact);
        return newContact;
    },
    getAll: () => contactForms,
};
