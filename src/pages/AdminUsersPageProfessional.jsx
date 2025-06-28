import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, getCurrentUser } from "../utils/auth";
import { toast } from "react-toastify";
import { format } from "date-fns";
import UserModal from "../components/UserModal";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaDownload,
  FaSync,
  FaCrown,
  FaUserShield,
  FaUserCheck,
  FaBan,
  FaChartLine,
  FaUserCog,
  FaHistory,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaFileExport,
  FaPrint,
  FaShoppingCart,
  FaClock,
  FaTachometerAlt,
} from "react-icons/fa";

const AdminUsersPageProfessional = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:3001/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const usersData = await response.json();
          const formattedUsers = usersData.map((user) => ({
            id: user._id || user.id,
            firstName: user.firstName || "Unknown",
            lastName: user.lastName || "User",
            email: user.email,
            role: user.role || "user",
            status: user.status || "active",
            createdAt: user.createdAt || new Date().toISOString(),
            lastLogin: user.lastLogin || null,
            imageUrl: user.imageUrl || null,
            orders: user.orders || 0,
            totalSpent: user.totalSpent || 0,
          }));

          setUsers(formattedUsers);
          toast.success(`✅ Successfully loaded ${formattedUsers.length} users from database`);
        } else if (response.status === 401) {
          toast.error("❌ Authentication failed - Please login again");
          navigate("/login");
        } else {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("❌ Failed to connect to backend - Please check your connection");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  // Refresh users data
  const refreshUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        const formattedUsers = usersData.map((user) => ({
          id: user._id || user.id,
          firstName: user.firstName || "Unknown",
          lastName: user.lastName || "User",
          email: user.email,
          role: user.role || "user",
          status: user.status || "active",
          createdAt: user.createdAt || new Date().toISOString(),
          lastLogin: user.lastLogin || null,
          imageUrl: user.imageUrl || null,
          orders: user.orders || 0,
          totalSpent: user.totalSpent || 0,
        }));

        setUsers(formattedUsers);
        toast.success("Users refreshed successfully!");
      } else {
        toast.error("Failed to refresh users");
      }
    } catch (error) {
      toast.error("Failed to refresh users - using cached data");
    }
  };

  // View user details
  const viewUserDetails = (user) => {
    let formattedCreatedDate, formattedLastLogin;
    
    try {
      formattedCreatedDate = format(new Date(user.createdAt), "PPpp");
    } catch (e) {
      formattedCreatedDate = "Invalid Date";
    }

    try {
      formattedLastLogin = user.lastLogin 
        ? format(new Date(user.lastLogin), "PPpp")
        : "Never";
    } catch (e) {
      formattedLastLogin = "Invalid Date";
    }

    const userDetails = `
👤 USER DETAILS

📋 User ID: ${user.id}
👤 Name: ${user.firstName} ${user.lastName}
📧 Email: ${user.email}
🏷️ Role: ${user.role.toUpperCase()}
📊 Status: ${user.status.toUpperCase()}

📅 Account Created: ${formattedCreatedDate}
🕐 Last Login: ${formattedLastLogin}

📈 Activity:
• Total Orders: ${user.orders}
• Total Spent: $${user.totalSpent.toFixed(2)}

${user.imageUrl ? `🖼️ Profile Image: ${user.imageUrl}` : "📷 No profile image"}
    `;

    alert(userDetails);
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    const currentUser = getCurrentUser();
    
    if (currentUser.id === userId) {
      toast.error("You cannot change your own role!");
      return;
    }

    const loadingToast = toast.loading(`Updating user role to ${newRole}...`);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user role`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <div className="fw-bold">✅ Role Updated!</div>
          <div className="small">User role changed to {newRole}</div>
        </div>
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <div className="fw-bold">❌ Update Failed</div>
          <div className="small">{error.message}</div>
        </div>
      );
    }
  };

  // Update user status
  const updateUserStatus = async (userId, newStatus) => {
    const loadingToast = toast.loading(`${newStatus === 'active' ? 'Activating' : 'Deactivating'} user...`);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user status`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <div className="fw-bold">✅ Status Updated!</div>
          <div className="small">User {newStatus === 'active' ? 'activated' : 'deactivated'}</div>
        </div>
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <div className="fw-bold">❌ Update Failed</div>
          <div className="small">{error.message}</div>
        </div>
      );
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    const currentUser = getCurrentUser();
    const userToDelete = users.find(u => u.id === userId);
    
    if (currentUser.id === userId) {
      toast.error("You cannot delete your own account!");
      return;
    }

    if (
      !window.confirm(
        `⚠️ Are you sure you want to permanently delete user "${userToDelete?.firstName} ${userToDelete?.lastName}"?\n\nThis action cannot be undone and will remove all user data.`
      )
    ) {
      return;
    }

    const loadingToast = toast.loading("Deleting user...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete user`);
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <div className="fw-bold">🗑️ User Deleted!</div>
          <div className="small">User removed permanently</div>
        </div>
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <div className="fw-bold">❌ Delete Failed</div>
          <div className="small">{error.message}</div>
        </div>
      );
    }
  };

  // Handle user saved from modal
  const handleUserSaved = (savedUser) => {
    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === savedUser.id ? { ...user, ...savedUser } : user
        )
      );
    } else {
      setUsers((prevUsers) => [savedUser, ...prevUsers]);
    }
    refreshUsers();
  };

  // Open create user modal
  const openCreateUserModal = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  // Open edit user modal
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const exportUsers = () => {
    const data = filteredUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      created: user.createdAt,
      lastLogin: user.lastLogin || "Never",
      orders: user.orders,
      totalSpent: user.totalSpent,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Users exported successfully!");
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        class: "bg-danger",
        icon: <FaCrown />,
        text: "Admin",
      },
      user: {
        class: "bg-primary",
        icon: <FaUser />,
        text: "User",
      },
    };

    const config = roleConfig[role] || roleConfig.user;

    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        class: "bg-success",
        icon: <FaUserCheck />,
        text: "Active",
      },
      inactive: {
        class: "bg-warning text-dark",
        icon: <FaBan />,
        text: "Inactive",
      },
      suspended: {
        class: "bg-danger",
        icon: <FaBan />,
        text: "Suspended",
      },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "name":
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "email":
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case "role":
          aVal = a.role;
          bVal = b.role;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "created":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case "orders":
          aVal = a.orders;
          bVal = b.orders;
          break;
        case "spent":
          aVal = a.totalSpent;
          bVal = b.totalSpent;
          break;
        default:
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate user stats
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    totalOrders: users.reduce((sum, u) => sum + u.orders, 0),
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <FaTachometerAlt className="spinner-icon" />
          </div>
          <h3>Loading User Management System</h3>
          <p>Preparing your professional dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-users-container">
        {/* Professional Header Section */}
        <div className="admin-header-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="professional-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon-wrapper">
                        <FaUsers className="header-main-icon" />
                      </div>
                      <div className="header-text">
                        <h1 className="header-title">User Management Center</h1>
                        <p className="header-subtitle">
                          Comprehensive user administration, role management, and system analytics
                        </p>
                      </div>
                    </div>
                    <div className="header-right">
                      <div className="header-metrics">
                        <div className="metric-card primary">
                          <div className="metric-value">{userStats.total}</div>
                          <div className="metric-label">Total Users</div>
                        </div>
                        <div className="metric-card success">
                          <div className="metric-value">{userStats.active}</div>
                          <div className="metric-label">Active</div>
                        </div>
                        <div className="metric-card info">
                          <div className="metric-value">{userStats.admins}</div>
                          <div className="metric-label">Administrators</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="analytics-section">
          <div className="container-fluid">
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="analytics-card users-total">
                  <div className="card-icon">
                    <FaUsers />
                  </div>
                  <div className="card-content">
                    <h3 className="card-number">{userStats.total}</h3>
                    <p className="card-label">Total Registered Users</p>
                    <div className="card-trend positive">
                      <FaChartLine className="trend-icon" />
                      <span>+12.5% this month</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="analytics-card users-active">
                  <div className="card-icon">
                    <FaUserCheck />
                  </div>
                  <div className="card-content">
                    <h3 className="card-number">{userStats.active}</h3>
                    <p className="card-label">Active Users</p>
                    <div className="card-trend neutral">
                      <span>{Math.round((userStats.active / Math.max(userStats.total, 1)) * 100)}% Active Rate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="analytics-card orders-total">
                  <div className="card-icon">
                    <FaChartLine />
                  </div>
                  <div className="card-content">
                    <h3 className="card-number">{userStats.totalOrders}</h3>
                    <p className="card-label">Total Orders</p>
                    <div className="card-trend positive">
                      <span>Avg: {Math.round(userStats.totalOrders / Math.max(userStats.total, 1))} per user</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="analytics-card revenue-total">
                  <div className="card-icon">
                    <FaChartLine />
                  </div>
                  <div className="card-content">
                    <h3 className="card-number">${userStats.totalRevenue.toFixed(0)}</h3>
                    <p className="card-label">Total Revenue</p>
                    <div className="card-trend positive">
                      <span>Avg: ${Math.round(userStats.totalRevenue / Math.max(userStats.total, 1))} per user</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Control Panel */}
        <div className="control-panel-section">
          <div className="container-fluid">
            <div className="control-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <FaUserCog className="me-2" />
                  User Operations Center
                </h2>
                <div className="panel-actions">
                  <button
                    className="btn-professional btn-primary"
                    onClick={openCreateUserModal}
                  >
                    <FaUserPlus className="me-2" />
                    Create New User
                  </button>
                  <button
                    className="btn-professional btn-secondary"
                    onClick={refreshUsers}
                  >
                    <FaSync className="me-2" />
                    Refresh Data
                  </button>
                  <button
                    className="btn-professional btn-outline"
                    onClick={exportUsers}
                  >
                    <FaFileExport className="me-2" />
                    Export Users
                  </button>
                </div>
              </div>

              <div className="panel-filters">
                <div className="row g-3">
                  <div className="col-lg-4 col-md-6">
                    <div className="search-group">
                      <FaSearch className="search-icon" />
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <select
                      className="filter-select"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Administrators</option>
                      <option value="user">Regular Users</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <select
                      className="filter-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <select
                      className="filter-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="email">Sort by Email</option>
                      <option value="role">Sort by Role</option>
                      <option value="created">Sort by Created</option>
                      <option value="orders">Sort by Orders</option>
                      <option value="spent">Sort by Revenue</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <button
                      className="sort-toggle"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                      {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Users Table */}
        <div className="users-table-section">
          <div className="container-fluid">
            <div className="professional-table-container">
              <div className="table-header">
                <h3 className="table-title">
                  User Directory ({filteredUsers.length} users)
                </h3>
                <div className="table-info">
                  Showing {filteredUsers.length} of {users.length} total users
                </div>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="table-wrapper">
                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th>User Profile</th>
                        <th>Contact Information</th>
                        <th>Access Level</th>
                        <th>Account Status</th>
                        <th>Account Details</th>
                        <th>Activity Summary</th>
                        <th>Management Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="user-row">
                          <td>
                            <div className="user-profile">
                              <div className="user-avatar">
                                {user.imageUrl ? (
                                  <img src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                                ) : (
                                  <div className="avatar-placeholder">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="user-info">
                                <div className="user-name">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="user-id">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="contact-info">
                              <div className="email">
                                <FaEnvelope className="me-2" />
                                {user.email}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="role-management">
                              {getRoleBadge(user.role)}
                              <select
                                className="role-selector"
                                value={user.role}
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                              >
                                <option value="user">Regular User</option>
                                <option value="admin">Administrator</option>
                              </select>
                            </div>
                          </td>

                          <td>
                            <div className="status-management">
                              {getStatusBadge(user.status)}
                              <select
                                className="status-selector"
                                value={user.status}
                                onChange={(e) => updateUserStatus(user.id, e.target.value)}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                              </select>
                            </div>
                          </td>

                          <td>
                            <div className="account-details">
                              <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <span>Created: {format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
                              </div>
                              <div className="detail-item">
                                <FaClock className="detail-icon" />
                                <span>
                                  Last Login: {user.lastLogin 
                                    ? format(new Date(user.lastLogin), "MMM dd, yyyy") 
                                    : "Never"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="activity-summary">
                              <div className="activity-metric">
                                <FaShoppingCart className="metric-icon" />
                                <span className="metric-value">{user.orders}</span>
                                <span className="metric-label">Orders</span>
                              </div>
                              <div className="activity-metric">
                                <FaChartLine className="metric-icon" />
                                <span className="metric-value">${user.totalSpent.toFixed(0)}</span>
                                <span className="metric-label">Revenue</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view"
                                title="View User Details"
                                onClick={() => viewUserDetails(user)}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit"
                                title="Edit User"
                                onClick={() => openEditUserModal(user)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete"
                                title="Delete User"
                                onClick={() => deleteUser(user.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaUsers />
                  </div>
                  <h3>No Users Found</h3>
                  <p>No users match your current search criteria. Try adjusting your filters or search terms.</p>
                  <button
                    className="btn-professional btn-primary"
                    onClick={() => {
                      setFilterRole("all");
                      setFilterStatus("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          user={editingUser}
          onUserSaved={handleUserSaved}
        />
      )}

      {/* Professional Styling */}
      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
        }

        .loading-content {
          text-align: center;
          color: #4a5568;
        }

        .loading-spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: pulse 2s infinite;
        }

        .spinner-icon {
          font-size: 2rem;
          color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .admin-users-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admin-header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 0;
          position: relative;
          overflow: hidden;
        }

        .admin-header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }

        .professional-header {
          position: relative;
          z-index: 2;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .header-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-main-icon {
          font-size: 2.5rem;
          color: white;
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(45deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0.5rem 0 0 0;
          font-weight: 400;
        }

        .header-metrics {
          display: flex;
          gap: 1rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          min-width: 120px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .metric-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 0.25rem;
        }

        .analytics-section {
          padding: 2rem 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .analytics-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .analytics-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .analytics-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-accent);
        }

        .analytics-card.users-total {
          --card-accent: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .analytics-card.users-active {
          --card-accent: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
        }

        .analytics-card.orders-total {
          --card-accent: linear-gradient(135deg, #ff7b7b 0%, #ffa726 100%);
        }

        .analytics-card.revenue-total {
          --card-accent: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          background: var(--card-accent);
          margin-bottom: 1rem;
        }

        .card-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0.5rem 0;
        }

        .card-label {
          font-size: 1rem;
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .card-trend {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .card-trend.positive {
          color: #38a169;
        }

        .card-trend.neutral {
          color: #4299e1;
        }

        .trend-icon {
          font-size: 0.75rem;
        }

        .control-panel-section {
          padding: 2rem 0;
          background: white;
        }

        .control-panel {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .panel-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .panel-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-professional {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .btn-professional.btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-professional.btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .btn-professional.btn-secondary {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
          color: white;
        }

        .btn-professional.btn-outline {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-professional.btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .panel-filters {
          padding: 2rem;
        }

        .search-group {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .sort-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
          width: 100%;
          justify-content: center;
        }

        .sort-toggle:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .users-table-section {
          padding: 0 0 2rem 0;
        }

        .professional-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .table-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .table-info {
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .professional-table {
          width: 100%;
          border-collapse: collapse;
        }

        .professional-table thead th {
          background: #f8fafc;
          padding: 1.5rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }

        .professional-table tbody td {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .user-row:hover {
          background: #f8fafc;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          overflow: hidden;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 1rem;
        }

        .user-id {
          font-size: 0.75rem;
          color: #a0aec0;
          margin-top: 0.25rem;
        }

        .contact-info .email {
          display: flex;
          align-items: center;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .role-management,
        .status-management {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .role-selector,
        .status-selector {
          padding: 0.375rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.75rem;
          background: white;
        }

        .account-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #4a5568;
        }

        .detail-icon {
          color: #a0aec0;
          width: 12px;
        }

        .activity-summary {
          display: flex;
          gap: 1rem;
        }

        .activity-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .metric-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .metric-value {
          font-weight: 600;
          font-size: 0.875rem;
          color: #2d3748;
        }

        .metric-label {
          font-size: 0.625rem;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all 0.3s ease;
        }

        .action-btn.view {
          background: #4299e1;
          color: white;
        }

        .action-btn.view:hover {
          background: #3182ce;
          transform: scale(1.1);
        }

        .action-btn.edit {
          background: #ed8936;
          color: white;
        }

        .action-btn.edit:hover {
          background: #dd6b20;
          transform: scale(1.1);
        }

        .action-btn.delete {
          background: #e53e3e;
          color: white;
        }

        .action-btn.delete:hover {
          background: #c53030;
          transform: scale(1.1);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        .empty-state p {
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .header-metrics {
            flex-wrap: wrap;
            justify-content: center;
          }

          .panel-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .panel-actions {
            flex-wrap: wrap;
            justify-content: center;
          }

          .table-wrapper {
            font-size: 0.875rem;
          }

          .activity-summary {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminUsersPageProfessional;
