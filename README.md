# LYNC E-commerce Platform - Frontend

A modern React-based e-commerce platform with comprehensive admin management capabilities.

## Features

### 🛍️ Customer Features
- Browse and search products
- Shopping cart management
- Secure checkout process
- Order tracking
- User account management

### 👑 Admin Management System
- **Product Management**: Create, edit, delete, and manage product inventory
- **Order Management**: View, update, and track customer orders
- **User Management**: Comprehensive user administration system
- **Analytics Dashboard**: Real-time metrics and insights

## 👥 User Management System

The admin user management system provides comprehensive tools for managing platform users:

### Key Features
- **User Overview**: View all registered users with detailed information
- **Role Management**: Assign and modify user roles (User/Admin)
- **Status Control**: Activate, deactivate, or suspend user accounts
- **User Creation**: Create new user accounts directly from admin panel
- **User Editing**: Modify user information and permissions
- **Search & Filter**: Advanced filtering by role, status, and search terms
- **Export Capabilities**: Export user data for reporting
- **Real-time Statistics**: User engagement and growth metrics

### User Roles
- **👤 User**: Standard customer account with shopping privileges
- **👑 Admin**: Full system access with management capabilities

### User Status Options
- **✅ Active**: User can log in and use the system
- **⏸️ Inactive**: Temporarily disabled account
- **🚫 Suspended**: Blocked account

### Access Routes
- `/admin/users` - Main user management interface
- Admin navigation includes direct "Users" link
- Integrated with main admin dashboard

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **UI Framework**: Bootstrap 5
- **Icons**: React Icons (Font Awesome)
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd LYNC_PROJECT_FRONTEND
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Admin Access

To access admin features:

1. Create an admin account through the signup page with role "admin"
2. Or use the test admin token generator in browser console (development only)
3. Navigate to `/admin` for the main dashboard
4. Access user management at `/admin/users`

## API Integration

The application supports both:
- **Backend API**: Connects to Node.js/Express backend at `http://localhost:3001`
- **Demo Mode**: Falls back to mock data when backend is unavailable

### User Management API Endpoints
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── UserModal.jsx    # User creation/editing modal
│   ├── UserStatsWidget.jsx # User statistics widget
│   └── ...
├── pages/               # Page components
│   ├── AdminUsersPage.jsx # Main user management page
│   ├── AdminDashboard.jsx # Admin dashboard
│   └── ...
├── utils/               # Utility functions
│   ├── auth.js         # Authentication helpers
│   └── ...
└── contexts/           # React contexts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the LYNC e-commerce platform educational project.
