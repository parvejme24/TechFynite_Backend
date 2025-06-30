const user = [
  {
    displayName: String,
    email: String,
    password: String,
    photoUrl: String,
    designation: String,
    role: String,
    phone: String,
    country: String,
    city: String,
    state_region: String,
    postCode: String,
    balance: Float32Array,
    purchases: [],
  },
];

const templateCategory = [
  {
    title: String,
    image_url: String,
    templates: Number,
    slug: String,
  },
];

const template = [
  {
    title: String,
    price: Float32Array,
    image_url: String,
    category: String,
    version: Float32Array,
    publishedDate: Date,
    downloades: Number,
    pages: Number,
    views: Number,
    totalPurchase: Number,
    previewLink: String,
    shortDescription: String,
    description: String,
    whatsIncluded: [],
    keyFeatures: [
      {
        title: String,
        description: String,
      },
    ],
    screenshots: [],
  },
];

const blogCategory = [
  {
    title: String,
    image_url: String,
    blogs: Number,
    slug: String,
  },
];

const blog = [
  {
    title: String,
    category: String,
    image_url: String,
    description: String,
    likes: Number,
    readingTime: Float32Array,
    authorId: String,
    content: [
      {
        title: String,
        image_url: String,
        description: String,
      },
    ],
    reviews: [
      {
        userName: String,
        commentDate: Date,
        photoUrl: String,
        commentText: String,
        reply: {
          authorName: String,
          replyDate: Date,
          photoUrl: String,
          replyText: String,
          isAdmin: Boolean,
        },
      },
    ],
  },
];

const orderInvoice = [
  {
    orderId: String, // Unique identifier for the order
    userId: String, // Unique identifier for the user/customer
    templateId: String, // Unique identifier for the template
    templateName: String, // Name of the template
    templateThumbnail: String, // URL or path to the template thumbnail
    templatePrice: Number, // Price of the template (using Number for simplicity)
    totalPrice: Number, // Total price including any additional fees
    paymentMethod: String, // Payment method (e.g., "Credit Card", "PayPal")
    paymentStatus: String, // Payment status (e.g., "Pending", "Completed", "Failed")
    transactionId: String, // Unique identifier for the payment transaction
    status: String, // Order status (e.g., "Pending", "Confirmed", "Delivered")
    isDelivered: Boolean, // Whether the template has been delivered
    deliveryMethod: String, // Delivery method (e.g., "Download", "Email")
    deliveryUrl: String, // URL for downloading the template (if applicable)
    invoiceNumber: String, // Unique identifier for the invoice
    invoiceDate: Date, // Date when the invoice was generated
    userEmail: String, // User's email for sending the invoice
  },
];
