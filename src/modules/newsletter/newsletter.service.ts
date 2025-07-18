import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us18", // The last part of your API key
});

export const NewsletterService = {
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
}; 