import { Router } from 'express';
import { submitContactForm, getAllContacts } from './contact.controller';

const router = Router();

router.post('/contact', submitContactForm);
router.get('/contact', getAllContacts); // For admin/testing

export default router; 