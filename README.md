# Vehicle Rental System

A robust backend system for managing vehicle rentals, allowing users to browse vehicles, make bookings, and managing rental operations. This system handles user authentication, vehicle inventory, and rental transaction tracking.

**Live URL:** [https://vehicle-rental-system-mu-ochre.vercel.app/](https://vehicle-rental-system-mu-ochre.vercel.app/)

## Features

-   **User Authentication**: Secure signup and login with JWT-based authentication.
-   **Role-Based Access Control**:
    -   **Admin**: Manage vehicles (CRUD), view all bookings, and manage user roles.
    -   **Customer**: Browse vehicles, book rentals, and view personal booking history.
-   **Vehicle Management**: comprehensive management of vehicle inventory including availability status.
-   **Booking System**: Streamlined process for booking vehicles with date validation and total cost calculation.
-   **Rentals**: Track active rentals and handle vehicle returns.

## Technology Stack

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

### Database
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **Client**: `pg` (node-postgres) for raw SQL queries.

### Security & Tools
-   **Authentication**: JSON Web Tokens (JWT) & bcryptjs for password hashing.
-   **Environment Management**: dotenv.
-   **Dev Tools**: tsx, nodemon (if used).

### Application Dependencies

| Package | Purpose |
| :--- | :--- |
| `express` | Web framework for Node.js. |
| `pg` | PostgreSQL client for Node.js. |
| `bcryptjs` | Library to hash passwords. |
| `jsonwebtoken` | JSON Web Token implementation. |
| `dotenv` | Loads environment variables from .env file. |
| `typescript` | TypeScript language support. |
| `tsx` | TypeScript execution environment (Development). |

## Setup & Usage Instructions

### Prerequisites
-   Node.js (v18 or higher recommended)
-   PostgreSQL installed and running
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/omarfaruk-dev/Vehicle-Rental-System.git
    cd vehicle-rental-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=5000
    CONNECTION_STR=postgres://username:password@localhost:5432/vehicle_rental_db
    JWT_SECRET=your_super_secret_key
    ```
    *Note: Replace the `CONNECTION_STR` values with your actual PostgreSQL credentials.*

4.  **Initialize Database:**
    The application is designed to initialize necessary tables on startup via `initDB` in `src/config/db.ts`. Ensure your PostgreSQL database exists before running the server.

### Running the Application

*   **Development Mode:**
    Runs the server with hot-reloading using `tsx`.
    ```bash
    npm run dev
    ```

*   **Build Project:**
    Compiles TypeScript to JavaScript.
    ```bash
    npm run build
    ```

*   **Production Start:**
    (After building)
    ```bash
    node dist/server.js
    ```

## API Documentation

The API is accessible at `http://localhost:5000/api/v1`.

### Key Endpoints
-   **Auth**: `/api/v1/auth/signup`, `/api/v1/auth/signin`
-   **Vehicles**: `/api/v1/vehicles` (GET, POST, PUT, DELETE)
-   **Bookings**: `/api/v1/bookings` (POST, GET)

*For a full list of endpoints and detailed specifications, please refer to the [API Reference](API.md).*

## Developer Info

-   **Name**: Shihab Uddin
-   **Website**: [https://omarfaruk.web.app/](https://omarfaruk.web.app/)
-   **LinkedIn**: [https://www.linkedin.com/in/dev-omar-faruk/](https://www.linkedin.com/in/dev-omar-faruk/)
