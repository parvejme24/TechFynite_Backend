# Auth Module API Documentation

## Base URL
`/api/auth`

---

### Register
- **Request:** `POST /api/auth/register`
- **Description:** User registration. Sends a verification OTP to the user's email.
- **Example Request Body:**
  ```json
  {
    "displayName": "John Doe",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

---

### Login
- **Request:** `POST /api/auth/login`
- **Description:** User login. Returns a JWT token and user details.
- **Example Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

---

### Verify OTP
- **Request:** `POST /api/auth/verify-otp`
- **Description:** Verifies the OTP sent to the user's email after registration.
- **Example Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```

---

### Refresh Token
- **Request:** `POST /api/auth/refresh-token`
- **Description:** Refreshes an expired JWT token using a refresh token sent via cookies.
- **Example Request Body:**
  *Requires `refreshToken` to be sent in cookies.*
  ```json
  {}
  ```

---

### Request Password Reset
- **Request:** `POST /api/auth/reset-password-request`
- **Description:** Sends an OTP to the user's email to initiate a password reset.
- **Example Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

---

### Reset Password
- **Request:** `POST /api/auth/reset-password`
- **Description:** Resets the user's password using the provided OTP.
- **Example Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newsecurepassword"
  }
  ```
  
---

### Logout
- **Request:** `POST /api/auth/logout`
- **Description:** User logout. Invalidates the user's refresh token.

---

## Example Success Response (for Login/Register)
```json
{
  "user": {
    "id": "user-id",
    "displayName": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "accessToken": "<jwt_access_token>"
}
```

---
[Back to main API documentation](../../README.md) 