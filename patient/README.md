# ResearchRX - Patient Portal

## Overview
The Patient Portal is a user-friendly web application that allows patients to manage their health records, perform self-diagnosis, calculate BMI, and interact with medical professionals. Built with React and Vite, it provides a modern, responsive interface for healthcare management.

🌐 **Live Application**: [https://patient-researchrx.vercel.app/](https://patient-researchrx.vercel.app/)

## 🚀 Quick Start

### Prerequisites
- Node.js (v19.0.0 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
patient/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── AboutUs.jsx      # About page component
│   │   ├── BMI.jsx         # BMI calculator component
│   │   ├── ContactUs.jsx   # Contact page component
│   │   ├── Home.jsx        # Home page component
│   │   ├── Login.jsx       # Authentication component
│   │   └── ...
│   ├── store/              # Zustand state management
│   │   ├── useAuthStore.js    # Authentication state
│   │   ├── useBMIStore.js     # BMI calculator state
│   │   └── ...
│   ├── assets/             # Static assets
│   ├── App.jsx            # Main application component
│   └── main.jsx          # Application entry point
├── public/               # Public assets
└── ...
```

## 🛠️ Features

### Authentication
- User registration and login
- Email verification
- Password reset functionality
- Secure session management

### Medical Reports
- Upload and manage medical reports
- View report history
- Share reports with researchers (anonymized)
- Download reports in PDF format

### BMI Calculator
- Calculate Body Mass Index
- Track BMI history
- Get health recommendations based on BMI

### Self-Diagnosis
- AI-powered symptom checker
- Health recommendations
- Medical history tracking

### Profile Management
- Update personal information
- Manage privacy settings
- View activity history

## 💻 Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Key Dependencies
- React 19
- Vite 6
- TailwindCSS
- Zustand
- React Router DOM
- Framer Motion
- React PDF Viewer
- Radix UI Components

### State Management
The application uses Zustand for state management. State is organized into different stores:
- `useAuthStore` - Authentication state
- `useBMIStore` - BMI calculator state
- `useMedicalReportStore` - Medical reports state
- `useSelfDiagnosis` - Self-diagnosis state

### Styling
- TailwindCSS for utility-first styling
- Customizable theme in `tailwind.config.js`
- Component-specific styles in respective files

## 🔒 Security Features
- JWT-based authentication
- Secure data transmission
- Input validation and sanitization
- Protected routes
- Session management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style
- Follow existing code patterns
- Use meaningful component names
- Document complex logic
- Write clean, maintainable code

## 📝 Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url
VITE_CLOUDINARY_URL=your_cloudinary_url
```

## 🐛 Known Issues
- Check the issues tab on GitHub for current bugs and feature requests
- Report new issues through GitHub issues

## 📞 Support
For support, contact vinaayakgaikwad@gmail.com

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---
Part of ResearchRX - Google Solutions Challenge 2025
