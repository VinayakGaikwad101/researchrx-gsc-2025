# ResearchRX - Server

## Overview
The ResearchRX Server is a Node.js/Express backend that powers both the Patient and Researcher portals. It provides secure API endpoints, handles authentication, manages file uploads, and maintains the database connection.

## 🚀 Quick Start

### Prerequisites
- Node.js (v19.0.0 or higher)
- MongoDB
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .example.env .env

# Start development server
npm run dev
```

The server will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
server/
├── config/                # Configuration files
│   ├── cloudinary.config.js  # Cloudinary setup
│   ├── email.config.js      # Email service setup
│   └── multer.config.js     # File upload setup
├── controllers/           # Request handlers
│   ├── blog.controller.js
│   ├── comment.controller.js
│   ├── patientAuth.controller.js
│   └── ...
├── database/             # Database configuration
│   └── mongoose.database.js
├── middlewares/          # Custom middlewares
│   ├── protectRole.js
│   └── protectRoute.middleware.js
├── models/              # Database models
│   ├── blog.model.js
│   ├── comment.model.js
│   ├── medicalReport.model.js
│   └── user.model.js
├── router/             # API routes
│   ├── blog.router.js
│   ├── patient.router.js
│   └── ...
├── utils/             # Utility functions
│   ├── emailer.utils.js
│   ├── jwtSecret.util.js
│   └── ...
└── views/            # Email templates
    ├── template1.ejs
    └── ...
```

## 🛠️ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Email verification
- Password reset functionality

### File Management
- Medical report uploads
- Image processing
- Cloudinary integration
- File type validation

### Email Service
- Email verification
- Password reset emails
- Notification system
- EJS templates

### Database Operations
- MongoDB with Mongoose
- Data validation
- Relationship management
- Query optimization

### Security Features
- CORS configuration
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## 💻 Development

### Available Scripts
```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests
npm test

# Watch CSS changes
npm run watch:css
```

### API Endpoints

#### Authentication
```
POST /api/patient/auth/signup     # Patient registration
POST /api/patient/auth/login      # Patient login
POST /api/researcher/auth/signup  # Researcher registration
POST /api/researcher/auth/login   # Researcher login
POST /api/auth/verify-email      # Email verification
POST /api/auth/reset-password    # Password reset
```

#### Medical Reports
```
GET    /api/patient/reports      # Get patient reports
POST   /api/patient/reports      # Upload report
GET    /api/patient/reports/:id  # Get specific report
DELETE /api/patient/reports/:id  # Delete report
```

#### Blogs
```
GET    /api/blogs               # Get all blogs
POST   /api/blogs              # Create blog
GET    /api/blogs/:id          # Get specific blog
PUT    /api/blogs/:id          # Update blog
DELETE /api/blogs/:id          # Delete blog
```

#### Comments
```
GET    /api/blogs/:id/comments  # Get blog comments
POST   /api/blogs/:id/comments  # Add comment
DELETE /api/comments/:id        # Delete comment
```

### Environment Variables
Required variables in `.env`:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

## 🔒 Security Considerations

### Data Protection
- All sensitive data is encrypted
- Passwords are hashed using bcrypt
- JWT tokens for session management
- Role-based access control

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

### Development Guidelines
- Follow RESTful API design principles
- Document all API endpoints
- Write unit tests for new features
- Follow error handling patterns

## 🧪 Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.js
```

## 📝 Logging
- Request logging
- Error logging
- Audit logging for sensitive operations
- Performance monitoring

## 🐛 Known Issues
- Check GitHub issues for current bugs
- Report new issues through GitHub

## 📞 Support
For support, contact vinaayakgaikwad@gmail.com

---
Part of ResearchRX - Google Solutions Challenge 2025
