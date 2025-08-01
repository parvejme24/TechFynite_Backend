import { Router } from 'express';
import { validateLicense } from './license.controller';

const router = Router();

router.post('/licenses/validate', validateLicense);

export default router; 