# ResearchRX - Researcher Portal

## Overview
The Researcher Portal is a specialized platform designed for medical researchers to access anonymized patient data, publish research findings, and collaborate with other researchers. Built with React and Vite, it provides powerful tools for medical research and data analysis.

🌐 **Live Application**: [https://researcher-researchrx.vercel.app/](https://researcher-researchrx.vercel.app/)

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

The application will be available at `http://localhost:5174`

## 🏗️ Project Structure

```
researcher/
├── src/
│   ├── components/           # React components
│   │   ├── BlogDetail.jsx   # Blog detail view
│   │   ├── BlogList.jsx     # Blog listing
│   │   ├── CreateBlog.jsx   # Blog creation
│   │   ├── Research.jsx     # Research tools
│   │   ├── PeriodicTable.jsx # Periodic table component
│   │   └── ...
│   ├── store/              # Zustand state management
│   │   ├── useAuthStore.js    # Authentication state
│   │   ├── useBlogStore.js    # Blog management state
│   │   ├── usePubChemStore.js # PubChem integration state
│   │   └── ...
│   ├── assets/             # Static assets
│   ├── App.jsx            # Main application component
│   └── main.jsx          # Application entry point
├── public/               # Public assets
└── ...
```

## 🛠️ Features

### Authentication
- Researcher registration and login
- Email verification
- Professional credentials verification
- Secure session management

### Blog Management
- Create and publish research blogs
- Rich text editor with scientific notation support
- Image and document embedding
- Version control for drafts

### Medical Data Access
- View anonymized patient data
- Advanced search and filtering
- Data export capabilities
- Statistical analysis tools

### Research Tools
- Periodic Table reference
- PubChem integration
- Chemical structure visualization
- Research paper citations

### Profile Management
- Professional profile settings
- Publication history
- Research interests
- Collaboration network

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
- Scholarly (for citations)

### State Management
The application uses Zustand for state management. State is organized into different stores:
- `useAuthStore` - Authentication state
- `useBlogStore` - Blog management state
- `useMedicalReportStore` - Medical data access state
- `usePubChemStore` - PubChem integration state

### Styling
- TailwindCSS for utility-first styling
- Customizable theme in `tailwind.config.js`
- Component-specific styles in respective files

## 🔒 Security Features
- JWT-based authentication
- Role-based access control
- Data anonymization
- Secure data transmission
- Audit logging

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
VITE_PUBCHEM_API_URL=your_pubchem_api_url
```

## 🔬 Research Guidelines
- Follow ethical research practices
- Maintain patient data confidentiality
- Cite sources appropriately
- Follow data protection regulations

## 📊 Data Usage
- Access to anonymized data only
- No attempt to de-anonymize data
- Proper citation of data sources
- Regular auditing of data access

## 🐛 Known Issues
- Check the issues tab on GitHub for current bugs and feature requests
- Report new issues through GitHub issues

## 📞 Support
For support, contact vinaayakgaikwad@gmail.com

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---
Part of ResearchRX - Google Solutions Challenge 2025
