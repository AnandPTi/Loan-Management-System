

# Loan Management System

This Loan Management System is a Node.js and Express-based application that enables the management and tracking of loans. The system includes role-based access control with different functionalities for users, verifiers, and administrators. Built with TypeScript and Express, it ensures secure handling of loan applications, user roles, and access privileges.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [License](#license)

## Features

- **User Registration & Authentication**: Secure JWT-based authentication for users.
- **Role-Based Access Control**: Separate roles for users, verifiers, and admins, each with specific permissions.
- **Loan Management**: Users can apply for loans, verifiers can verify assigned loans, and admins can oversee all loan operations.
- **Verifier Assignment**: Admins can assign loans to verifiers for handling.
- **Loan Status Updates**: Loans can be updated based on the verification status.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AnandPTi/Loan-Management-System.git
   cd Loan-Management-System
   ```

2. **Navigate to Backend Folder**:
   ```bash
   cd backend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Variables**:
   Modify following variables:
   ```env
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_url
   ```

5. **Start the Server**:
   ```bash
   npm run dev
   ```
6. **Navigate to Frontend Folder**:
   ```bash
   cd credit-app-frontend
   ```

7. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Start the Server**:
   ```bash
   npm run dev
   ```
## Usage

1. Register as a user or log in using provided credentials.
2. Admins can create verifier accounts, assign loans, and manage user roles.
3. Verifiers can view and update the status of assigned loans.
4. Users can apply for loans and track the status of their applications.

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/api/auth/register` - Register a new user.
  - **Request Body**:
    ```json
    {
    "email": "user3@example1.com",
    "password": "Password123!",
    "name": "Jolly Doe",
    "phone": "1234567890",
    "address": "12 Pink St, City"
    }
    ```

- **POST** `/api/auth/login` - Login with existing credentials.
  - **Request Body**:
    ```json
    {
      "username": "email id",
      "password": "string"
    }
    ```

### Loan Routes (`/api/loans`)

- **POST** `/api/loans/apply` - Apply for a loan (User only).
  - **Request Body**:
    ```json
    {
    "fullName": "John Doe",
    "amount": 50000,
    "tenure": 12,
    "employmentStatus": "employed",
    "reason": "Home renovation",
    "employmentAddress1": "456 Work Street",
    "employmentAddress2": "Suite 100",
    "termsAccepted": true,
    "creditInfoDisclosure": true
    }
    ```

- **GET** `/api/loans/user-loans` - View all loans for the authenticated user (User only).

- **PATCH** `/api/loans/:loanId/status` - Update loan status (Admin only).
  - **Request Params**:
    - `loanId`: ID of the loan.
  - **Request Body**:
    ```json
    {
      "status": "string" // Status options: "pending", "approved", "verified", "rejected"
    }
    ```

### Admin Routes (`/api/admin`)

- **POST** `/api/admin/verifier` - Create a new verifier account (Admin only).
  - **Request Body**:
    ```json
    {
        "email": "verifier@example.com",
        "name": "Jane Smith",
        "phone": "9876543210",
        "address": "789 Verify St, City",
        "password": "$2b$10$Wm4XfGZaYdlyIZNhkEJKUujzcfKhUJZb7J.LhOZe2ZRZESQF7DMoi",
        "role": "verifier",
    }
    ```

- **DELETE** `/api/admin/user/:userId` - Delete a user by ID (Admin only).

- **GET** `/api/admin/loans` - Retrieve all loans (Admin only).

- **POST** `/api/admin/loans/assign-verifier` - Assign a verifier to a loan.
  - **Request Body**:
    ```json
    {
      "loanId": "string",
      "verifierId": "string"
    }
    ```

- **GET** `/api/admin/users` - Retrieve all registered users.

### Verifier Routes (`/api/verifier`)

- **GET** `/api/verifier/loans` - View all loans assigned to the authenticated verifier.

- **PATCH** `/api/verifier/loans/:loanId/status` - Update the status of an assigned loan (Verifier only).
  - **Request Params**:
    - `loanId`: ID of the loan to update.
  - **Request Body**:
    ```json
    {
      "status": "string" // Status options: "approved", "rejected"
    }
    ```

## Overview

The frontend of the Creditsea project is built with React and is responsible for providing an interactive user interface for loan verifiers. The Verifier Dashboard allows users to view assigned loans, update loan statuses, and interact with the application securely. 

### Tech Stack

- **React**: Core library for building the user interface.
- **Context API**: Used for handling authentication and user data.
- **CSS** (with Tailwind or other framework, if applicable): For styling and responsive design.

### Features

- **Dashboard**: Displays a list of loans assigned to verifiers with details such as applicant information, loan amount, employment status, and loan status.
- **Loan Status Update**: Allows verifiers to update the status of a loan (approve or reject).
- **API Integration**: Connects to the backend API to fetch and update loan information.
  
## License

This project is licensed under the MIT License.