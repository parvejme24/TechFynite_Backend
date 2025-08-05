import mailchimp from "@mailchimp/mailchimp_marketing";
import axios from 'axios';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us18", // The last part of your API key
});

// TypeScript interfaces for Mailchimp API responses
interface MailchimpSubscriber {
  id: string;
  email_address: string;
  status: string;
  merge_fields: {
    FNAME?: string;
    LNAME?: string;
    AVATAR_URL?: string;
  };
  timestamp_opt: string;
  last_changed: string;
}

interface MailchimpListResponse {
  members: MailchimpSubscriber[];
  total_items: number;
}

interface SubscriberData {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  status: string;
  subscribedAt: string;
  lastChanged: string;
}

export const NewsletterService = {
  // Database-based newsletter subscription
  subscribeToDatabase: async (email: string) => {
    try {
      // Check if email already exists
      const existingSubscriber = await prisma.newsletter.findUnique({
        where: { email }
      });

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          throw new Error("Email already subscribed to newsletter");
        } else {
          // Reactivate subscription
          await prisma.newsletter.update({
            where: { email },
            data: { isActive: true }
          });
          return { message: "Subscription reactivated successfully" };
        }
      }

      // Create new subscription
      await prisma.newsletter.create({
        data: {
          email,
          isActive: true
        }
      });

      return { message: "Subscribed successfully" };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error("Email already subscribed to newsletter");
      }
      throw new Error("Database error: " + error.message);
    }
  },

  // Get all subscribers from database
  getAllSubscribersFromDatabase: async () => {
    try {
      const subscribers = await prisma.newsletter.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      return subscribers.map(subscriber => ({
        id: subscriber.id,
        email: subscriber.email,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.createdAt,
        lastChanged: subscriber.updatedAt
      }));
    } catch (error: any) {
      throw new Error("Failed to fetch subscribers: " + error.message);
    }
  },

  // Get subscriber count from database
  getSubscriberCountFromDatabase: async () => {
    try {
      const total = await prisma.newsletter.count();
      const active = await prisma.newsletter.count({
        where: { isActive: true }
      });
      const inactive = total - active;

      return {
        total,
        subscribed: active,
        unsubscribed: inactive
      };
    } catch (error: any) {
      throw new Error("Failed to fetch subscriber count: " + error.message);
    }
  },

  // Unsubscribe from database
  unsubscribeFromDatabase: async (email: string) => {
    try {
      const subscriber = await prisma.newsletter.findUnique({
        where: { email }
      });

      if (!subscriber) {
        throw new Error("Email not found in newsletter subscribers");
      }

      if (!subscriber.isActive) {
        throw new Error("Email is already unsubscribed");
      }

      await prisma.newsletter.update({
        where: { email },
        data: { isActive: false }
      });

      return { message: "Unsubscribed successfully" };
    } catch (error: any) {
      throw new Error("Failed to unsubscribe: " + error.message);
    }
  },

  // Original Mailchimp-based methods
  subscribe: async (email: string) => {
    try {
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
        email_address: email,
        status: "subscribed",
      });
    } catch (e: any) {
      if (e.response && e.response.body && e.response.body.title === "Member Exists") {
        throw new Error("Email already subscribed to Mailchimp");
      }
      throw new Error("Mailchimp error: " + e.message);
    }
  },

  getAllSubscribers: async () => {
    try {
      const response = await mailchimp.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID!);
      if ('members' in response) {
        return response.members.map((member: any) => ({
          id: member.id,
          email: member.email_address,
          status: member.status,
          subscribedAt: member.timestamp_opt,
          lastChanged: member.last_changed,
          firstName: member.merge_fields?.FNAME || '',
          lastName: member.merge_fields?.LNAME || ''
        }));
      }
      throw new Error("Failed to fetch subscribers");
    } catch (e: any) {
      throw new Error("Failed to fetch subscribers: " + e.message);
    }
  },

  getSubscriberCount: async () => {
    try {
      const response = await mailchimp.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID!);
      if ('members' in response) {
        return {
          total: response.members.length,
          subscribed: response.members.filter((m: any) => m.status === 'subscribed').length,
          unsubscribed: response.members.filter((m: any) => m.status === 'unsubscribed').length
        };
      }
      throw new Error("Failed to fetch subscriber count");
    } catch (e: any) {
      throw new Error("Failed to fetch subscriber count: " + e.message);
    }
  },

  // New method using Axios to fetch subscribers with name, email, and avatar_url
  fetchSubscribersWithAxios: async (): Promise<SubscriberData[]> => {
    try {
      // Validate environment variables
      const apiKey = process.env.MAILCHIMP_API_KEY;
      const listId = process.env.MAILCHIMP_AUDIENCE_ID;
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us18';

      if (!apiKey) {
        throw new Error('MAILCHIMP_API_KEY environment variable is required');
      }
      if (!listId) {
        throw new Error('MAILCHIMP_AUDIENCE_ID environment variable is required');
      }

      // Construct the Mailchimp API URL
      const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
      const url = `${baseUrl}/lists/${listId}/members`;

      // Make the API request with authentication
      const response = await axios.get<MailchimpListResponse>(url, {
        auth: {
          username: 'anystring', // Mailchimp API uses username as 'anystring'
          password: apiKey
        },
        params: {
          count: 1000, // Maximum count per request
          status: 'subscribed' // Only get subscribed members
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Transform the response to extract required fields
      const subscribers: SubscriberData[] = response.data.members.map(member => {
        const firstName = member.merge_fields?.FNAME || '';
        const lastName = member.merge_fields?.LNAME || '';
        const name = `${firstName} ${lastName}`.trim() || 'Anonymous';
        const avatarUrl = member.merge_fields?.AVATAR_URL || '';

        return {
          id: member.id,
          email: member.email_address,
          name: name,
          avatar_url: avatarUrl,
          status: member.status,
          subscribedAt: member.timestamp_opt,
          lastChanged: member.last_changed
        };
      });

      return subscribers;

    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Invalid Mailchimp API key');
        } else if (error.response.status === 404) {
          throw new Error('Mailchimp audience list not found');
        } else {
          throw new Error(`Mailchimp API error: ${error.response.data?.detail || error.message}`);
        }
      }
      throw new Error(`Failed to fetch subscribers: ${error.message}`);
    }
  }
}; 