# Project Name: Carepress Backend

## Description

**Carepress Backend** is a robust backend system for a bike rental reservation platform. It efficiently handles user registrations, bike availability, and booking management, providing a seamless experience for both users and administrators.

## Live Data Server Link

[https://carepress-backend.vercel.app/](https://carepress-backend.vercel.app/)

### Admin Email

- **Email**: admin@gmail.com

### Admin Password

- **Password**: password123

## Getting Started: How to Run the Application Locally

### Step 1: Download

Clone or download this repository.

### Step 2: Install

1. Open this repository in VS Code.
2. Open the terminal and run the following command:

   ```bash
   npm install
   # or
   yarn install
   ```

   Step 3: Setup .env File
   1.Create a .env file in the root directory.
   2.Setup the following variables in the .env file:

# Environment Variables

```bash
# Port for the application
PORT=5000

# MongoDB connection string (replace with your actual MongoDB connection URI)
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.qh4qhby.mongodb.net/

# Database name
DATABASE_NAME=carepress-pets-care

# Bcrypt salt rounds
SALT_ROUNDS=12

# Node environment (development or production)
NODE_ENV=development

# JWT secret for access token
JWT_ACCESS_SECRET=<your_jwt_access_secret>

# Payment intent key (replace with your actual Stripe key)
PAYMENT_INTENT=<your_stripe_payment_intent_key>

# Cloudinary Credentials (replace with your actual credentials)
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

```
