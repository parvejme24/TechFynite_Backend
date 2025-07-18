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
  createdAt: Date;
} 