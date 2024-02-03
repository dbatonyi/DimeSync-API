# DimeSync API

DimeSync API is a financial application (savings app) developed using Nest.js. It provides a platform for users to manage their finances, create personalized financial tables, track incomes and expenses, and view statistics for each month and year.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Authentication](#authentication)
6. [Endpoints](#endpoints)
7. [Logging](#logging)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- User registration with email verification.
- User authentication and authorization.
- Creation, update, and deletion of financial tables.
- Monthly and yearly financial statistics.
- Automated daily database clearing using cron jobs.

## Tech Stack

- **Nest.js**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A superset of JavaScript that adds static typing to the language.
- **PostgreSQL**: An SQL database for storing user and financial data.
- **JWT (JSON Web Tokens)**: Used for secure authentication.
- **Cron Jobs**: Implemented for daily database clearing.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dbatonyi/DimeSync-API
   cd DimeSync-API
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file and configure the following:

   ```env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   FRONTEND_URL=http://your-verification-api
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=1h
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   VERIFICATION_TOKEN_SECRET=your_secret_key
   ```

4. Run the application:

```bash
npm run start
```

The API will be accessible at `http://localhost:3000`.

## Usage

Access the API using Swagger documentation at `http://localhost:3000/api`.

## Authentication

- **Registration**: Users can register using the `/register` endpoint. A verification email will be sent for account validation.

- **Login**: After registration, users can log in using the `/login` endpoint. The API will check for authentication on subsequent requests.

## Endpoints

### Authentication

- **User Registration**:

  - **Endpoint**: `/auth/register`
  - **Method**: `POST`
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
  - **Response**: Returns the registered user details.

- **User Login**:

  - **Endpoint**: `/auth/login`
  - **Method**: `POST`
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
  - **Response**: Returns a JWT token for authentication.

- **Check Authentication**:

  - **Endpoint**: `/auth/check-auth`
  - **Method**: `GET`
  - **Headers**:
    ```
    Authorization: Bearer <JWT Token>
    ```
  - **Response**: Returns a message indicating whether the user is authenticated and user details.

- **Verify Email**:
  - **Endpoint**: `/auth/verify/:token`
  - **Method**: `GET`
  - **Params**:
    ```
    token: <verification_token>
    ```
  - **Response**: Returns a message indicating the result of the email verification.

### Financial Table

- - **Create Financial Entry**:
  - **Endpoint**: `/financial-table/create`
  - **Method**: `POST`
  - **Headers**:
    ```
    Authorization: Bearer <JWT Token>
    ```
  - **Request Body**:
    ```json
    {
      "user_id": 1,
      "financial_table_name": "New Financial Entry",
      "weight": 1,
      "currency": "USD",
      "status": 1
    }
    ```
    - `user_id` (Required): User ID for whom the financial entry is created.
    - `financial_table_name` (Required): Name for the new financial entry.
    - `weight` (Required, default: 1): Weight for the new financial entry (must be a number).
    - `currency` (Required): Currency for the new financial entry.
    - `status` (Required, default: 1): Status for the new financial entry (must be a number).
  - **Response**: Returns the created financial entry.

- - **Update Financial Entry**:
  - **Endpoint**: `/financial-table/update/:entryId`
  - **Method**: `PUT`
  - **Headers**:
    ```
    Authorization: Bearer <JWT Token>
    ```
  - **Params**:
    ```
    entryId: <financial_entry_id>
    ```
  - **Request Body**:
    ```json
    {
      "financial_table_name": "Updated Name",
      "weight": 5,
      "currency": "USD"
    }
    ```
    - `financial_table_name` (Optional): Updated name for the financial entry.
    - `weight` (Optional): Updated weight for the financial entry (must be a number).
    - `currency` (Optional): Updated currency for the financial entry.
  - **Response**: Returns a message indicating the success or failure of the update.

- **Delete Financial Entry**:
  - **Endpoint**: `/financial-table/delete/:entryId`
  - **Method**: `DELETE`
  - **Headers**:
    ```
    Authorization: Bearer <JWT Token>
    ```
  - **Params**:
    ```
    entryId: <financial_entry_id>
    ```
  - **Response**: Returns a message indicating the success or failure of the deletion.

## Logging

The application has logging capabilities. Additionally, a cron job is implemented to clear the database every day.

## License

This project is licensed under the [MIT License](LICENSE).
