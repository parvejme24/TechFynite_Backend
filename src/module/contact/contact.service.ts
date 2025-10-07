import { PrismaClient } from "@prisma/client";
import { IContactService } from "./contact.interface";
import {
  Contact,
  ContactReply,
  ContactStats,
  PaginatedContacts,
} from "./contact.type";

const prisma = new PrismaClient();

export class ContactService implements IContactService {
  // Add new contact
  async addNewContact(data: {
    projectDetails: string;
    budget: string;
    fullName: string;
    email: string;
    companyName: string;
    serviceRequired: string;
    userId?: string;
  }): Promise<Contact> {
    const contact = await prisma.contact.create({
      data: {
        projectDetails: data.projectDetails,
        budget: data.budget,
        fullName: data.fullName,
        email: data.email,
        companyName: data.companyName,
        serviceRequired: data.serviceRequired,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return contact;
  }

  // Get all contacts with pagination and filtering
  async getAllContacts(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<PaginatedContacts> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" as any } },
        { email: { contains: search, mode: "insensitive" as any } },
        { companyName: { contains: search, mode: "insensitive" as any } },
        { serviceRequired: { contains: search, mode: "insensitive" as any } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              profile: {
                select: {
                  avatarUrl: true,
                },
              },
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  role: true,
                  profile: {
                    select: {
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contact.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get contact by ID
  async getContactById(id: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return contact;
  }

  // Get user's contacts
  async getUserContacts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedContacts> {
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              profile: {
                select: {
                  avatarUrl: true,
                },
              },
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  role: true,
                  profile: {
                    select: {
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contact.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get contacts by user email
  async getContactsByUserEmail(
    userEmail: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedContacts> {
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: { email: userEmail },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              profile: {
                select: {
                  avatarUrl: true,
                },
              },
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  role: true,
                  profile: {
                    select: {
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contact.count({ where: { email: userEmail } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Delete contact
  async deleteContact(
    id: string,
    userId?: string,
    userRole?: string
  ): Promise<{ success: boolean; message: string }> {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return {
        success: false,
        message: "Contact not found",
      };
    }

    // Super admin can delete any contact
    if (userRole === "ADMIN") {
      await prisma.contact.delete({
        where: { id },
      });
      return {
        success: true,
        message: "Contact deleted successfully",
      };
    }

    // Regular users can only delete their own contacts
    if (userId && contact.userId !== userId) {
      return {
        success: false,
        message: "You don't have permission to delete this contact",
      };
    }

    await prisma.contact.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Contact deleted successfully",
    };
  }

  // Send contact reply
  async sendContactReply(
    contactId: string,
    userId: string,
    data: {
      subject: string;
      message: string;
    }
  ): Promise<ContactReply> {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    const reply = await prisma.contactReply.create({
      data: {
        subject: data.subject,
        message: data.message,
        contactId,
        userId,
      },
      include: {
        contact: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return reply;
  }

  // Get contact replies
  async getContactReplies(contactId: string): Promise<ContactReply[]> {
    const replies = await prisma.contactReply.findMany({
      where: { contactId },
      include: {
        contact: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return replies;
  }

  // Get contact statistics
  async getContactStats(
    period: string = "monthly",
    startDate?: string,
    endDate?: string
  ): Promise<ContactStats> {
    const now = new Date();

    // Compute date window
    let windowStart: Date | undefined;
    let windowEnd: Date | undefined;

    if (startDate && endDate) {
      windowStart = new Date(startDate);
      windowEnd = new Date(endDate);
    } else {
      switch (period) {
        case "daily": {
          const dayStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          windowStart = dayStart;
          windowEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
          break;
        }
        case "weekly": {
          const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          windowStart = weekStart;
          break;
        }
        case "yearly": {
          const yearStart = new Date(now.getFullYear(), 0, 1);
          windowStart = yearStart;
          break;
        }
        case "monthly":
        default: {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          windowStart = monthStart;
          break;
        }
      }
    }

    const dateFilter: any = windowStart
      ? { gte: windowStart, ...(windowEnd ? { lt: windowEnd } : {}) }
      : {};

    const [
      totalContacts,
      periodContacts,
      recentContacts,
      prevPeriodCount,
      currentPeriodCount,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { createdAt: dateFilter } }),
      prisma.contact.findMany({
        take: 10,
        include: {
          user: { 
            select: { 
              id: true, 
              fullName: true, 
              email: true, 
              role: true,
              profile: {
                select: {
                  avatarUrl: true,
                },
              },
            } 
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000),
            lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const growthRate =
      prevPeriodCount > 0
        ? Math.round(
            ((currentPeriodCount - prevPeriodCount) / prevPeriodCount) * 10000
          ) / 100
        : 0;

    // Grouped data for charts (by day for daily/weekly/monthly, by month for yearly)
    const groupByFormat = period === "yearly" ? "YYYY-MM" : "YYYY-MM-DD";

    const grouped = await prisma.$queryRawUnsafe<
      { period: string; count: number }[]
    >(
      period === "yearly"
        ? `
          SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as period,
                 COUNT(*)::int as count
          FROM contacts
          ${windowStart ? `WHERE "createdAt" >= $1` : ""}
          ${windowEnd ? ` AND "createdAt" < $2` : ""}
          GROUP BY 1
          ORDER BY 1 ASC
        `
        : `
          SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as period,
                 COUNT(*)::int as count
          FROM contacts
          ${windowStart ? `WHERE "createdAt" >= $1` : ""}
          ${windowEnd ? ` AND "createdAt" < $2` : ""}
          GROUP BY 1
          ORDER BY 1 ASC
        `,
      ...(windowStart && windowEnd
        ? [windowStart, windowEnd]
        : windowStart
        ? [windowStart]
        : [])
    );

    return {
      totalContacts,
      pendingContacts: 0,
      inProgressContacts: 0,
      completedContacts: 0,
      monthlyGrowth: growthRate,
      // Augment type to carry chart-friendly array
      // @ts-ignore
      periodData: grouped,
    } as unknown as ContactStats;
  }
}
