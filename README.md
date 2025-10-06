# MUUD Health

## Tech Stack
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for handling HTTP requests and routing.
- **PostgreSQL**: Relational database for storing user, journal, and contact data.
- **pg (node-postgres)**: PostgreSQL client for Node.js.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: Library for generating and verifying JWTs.
- **dotenv**: Module for loading environment variables from a `.env` file.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager, typically included with Node.js)
- **PostgreSQL** (v12 or higher)
- A PostgreSQL database instance (local or hosted)

## Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/anserdev/Muud-health-backend.git
   cd Muud-health-backend
   ```

2. **Install Dependencies**
   Run the following command to install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Copy the example environment file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and update the following variables with your PostgreSQL credentials and a secure JWT secret:
   ```
   PORT=3000
   DB_USER=your_postgres_username
   DB_HOST=your_postgres_host
   DB_NAME=your_database_name
   DB_PASSWORD=your_postgres_password
   DB_PORT=your_postgres_port
   JWT_SECRET=your_jwt_secret
   ```
   Replace the placeholders (`your_postgres_username`, etc.) with your actual values.

4. **Set Up the Database**
   - Ensure your PostgreSQL server is running.
   - Create a database (e.g., `muud_health`).
   - Execute the following SQL to create the required tables:
     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
     );

     CREATE TABLE journal_entries (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       entry_text TEXT NOT NULL,
       mood_rating INTEGER NOT NULL CHECK (mood_rating BETWEEN 1 AND 5),
       timestamp TIMESTAMP NOT NULL
     );

     CREATE TABLE contacts (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       contact_name VARCHAR(255) NOT NULL,
       contact_email VARCHAR(255) NOT NULL
     );
     ```

5. **Seed the Database with Test Data**
   - A seeder script (`db/seed.js`) is provided to populate the database with test data for development and testing.
   - Ensure the database tables are created before running the seeder.
   - Run the seeder with:
     ```bash
     npm run seed
     ```
   - This will populate the database with sample users, journal entries, and contacts (see **Seeded Data** below for details).

## Seeded Data
The seeder script (`db/seed.js`) inserts the following test data:
- **Users**:
  - Username: `alice`, Password: `password123`
  - Username: `bob`, Password: `securepass456`
- **Journal Entries**:
  - For `alice`:
    - Entry: "Feeling optimistic today!", Mood Rating: 5, Timestamp: `2025-05-28T10:00:00Z`
    - Entry: "Had a tough day.", Mood Rating: 3, Timestamp: `2025-05-28T18:00:00Z`
  - For `bob`:
    - Entry: "Great workout session!", Mood Rating: 4, Timestamp: `2025-05-28T15:00:00Z`
- **Contacts**:
  - For `alice`:
    - Name: "Charlie", Email: `charlie@example.com`
    - Name: "Dana", Email: `dana@example.com`
  - For `bob`:
    - Name: "Eve", Email: `eve@example.com`

You can use the above user credentials (`alice:password123`, `bob:securepass456`) to test the `/auth/login` endpoint and access authenticated routes.

## How to Run
1. **Start the Server**
   Run the following command to start the Express server:
   ```bash
   node index.js
   ```
   The server will start on the port specified in the `.env` file (default: `3000`). You should see the message:
   ```
   Server is running on port 3000
   ```

2. **Access the API**
   The API will be available at `http://localhost:3000`. You can test endpoints using tools like Postman or curl.

## What to Expect
- **Root Endpoint (`GET /`)**
  - Returns a simple message: `"MUUD Health API is running"`.
- **Authentication Endpoints**
  - `POST /auth/register`: Register a new user with a username and password. Returns a user ID on success.
  - `POST /auth/login`: Log in with a username and password. Returns a JWT token on success.
- **Journal Endpoints (Authenticated)**
  - `POST /journal`: Create a journal entry with text, mood rating (1–5), and timestamp. Requires a valid JWT in the `Authorization` header (`Bearer <token>`).
  - `GET /journal`: Retrieve all journal entries for the authenticated user, sorted by timestamp (descending).
- **Contacts Endpoints (Authenticated)**
  - `POST /contacts`: Add a contact with a name and email. Requires a valid JWT.
  - `GET /contacts`: Retrieve all contacts for the authenticated user, sorted by ID.
- **Error Handling**
  - Expect HTTP status codes like `400` (bad request), `401` (unauthorized), `403` (invalid token), or `500` (server error) for invalid requests or errors.
- **Database**
  - The API interacts with a PostgreSQL database to store and retrieve user data, journal entries, and contacts.

## Example Requests
1. **Register a User**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
   -H "Content-Type: application/json" \
   -d '{"username":"testuser","password":"testpass"}'
   ```
   **Response**: `{"success":true,"user_id":1}`

2. **Log In**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username":"alice","password":"password123"}'
   ```
   **Response**: `{"success":true,"token":"eyJhbG..."}`

3. **Create a Journal Entry**
   ```bash
   curl -X POST http://localhost:3000/journal \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJhbG..." \
   -d '{"entry_text":"Feeling great!","mood_rating":5,"timestamp":"2025-05-29T12:00:00Z"}'
   ```
   **Response**: `{"success":true,"entry_id":1}`

## Notes
- Ensure the PostgreSQL database is running and accessible before starting the server or running the seeder.
- The seeder script uses `ON CONFLICT DO NOTHING` to avoid errors if data already exists, making it safe to run multiple times.
- The API assumes the database schema is set up as described. Missing tables or incorrect schema may cause errors.