# Contact Management System

## Overview
Complete contact management system with different access levels for public users, authenticated users, and administrators.

## Access Levels

### 1. Public Access (No Authentication Required)
- **Add New Contact**: Anyone can submit a contact form

### 2. User Access (Requires User Account)
- **Get User Contacts**: View all contacts submitted by the logged-in user
- **Get Contact by ID**: View specific contact (only if user owns it)
- **Delete Contact**: Delete contact (only if user owns it)

### 3. Admin/Super Admin Access
- **Get All Contacts**: View all contacts in the system
- **Get Contact by ID**: View any contact by ID
- **Change Status**: Update contact status
- **Send Reply**: Send email reply to contact
- **Resend Notification**: Resend contact notification

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contacts` | Add new contact (anyone can submit) |

### User Endpoints (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts/user` | Get all contacts for logged-in user |
| GET | `/contacts/:id` | Get specific contact (if user owns it) |
| DELETE | `/contacts/:id` | Delete contact (if user owns it) |

### Admin/Super Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all contacts |
| GET | `/contacts/:id` | Get any contact by ID |
| PATCH | `/contacts/:id/status` | Change contact status |
| POST | `/contacts/:id/reply` | Send email reply |
| POST | `/contacts/:id/resend` | Resend notification |

## Detailed Functionality

### 1. Add New Contact
**Endpoint:** `POST /contacts`

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "projectDetails": "Website development project",
  "budget": "$5000",
  "fullName": "John Doe",
  "email": "john@example.com",
  "companyName": "Tech Corp",
  "serviceRequred": "Web Development"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "contact_id",
    "projectDetails": "Website development project",
    "budget": "$5000",
    "fullName": "John Doe",
    "email": "john@example.com",
    "companyName": "Tech Corp",
    "serviceRequred": "Web Development",
    "userId": "user_id", // null if no user account
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Features:**
- Anyone can submit (with or without user account)
- If user is logged in, contact is linked to their account
- If no user account, contact is stored without user association

### 2. Get All Contacts (Admin/Super Admin)
**Endpoint:** `GET /contacts`

**Access:** Admin/Super Admin only

**Query Parameters:**
- `keyword` - Search by name, email, or company
- `fromDate` - Filter from date
- `toDate` - Filter to date
- `serviceRequred` - Filter by service type
- `page` - Page number for pagination
- `pageSize` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "contact_id",
      "projectDetails": "Website development",
      "budget": "$5000",
      "fullName": "John Doe",
      "email": "john@example.com",
      "companyName": "Tech Corp",
      "serviceRequred": "Web Development",
      "userId": "user_id",
      "status": "Pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get User Contacts
**Endpoint:** `GET /contacts/user`

**Access:** Authenticated users only

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "contact_id",
      "projectDetails": "Website development",
      "budget": "$5000",
      "fullName": "John Doe",
      "email": "john@example.com",
      "companyName": "Tech Corp",
      "serviceRequred": "Web Development",
      "userId": "user_id",
      "status": "Pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Features:**
- Only shows contacts submitted by the logged-in user
- Requires user account (returns 401 if not authenticated)

### 4. Get Contact by ID
**Endpoint:** `GET /contacts/:id`

**Access:** 
- Admin/Super Admin: Can access any contact
- User: Can only access their own contacts

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact_id",
    "projectDetails": "Website development",
    "budget": "$5000",
    "fullName": "John Doe",
    "email": "john@example.com",
    "companyName": "Tech Corp",
    "serviceRequred": "Web Development",
    "userId": "user_id",
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Contact
**Endpoint:** `DELETE /contacts/:id`

**Access:** Users can only delete their own contacts

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Features:**
- Only the user who submitted the contact can delete it
- Admins cannot delete contacts (only users can)
- Returns 403 if user doesn't own the contact

### 6. Change Contact Status
**Endpoint:** `PATCH /contacts/:id/status`

**Access:** Admin/Super Admin only

**Request Body:**
```json
{
  "status": "Replied"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "id": "contact_id",
    "status": "Replied",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Available Statuses:**
- `Pending` - Initial status
- `Replied` - Admin has replied
- `Completed` - Contact resolved
- `Cancelled` - Contact cancelled

### 7. Send Email Reply
**Endpoint:** `POST /contacts/:id/reply`

**Access:** Admin/Super Admin only

**Request Body:**
```json
{
  "subject": "Re: Project Inquiry",
  "message": "Thank you for your inquiry. We will get back to you soon.",
  "replyTo": "admin@techfynite.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply email sent successfully"
}
```

**Features:**
- Sends email to the contact's email address
- Includes original contact details in the email
- Automatically updates contact status to "Replied"
- Optional custom reply-to email address

### 8. Resend Contact Notification
**Endpoint:** `POST /contacts/:id/resend`

**Access:** Admin/Super Admin only

**Response:**
```json
{
  "success": true,
  "message": "Contact notification resent successfully"
}
```

**Features:**
- Resends notification email to admin
- Useful when admin needs to be reminded about a contact

## Frontend Integration Examples

### Add New Contact (Public)
```javascript
const addNewContact = async (contactData) => {
  const response = await fetch('/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });
  
  const result = await response.json();
  return result;
};
```

### Get User Contacts (Authenticated)
```javascript
const getUserContacts = async () => {
  const response = await fetch('/contacts/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const { data } = await response.json();
  return data;
};
```

### Get All Contacts (Admin)
```javascript
const getAllContacts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/contacts?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const { data } = await response.json();
  return data;
};
```

### Send Reply (Admin)
```javascript
const sendReply = async (contactId, subject, message) => {
  const response = await fetch(`/contacts/${contactId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      subject,
      message,
      replyTo: 'admin@techfynite.com'
    })
  });
  
  const result = await response.json();
  return result;
};
```

### Delete Contact (User)
```javascript
const deleteContact = async (contactId) => {
  const response = await fetch(`/contacts/${contactId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const result = await response.json();
  return result;
};
```

## Security Features

1. **Role-based Access Control:**
   - Public access for contact submission
   - User access for their own contacts
   - Admin access for all contacts and management

2. **Data Isolation:**
   - Users can only see and manage their own contacts
   - Admins can see and manage all contacts

3. **Input Validation:**
   - Required fields validation
   - Email format validation
   - Contact ownership verification

4. **Email Security:**
   - Custom reply-to address support
   - Original contact details included in replies
   - Status tracking for contact management

## Environment Variables

Add these to your `.env` file:
```
CONTACT_REPLY_EMAIL=noreply@techfynite.com
CONTACT_NOTIFY_EMAIL=admin@techfynite.com
```

## Benefits

1. **Flexible Access:** Public submission with optional user account linking
2. **User Control:** Users can manage their own contacts
3. **Admin Management:** Complete control for administrators
4. **Email Integration:** Built-in email reply system
5. **Status Tracking:** Comprehensive contact status management
6. **Security:** Proper authentication and authorization 