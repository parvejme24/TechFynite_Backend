import { Request, Response } from 'express';
import { LicenseService } from './license.service';

export const validateLicense = async (req: Request, res: Response) => {
  try {
    const { licenseKey, templateId } = req.body;

    if (!licenseKey || !templateId) {
      return res.status(400).json({ 
        error: 'License key and template ID are required' 
      });
    }

    const validationResult = await LicenseService.validateLicense(licenseKey, templateId);
    res.json(validationResult);
  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({ 
      error: 'Failed to validate license', 
      details: error instanceof Error ? error.message : error 
    });
  }
}; 