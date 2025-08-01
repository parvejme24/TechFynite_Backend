export interface ContactFormRequest {
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequred: string;
}

export interface ContactForm extends ContactFormRequest {
  id: string;
  userId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: ContactReply[];
}

export interface UpdateContactStatusRequest {
  status: string;
}

export interface UpdateContactRequest {
  projectDetails?: string;
  budget?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  serviceRequred?: string;
}

export interface ReplyEmailRequest {
  subject: string;
  message: string;
  replyTo?: string;
}

export interface ContactReply {
  id: string;
  subject: string;
  message: string;
  contactId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    displayName: string;
    email: string;
    role: string;
  };
}

export interface AddReplyRequest {
  subject: string;
  message: string;
} 