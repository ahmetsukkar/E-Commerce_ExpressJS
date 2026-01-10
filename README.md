# eCommerce MERN Stack

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js.

## Features

- 🛍️ Product browsing and catalog
- 🛒 Shopping cart functionality
- 👤 User authentication and authorization
- 📦 Order management
- 💳 Cash on delivery checkout
- 📱 Responsive design with Material-UI

## Tech Stack

**Frontend:**
- React with TypeScript
- Material-UI (MUI)
- React Router
- Fetch API

**Backend:**
- Node.js & Express.js with TypeScript
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

## Project Structure



## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ahmetsukkar/eCommerce-MERN-Stack.git
cd eCommerce-MERN-Stack
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create a .env file in the backend directory:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Run the application
Backend:
```bash
cd backend
npm run dev
```
Frontend:
```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173 and the backend on http://localhost:5000.

**Contributing:**
Contributions are welcome! Please feel free to submit a Pull Request.

