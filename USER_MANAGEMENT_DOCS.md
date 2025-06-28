# User Management System Documentation

## Overview

The LYNC platform includes a comprehensive user management system that allows administrators to manage all platform users, their roles, and permissions.

## Features

### 🔍 User Overview
- View all registered users in a sortable, filterable table
- Search users by name or email
- Filter by role (Admin/User) and status (Active/Inactive/Suspended)
- Real-time user statistics and metrics

### 👑 Role Management
- **Admin Role**: Full system access including:
  - Product management
  - Order management
  - User management
  - Analytics access
- **User Role**: Standard customer privileges:
  - Browse products
  - Make purchases
  - Manage profile

### 📊 User Statistics
- Total registered users
- Active vs inactive users
- New user registrations this month
- User engagement metrics
- Growth rate analytics

### ⚙️ User Operations

#### Create New User
1. Click "Create User" button
2. Fill in required information:
   - First & Last Name
   - Email Address
   - Password
   - Role (User/Admin)
   - Status (Active/Inactive/Suspended)
3. Save to create the account

#### Edit Existing User
1. Click edit (pencil) icon next to user
2. Modify user information
3. Update role or status as needed
4. Save changes

#### View User Details
- Click view (eye) icon for detailed user information
- Shows account creation date, last login, order history
- Displays total orders and spending

#### Delete User
- Click delete (trash) icon
- Confirm deletion (irreversible action)
- User data is permanently removed

### 🔒 Security Features

#### Role Protection
- Users cannot change their own role
- Users cannot delete their own account
- Admin privileges required for user management

#### Status Management
- Active: User can log in normally
- Inactive: Account temporarily disabled
- Suspended: Account blocked from access

### 📈 Analytics Integration

The user management system integrates with the analytics dashboard to provide:
- User growth trends
- Engagement metrics
- Role distribution statistics
- Activity patterns

### 🔄 Real-time Updates

- Automatic refresh capabilities
- Live status updates
- Instant role changes
- Real-time user statistics

## Technical Implementation

### Components
- `AdminUsersPage.jsx` - Main user management interface
- `UserModal.jsx` - User creation/editing modal
- `UserStatsWidget.jsx` - Statistics dashboard widget

### API Endpoints
```javascript
GET    /api/users          // Fetch all users
POST   /api/users          // Create new user
PATCH  /api/users/:id      // Update user
DELETE /api/users/:id      // Delete user
GET    /api/users/stats    // User statistics
```

### Permissions
- Only users with `admin` role can access user management
- Protected routes ensure unauthorized access is prevented
- JWT token validation on all user operations

## Best Practices

### User Creation
- Enforce strong password requirements
- Validate email addresses
- Set appropriate default roles
- Verify information before saving

### Role Assignment
- Limit admin role assignments
- Document role changes
- Regular role audits
- Principle of least privilege

### Data Management
- Regular user data backups
- Export capabilities for reporting
- Secure handling of sensitive information
- GDPR compliance considerations

## Troubleshooting

### Common Issues

**Users not loading**
- Check backend connection
- Verify API endpoints
- Check authentication token

**Permission errors**
- Confirm admin role assignment
- Verify token validity
- Check route protection

**Create/Edit failures**
- Validate required fields
- Check email format
- Verify password requirements
- Confirm backend API availability

### Mock Data Mode
When backend is unavailable, the system uses demo data:
- 5 sample users with various roles/statuses
- Simulated statistics
- Limited functionality for testing

## Future Enhancements

- Bulk user operations
- Advanced user permissions
- User activity logging
- Email notifications
- Two-factor authentication
- User groups/departments
- Advanced reporting
- User import/export
- Profile picture management
- User preferences settings
