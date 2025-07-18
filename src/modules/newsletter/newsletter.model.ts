import { PrismaClient, Newsletter } from '../../generated/prisma';

const prisma = new PrismaClient();

export const NewsletterModel = {
  create: async (email: string): Promise<Newsletter> => {
    return prisma.newsletter.create({ data: { email } });
  },
  findByEmail: async (email: string): Promise<Newsletter | null> => {
    return prisma.newsletter.findUnique({ where: { email } });
  },
}; 