"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const mailchimp_marketing_1 = __importDefault(require("@mailchimp/mailchimp_marketing"));
const axios_1 = __importDefault(require("axios"));
mailchimp_marketing_1.default.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us18", // The last part of your API key
});
exports.NewsletterService = {
    subscribe: async (email) => {
        try {
            await mailchimp_marketing_1.default.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
                email_address: email,
                status: "subscribed",
            });
        }
        catch (e) {
            if (e.response && e.response.body && e.response.body.title === "Member Exists") {
                throw new Error("Email already subscribed to Mailchimp");
            }
            throw new Error("Mailchimp error: " + e.message);
        }
    },
    getAllSubscribers: async () => {
        try {
            const response = await mailchimp_marketing_1.default.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID);
            if ('members' in response) {
                return response.members.map((member) => ({
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
        }
        catch (e) {
            throw new Error("Failed to fetch subscribers: " + e.message);
        }
    },
    getSubscriberCount: async () => {
        try {
            const response = await mailchimp_marketing_1.default.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID);
            if ('members' in response) {
                return {
                    total: response.members.length,
                    subscribed: response.members.filter((m) => m.status === 'subscribed').length,
                    unsubscribed: response.members.filter((m) => m.status === 'unsubscribed').length
                };
            }
            throw new Error("Failed to fetch subscriber count");
        }
        catch (e) {
            throw new Error("Failed to fetch subscriber count: " + e.message);
        }
    },
    // New method using Axios to fetch subscribers with name, email, and avatar_url
    fetchSubscribersWithAxios: async () => {
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
            const response = await axios_1.default.get(url, {
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
            const subscribers = response.data.members.map(member => {
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
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('Invalid Mailchimp API key');
                }
                else if (error.response.status === 404) {
                    throw new Error('Mailchimp audience list not found');
                }
                else {
                    throw new Error(`Mailchimp API error: ${error.response.data?.detail || error.message}`);
                }
            }
            throw new Error(`Failed to fetch subscribers: ${error.message}`);
        }
    }
};
