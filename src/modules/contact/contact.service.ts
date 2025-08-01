import { PrismaClient } from '../../generated/prisma';
import { ContactFormRequest, ContactForm, UpdateContactStatusRequest, ReplyEmailRequest } from './contact.types';
import { sendEmail } from '../auth/auth.utils';

const prisma = new PrismaClient();

export class ContactService {
  static async create(data: ContactFormRequest, userId?: string): Promise<ContactForm> {
    try {
      const contact = await prisma.contact.create({
        data: {
          projectDetails: data.projectDetails,
          budget: data.budget,
          fullName: data.fullName,
          email: data.email,
          companyName: data.companyName,
          serviceRequred: data.serviceRequred,
          userId: userId,
        },
      });

      // Optionally send an email notification to admin
      try {
        await sendEmail(
          process.env.CONTACT_NOTIFY_EMAIL || 'parvej@techfynite.com',
          'New Contact Form Submission',
          `New contact form submitted by ${data.fullName} (${data.email})\n\nProject Details: ${data.projectDetails}\nBudget: ${data.budget}\nCompany: ${data.companyName}\nService: ${data.serviceRequred}`
        );
      } catch (e) {
        // Log but don't fail the request
        console.error('Failed to send contact notification email:', e);
      }

      return contact as ContactForm;
    } catch (error) {
      throw new Error(`Failed to create contact: ${error}`);
    }
  }

  static async getAll(options?: {
    keyword?: string;
    fromDate?: string;
    toDate?: string;
    serviceRequred?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: ContactForm[]; total: number }> {
    try {
      const page = options?.page && options.page > 0 ? options.page : 1;
      const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 9;
      const skip = (page - 1) * pageSize;

      // Build where clause for filtering
      const where: any = {};

      if (options?.serviceRequred) {
        where.serviceRequred = options.serviceRequred;
      }

      if (options?.fromDate || options?.toDate) {
        where.createdAt = {};
        if (options.fromDate) {
          where.createdAt.gte = new Date(options.fromDate);
        }
        if (options.toDate) {
          where.createdAt.lte = new Date(options.toDate);
        }
      }

      // Get total count
      const total = await prisma.contact.count({ where });

      // Get contacts with pagination
      let contacts = await prisma.contact.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true,
                  role: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      // Apply keyword search if provided
      if (options?.keyword) {
        const keyword = options.keyword.toLowerCase();
        contacts = contacts.filter(c =>
          c.projectDetails.toLowerCase().includes(keyword) ||
          c.budget.toLowerCase().includes(keyword) ||
          c.fullName.toLowerCase().includes(keyword) ||
          c.email.toLowerCase().includes(keyword) ||
          c.companyName.toLowerCase().includes(keyword) ||
          c.serviceRequred.toLowerCase().includes(keyword)
        );
      }

      return {
        data: contacts as ContactForm[],
        total: options?.keyword ? contacts.length : total
      };
    } catch (error) {
      throw new Error(`Failed to fetch contacts: ${error}`);
    }
  }

  static async getById(id: string): Promise<ContactForm | null> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id },
        include: {
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true,
                  role: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return contact as ContactForm | null;
    } catch (error) {
      throw new Error(`Failed to fetch contact: ${error}`);
    }
  }

  static async updateStatus(id: string, data: UpdateContactStatusRequest): Promise<ContactForm> {
    try {
      const contact = await prisma.contact.update({
        where: { id },
        data: {
          status: data.status as any,
        },
      });
      return contact as ContactForm;
    } catch (error) {
      throw new Error(`Failed to update contact status: ${error}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.contact.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete contact: ${error}`);
    }
  }

  static async contactExists(id: string): Promise<boolean> {
    try {
      const count = await prisma.contact.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check contact existence: ${error}`);
    }
  }

  static async getContactsByIds(ids: string[]): Promise<ContactForm[]> {
    try {
      const contacts = await prisma.contact.findMany({
        where: { id: { in: ids } },
        include: {
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true,
                  role: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return contacts as ContactForm[];
    } catch (error) {
      throw new Error(`Failed to fetch contacts by IDs: ${error}`);
    }
  }

  static async getByUserId(userId: string): Promise<ContactForm[]> {
    try {
      const contacts = await prisma.contact.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true,
                  role: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return contacts as ContactForm[];
    } catch (error) {
      throw new Error(`Failed to fetch user contacts: ${error}`);
    }
  }

  static async update(id: string, data: any): Promise<ContactForm> {
    try {
      const contact = await prisma.contact.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return contact as ContactForm;
    } catch (error) {
      throw new Error(`Failed to update contact: ${error}`);
    }
  }

  // ContactReply functionality
  static async addReply(contactId: string, userId: string, subject: string, message: string): Promise<any> {
    try {
      const reply = await prisma.contactReply.create({
        data: {
          contactId,
          userId,
          subject,
          message,
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              role: true
            }
          }
        }
      });
      return reply;
    } catch (error) {
      throw new Error(`Failed to add reply: ${error}`);
    }
  }

  static async getReplies(contactId: string): Promise<any[]> {
    try {
      const replies = await prisma.contactReply.findMany({
        where: { contactId },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return replies;
    } catch (error) {
      throw new Error(`Failed to fetch replies: ${error}`);
    }
  }

  static async deleteReply(replyId: string): Promise<boolean> {
    try {
      await prisma.contactReply.delete({
        where: { id: replyId },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete reply: ${error}`);
    }
  }
} 