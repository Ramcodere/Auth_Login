# Blog Platform

A full-stack MERN application for sharing blog posts. Features user authentication, blog post CRUD operations, and interactive features like comments and likes.

## Features

- **User Authentication**: JWT-based authentication with secure password storage
- **Blog Posts**: Create, read, update, and delete blog posts
- **Interactive Features**: Comment on posts and like/unlike posts
- **Tag System**: Categorize posts with tags and filter by tags
- **Modern UI**: Clean and responsive user interface with light green and light sky blue color scheme

## Technologies Used

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing

### Frontend  
- React.js with hooks and context API
- React Router v6 for routing
- Styled Components for styling
- Axios for API requests

## Project Structure

```
blog-platform/
│
├── backend/              # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   └── server.js     # Entry point
│   ├── .env              # Environment variables
│   └── package.json
│
└── frontend/             # Frontend React application
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── context/      # React context
    │   ├── pages/        # Page components
    │   ├── styles/       # Styling
    │   ├── utils/        # Utility functions
    │   ├── App.js        # Main app component
    │   └── index.js      # Entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/blog-platform.git
   cd blog-platform
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following values:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blog-platform
   JWT_SECRET=your_jwt_secret_key
   ```

4. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start MongoDB (if using local MongoDB)
   ```
   mongod
   ```

2. Start the backend server
   ```
   cd backend
   npm run dev
   ```

3. Start the frontend development server
   ```
   cd frontend
   npm start
   ```

4. Open your browser and navigate to `http://localhost:1234`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post (protected)
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

### Comments
- `POST /api/comments` - Create a comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)
- `POST /api/comments/:id/like` - Like/unlike comment (protected)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Change password (protected)
- `GET /api/users/posts` - Get current user's posts (protected)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 