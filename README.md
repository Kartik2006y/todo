# Smart Task & Notes Management System

A full-stack MERN application for managing tasks and notes with secure user authentication, persistent data storage, and a beautiful responsive UI with dark mode support.

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## Features

### Core Features
- Secure user registration and login with JWT authentication
- Full CRUD operations for tasks and notes
- Protected routes with token validation
- Persistent data storage with MongoDB
- Dark mode and light mode support
- Fully responsive design (mobile, tablet, desktop)
- Real-time search and filtering

### Task Management
- Create, read, update, and delete tasks
- Due date tracking with "due soon" indicators
- Status management (pending/completed)
- Search tasks by title or description
- Filter by status (pending, completed, all)
- Dashboard statistics (total, pending, completed, due soon)

### Note Management
- Create, read, update, and delete notes
- Full-text search in notes
- Rich note content support
- Grid layout for easy browsing

### Bonus Features
- Dark mode with persistent theme preference
- Advanced statistics dashboard
- Due date tracking (tasks due within 3 days highlighted)
- Beautiful UI with ambient effects
- Mobile-first responsive design
- Optimized performance with React hooks
- Flash messages for user feedback

## Tech Stack

### Frontend
- React - UI library
- Vite - Build tool and dev server
- React Router - Client-side routing
- Axios - HTTP client
- CSS Variables - Dynamic theming

### Backend
- Node.js - Runtime environment
- Express - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB
- JWT - Authentication
- bcrypt - Password hashing
- CORS - Cross-origin requests

## Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB local installation or Atlas account
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd TY_React
```

2. **Setup MongoDB** (see [SETUP_GUIDE.md](./SETUP_GUIDE.md))

3. **Backend Setup**
```bash
cd backend
npm install
# Configure .env file with MongoDB URI, JWT_SECRET, etc.
npm run dev
```

4. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup and troubleshooting guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Detailed API endpoint documentation
- [PROJECT_COMPLETION_CHECKLIST.md](./PROJECT_COMPLETION_CHECKLIST.md) - Feature checklist and status

## API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
```

### Tasks
```
GET    /api/tasks            - Get all tasks (with filters)
POST   /api/tasks            - Create new task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
```

### Notes
```
GET    /api/notes            - Get all notes (with search)
POST   /api/notes            - Create new note
PUT    /api/notes/:id        - Update note
DELETE /api/notes/:id        - Delete note
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## Project Structure

```
TY_React/
├── frontend/
│   ├── src/
│   │   ├── api/              # API client configuration
│   │   ├── components/       # Reusable React components
│   │   │   ├── AuthShell.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/          # Auth context for global state
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── pages/            # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── styles/           # Global CSS with dark mode
│   │   │   └── index.css
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── backend/
│   ├── config/               # Database configuration
│   │   └── db.js
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── noteController.js
│   ├── middleware/           # Authentication & error handling
│   │   ├── asyncHandler.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Note.js
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── noteRoutes.js
│   ├── server.js             # Express server setup
│   ├── .env                  # Environment variables
│   └── package.json
│
├── SETUP_GUIDE.md            # Setup and installation guide
├── API_DOCUMENTATION.md      # API endpoint documentation
├── PROJECT_COMPLETION_CHECKLIST.md
└── README.md                 # This file
```

## Testing

### Test Checklist
- User registration and login
- JWT token generation and validation
- Task CRUD operations
- Note CRUD operations
- Protected routes
- Search and filtering
- Dark mode toggle
- Responsive design
- Error handling
- Form validation

### Manual Testing with Postman
1. Create a new Postman collection
2. Add requests for each endpoint
3. Test authentication flow
4. Test CRUD operations with valid tokens
5. Test error cases (invalid tokens, missing data, etc.)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for Postman collection examples.

## Deployment

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- User data isolation (users can only access their own data)
- Input validation on all endpoints
- CORS enabled for frontend only
- Proper HTTP status codes

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running locally or connected to MongoDB Atlas
- Check username/password are correct (for Atlas)
- Verify connection string format

**CORS Errors**
- Ensure backend is running on port 5000
- Check CLIENT_URL in .env matches frontend URL

**Login Issues**
- Clear LocalStorage and try again
- Verify JWT_SECRET is the same on backend

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting tips.

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-task-notes
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [JWT Introduction](https://jwt.io/introduction)

## License

ISC License - feel free to use this project for learning purposes.

## Support

If you encounter any issues:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for common solutions
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
3. Check the browser console for frontend errors
4. Check server logs for backend errors

## Next Steps

After completing this project:
1. Add more features (recurring tasks, task priorities, etc.)
2. Implement testing (Jest, Supertest)
3. Add deployment and CI/CD pipeline
4. Deploy to production
5. Monitor analytics and user feedback

## Highlights

- Mobile-first responsive design
- Dark mode support
- Fast performance with Vite
- Secure authentication
- Real-time statistics
- Beautiful UI design
- Comprehensive documentation
- Production-ready code

---

Happy coding!

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
