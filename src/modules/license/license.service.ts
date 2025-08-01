import { prisma } from '../../config/database';

export const LicenseService = {
  validateLicense: async (licenseKey: string, templateId: string) => {
    // Find the license
    const license = await prisma.license.findUnique({
      where: { licenseKey },
      include: {
        template: true,
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          }
        }
      }
    });

    if (!license) {
      return {
        isValid: false,
        message: 'License not found',
        error: 'INVALID_LICENSE'
      };
    }

    // Check if license is for the correct template
    if (license.templateId !== templateId) {
      return {
        isValid: false,
        message: 'License is not valid for this template',
        error: 'WRONG_TEMPLATE'
      };
    }

    // Check if license is still valid
    if (!license.isValid) {
      return {
        isValid: false,
        message: 'License has been revoked',
        error: 'REVOKED_LICENSE'
      };
    }

    // Check if license has expired
    if (license.expiresAt && license.expiresAt < new Date()) {
      return {
        isValid: false,
        message: 'License has expired',
        error: 'EXPIRED_LICENSE'
      };
    }

    return {
      isValid: true,
      message: 'License is valid',
      license: {
        id: license.id,
        licenseKey: license.licenseKey,
        templateId: license.templateId,
        userId: license.userId,
        isValid: license.isValid,
        expiresAt: license.expiresAt,
        createdAt: license.createdAt,
        template: {
          id: license.template.id,
          title: license.template.title,
          slug: license.template.slug,
        },
        user: license.user,
      }
    };
  },

  getUserLicenses: async (userId: string) => {
    return prisma.license.findMany({
      where: { userId },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            shortDescription: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  getTemplateLicenses: async (templateId: string) => {
    return prisma.license.findMany({
      where: { templateId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
}; 