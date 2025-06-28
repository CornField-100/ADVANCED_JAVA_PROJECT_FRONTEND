import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, getCurrentUser } from "../utils/auth";
import { BASE_URL } from "../utils/api";
import { testBackendConnection } from "../utils/backendTest";
import { toast } from "react-toastify";
import { format } from "date-fns";
import UserModal from "../components/UserModal";
import BackendDebugger from "../components/BackendDebugger";
import BackendStatusChecker from "../components/BackendStatusChecker";
import "../styles/AnalyticsDashboard.css";
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
  FaCheckSquare,
  FaSquare,
  FaUserTimes,
  FaUserMinus,
  FaBell,
  FaExclamationTriangle,
  FaInfoCircle,
  FaStar,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaMapMarkerAlt,
  FaWifi,
  FaDatabase,
  FaServer,
  FaCloud,
  FaLock,
  FaUnlockAlt,
} from "react-icons/fa";

const AdminUsersPage = () => {
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
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsersToday: 0,
    userGrowthRate: 0,
    avgSessionTime: "0m",
    topCountries: [],
    deviceTypes: { desktop: 0, mobile: 0, tablet: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    testing: false,
    lastChecked: null,
    error: null
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [serverFilters, setServerFilters] = useState({
    search: "",
    role: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Test backend connectivity first, then load users
  useEffect(() => {
    const initializeAdminPage = async () => {
      try {
        setLoading(true);
        setBackendStatus(prev => ({ ...prev, testing: true }));
        
        // First, test backend connectivity
        console.log("🔍 Testing backend connection...");
        const connectionTest = await testBackendConnection();
        
        if (!connectionTest.success) {
          setBackendStatus({
            connected: false,
            testing: false,
            lastChecked: new Date(),
            error: connectionTest.error
          });
          
          toast.error(
            <div>
              <div className="fw-bold">🚫 Backend Unreachable</div>
              <div className="small">Error: {connectionTest.error}</div>
              <div className="small mt-1">
                <strong>Troubleshooting:</strong>
                <br />• Check if backend server is running
                <br />• Verify BASE_URL: {BASE_URL}
                <br />• Check CORS configuration
                <br />• Check network connectivity
              </div>
            </div>
          );
          
          setUsers([]);
          setLoading(false);
          return;
        }

        // Backend is reachable, now test authentication and load users
        console.log("✅ Backend connection successful, loading users...");
        setBackendStatus({
          connected: true,
          testing: false,
          lastChecked: new Date(),
          error: null
        });
        
        await loadUsers();
        
      } catch (error) {
        console.error("❌ Admin page initialization failed:", error);
        setBackendStatus({
          connected: false,
          testing: false,
          lastChecked: new Date(),
          error: error.message
        });
        
        toast.error(
          <div>
            <div className="fw-bold">❌ Initialization Failed</div>
            <div className="small">{error.message}</div>
          </div>
        );
        
        setLoading(false);
      }
    };

    initializeAdminPage();
  }, [navigate]);

  // Load users data with enhanced error handling
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("❌ No authentication token found");
        navigate("/login");
        return;
      }

      console.log("📡 Fetching users from:", `${BASE_URL}/api/users`);
      
      const response = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Users API response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("📊 Backend response received:", responseData);
        
        // Handle different response formats
        let usersArray;
        let paginationInfo = null;
        let filtersInfo = null;
        
        if (Array.isArray(responseData)) {
          // Old format: direct array
          usersArray = responseData;
          console.log("📊 Users data received (array format):", usersArray.length, "users");
        } else if (responseData && Array.isArray(responseData.users)) {
          // New format: object with users array and metadata
          usersArray = responseData.users;
          paginationInfo = responseData.pagination;
          filtersInfo = responseData.filters;
          console.log("📊 Users data received (object format):", usersArray.length, "users");
          console.log("📊 Pagination info:", paginationInfo);
          console.log("📊 Filters info:", filtersInfo);
        } else {
          console.error("❌ Backend returned invalid data format:", responseData);
          throw new Error(`Backend returned invalid data format. Expected array or object with users property but got: ${JSON.stringify(responseData)}`);
        }
        
        const formattedUsers = usersArray.map((user) => ({
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
          // Enhanced user data for analytics
          loginCount: user.loginCount || 0,
          lastActiveAt: user.lastActiveAt || null,
          location: user.location || { country: "Unknown", city: "Unknown" },
          deviceInfo: user.deviceInfo || { type: "unknown", browser: "unknown" },
          verificationStatus: user.verificationStatus || "unverified",
          twoFactorEnabled: user.twoFactorEnabled || false,
          preferences: user.preferences || {},
          tags: user.tags || [],
        }));

        setUsers(formattedUsers);
        
        // Store pagination and filter info if available
        if (paginationInfo) {
          setPagination(paginationInfo);
        }
        if (filtersInfo) {
          setServerFilters(filtersInfo);
        }
        
        // Calculate enhanced system statistics
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const newUsersToday = formattedUsers.filter(user => 
          new Date(user.createdAt) >= todayStart
        ).length;
        
        const activeUsersToday = formattedUsers.filter(user => 
          user.lastActiveAt && new Date(user.lastActiveAt) >= todayStart
        ).length;
        
        // Calculate growth rate (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        
        const recentUsers = formattedUsers.filter(user => 
          new Date(user.createdAt) >= thirtyDaysAgo
        ).length;
        
        const previousPeriodUsers = formattedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created >= sixtyDaysAgo && created < thirtyDaysAgo;
        }).length;
        
        const growthRate = previousPeriodUsers > 0 
          ? Math.round(((recentUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
          : 100;

        // Device type distribution
        const deviceTypes = formattedUsers.reduce((acc, user) => {
          const deviceType = user.deviceInfo?.type || "unknown";
          acc[deviceType] = (acc[deviceType] || 0) + 1;
          return acc;
        }, { desktop: 0, mobile: 0, tablet: 0, unknown: 0 });

        // Top countries
        const countryCount = formattedUsers.reduce((acc, user) => {
          const country = user.location?.country || "Unknown";
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});
        
        const topCountries = Object.entries(countryCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([country, count]) => ({ country, count }));

        setSystemStats({
          totalUsers: formattedUsers.length,
          newUsersToday,
          activeUsersToday,
          userGrowthRate: growthRate,
          avgSessionTime: "24m", // This would come from analytics
          topCountries,
          deviceTypes
        });

        // Generate recent activity feed
        const activities = [
          ...formattedUsers.slice(0, 3).map(user => ({
            id: Date.now() + Math.random(),
            type: "user_registered",
            user: `${user.firstName} ${user.lastName}`,
            timestamp: user.createdAt,
            description: `New user registered`,
            icon: <FaUserPlus />,
            color: "success"
          })),
          {
            id: Date.now() + Math.random(),
            type: "system_update",
            user: "System",
            timestamp: new Date().toISOString(),
            description: `User data refreshed - ${formattedUsers.length} users loaded`,
            icon: <FaDatabase />,
            color: "info"
          }
        ];

        setRecentActivity(activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        
        toast.success(
          <div>
            <div className="fw-bold">✅ System Ready</div>
            <div className="small">
              Loaded {formattedUsers.length} users • {newUsersToday} new today
              {paginationInfo && paginationInfo.totalUsers !== formattedUsers.length && (
                <span> • {paginationInfo.totalUsers} total in database</span>
              )}
            </div>
          </div>
        );
        
      } else if (response.status === 401) {
        console.log("❌ Authentication failed - redirecting to login");
        toast.error("❌ Authentication failed - Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (response.status === 403) {
        console.log("❌ Access forbidden - insufficient permissions");
        toast.error("❌ Access denied - Admin privileges required");
        navigate("/");
      } else if (response.status === 404) {
        console.log("❌ Users API endpoint not found");
        toast.error(
          <div>
            <div className="fw-bold">❌ API Endpoint Missing</div>
            <div className="small">The backend server is running but missing the /api/users endpoint</div>
            <div className="small mt-1">
              <strong>Backend URL:</strong> {BASE_URL}
              <br />
              <strong>Full endpoint:</strong> {BASE_URL}/api/users
              <br />
              <strong>Status:</strong> 404 Not Found
            </div>
            <div className="small mt-2">
              <strong>Solution:</strong> Add the users endpoint to your backend server
            </div>
          </div>
        );
        
        // Show backend debugging info
        setBackendStatus({
          connected: true, // Server is responding
          testing: false,
          lastChecked: new Date(),
          error: "Missing /api/users endpoint in backend"
        });
        
        // Display helpful information
        console.log("🔧 BACKEND FIX NEEDED:");
        console.log("Your backend server is running but missing the /api/users endpoint.");
        console.log("Add this to your backend:");
        console.log(`
// Add this to your backend server (e.g., app.js, server.js):

// GET all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Fetch users from your database
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST create new user (admin only)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { firstName, lastName, email, password, role, status } = req.body;
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: status || 'active'
    });
    
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// PATCH update user (admin only)
app.patch('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE user (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});
        `);
        
        // Set empty users to prevent crash
        setUsers([]);
      } else if (response.status === 403) {
        console.log("❌ Access forbidden - insufficient permissions");
        toast.error("❌ Access denied - Admin privileges required");
        navigate("/");
      } else if (response.status === 404) {
        console.log("❌ Users API endpoint not found");
        toast.error(
          <div>
            <div className="fw-bold">❌ API Endpoint Missing</div>
            <div className="small">The backend server is running but missing the /api/users endpoint</div>
            <div className="small mt-1">
              <strong>Backend URL:</strong> {BASE_URL}
              <br />
              <strong>Full endpoint:</strong> {BASE_URL}/api/users
              <br />
              <strong>Status:</strong> 404 Not Found
            </div>
            <div className="small mt-2">
              <strong>Solution:</strong> Add the users endpoint to your backend server
            </div>
          </div>
        );
        
        // Show backend debugging info
        setBackendStatus({
          connected: true, // Server is responding
          testing: false,
          lastChecked: new Date(),
          error: "Missing /api/users endpoint in backend"
        });
        
        // Display helpful information
        console.log("🔧 BACKEND FIX NEEDED:");
        console.log("Your backend server is running but missing the /api/users endpoint.");
        console.log("Add this to your backend:");
        console.log(`
// Add this to your backend server (e.g., app.js, server.js):

// GET all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Fetch users from your database
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST create new user (admin only)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { firstName, lastName, email, password, role, status } = req.body;
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: status || 'active'
    });
    
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// PATCH update user (admin only)
app.patch('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE user (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});
        `);
        
        // Set empty users to prevent crash
        setUsers([]);
      } else if (response.status === 403) {
        console.log("❌ Access forbidden - insufficient permissions");
        toast.error("❌ Access denied - Admin privileges required");
        navigate("/");
      } else {
        const errorText = await response.text();
        console.log("❌ Backend error:", response.status, errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
      
    } catch (error) {
      console.error("❌ Error loading users:", error);
      
      // Provide specific error messages based on error type
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error(
          <div>
            <div className="fw-bold">🚫 Network Connection Failed</div>
            <div className="small">Cannot reach backend server</div>
            <div className="small mt-1">
              <strong>Check:</strong>
              <br />• Backend server is running
              <br />• URL: {BASE_URL}
              <br />• Network connectivity
              <br />• CORS configuration
            </div>
          </div>
        );
      } else {
        toast.error(
          <div>
            <div className="fw-bold">❌ Error Loading Users</div>
            <div className="small">{error.message}</div>
          </div>
        );
      }
      
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced refresh with connection testing and loading feedback
  const refreshUsers = async () => {
    const refreshToast = toast.loading("🔄 Testing connection and synchronizing user data...");
    
    try {
      // First test backend connectivity
      const connectionTest = await testBackendConnection();
      
      if (!connectionTest.success) {
        toast.update(refreshToast, {
          render: (
            <div>
              <div className="fw-bold">🚫 Backend Unreachable</div>
              <div className="small">Error: {connectionTest.error}</div>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        
        setBackendStatus({
          connected: false,
          testing: false,
          lastChecked: new Date(),
          error: connectionTest.error
        });
        return;
      }

      // Backend is reachable, update status
      setBackendStatus({
        connected: true,
        testing: false,
        lastChecked: new Date(),
        error: null
      });

      // Now fetch users
      const token = localStorage.getItem("token");
      console.log("🔄 Refreshing users data...");
      
      const response = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🔄 Refresh response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("🔄 Refresh response data:", responseData);
        
        // Handle different response formats
        let usersArray;
        if (Array.isArray(responseData)) {
          // Old format: direct array
          usersArray = responseData;
        } else if (responseData && Array.isArray(responseData.users)) {
          // New format: object with users array and metadata
          usersArray = responseData.users;
        } else {
          throw new Error("Invalid response format from backend");
        }
        
        console.log("🔄 Refreshed users count:", usersArray.length);
        
        const formattedUsers = usersArray.map((user) => ({
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
          loginCount: user.loginCount || 0,
          lastActiveAt: user.lastActiveAt || null,
          location: user.location || { country: "Unknown", city: "Unknown" },
          deviceInfo: user.deviceInfo || { type: "unknown", browser: "unknown" },
          verificationStatus: user.verificationStatus || "unverified",
          twoFactorEnabled: user.twoFactorEnabled || false,
        }));

        setUsers(formattedUsers);
        toast.dismiss(refreshToast);
        toast.success(
          <div>
            <div className="fw-bold">✅ Data Synchronized</div>
            <div className="small">Updated {formattedUsers.length} user records</div>
          </div>
        );
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      toast.dismiss(refreshToast);
      toast.error(
        <div>
          <div className="fw-bold">❌ Sync Failed</div>
          <div className="small">Using cached data</div>
        </div>
      );
    }
  };

  // Enhanced user details with more information
  const viewUserDetails = (user) => {
    let formattedCreatedDate, formattedLastLogin, formattedLastActive;
    
    try {
      formattedCreatedDate = format(new Date(user.createdAt), "PPpp");
    } catch (e) {
      formattedCreatedDate = "Invalid Date";
    }

    try {
      formattedLastLogin = user.lastLogin 
        ? format(new Date(user.lastLogin), "PPpp")
        : "Never logged in";
    } catch (e) {
      formattedLastLogin = "Invalid Date";
    }

    try {
      formattedLastActive = user.lastActiveAt 
        ? format(new Date(user.lastActiveAt), "PPpp")
        : "No activity recorded";
    } catch (e) {
      formattedLastActive = "Invalid Date";
    }

    const userDetails = `
🔍 COMPREHENSIVE USER PROFILE

📋 BASIC INFORMATION
• User ID: ${user.id}
• Full Name: ${user.firstName} ${user.lastName}
• Email: ${user.email}
• Role: ${user.role.toUpperCase()}
• Status: ${user.status.toUpperCase()}

🛡️ SECURITY & VERIFICATION
• Email Verified: ${user.verificationStatus === 'verified' ? '✅ Yes' : '❌ No'}
• 2FA Enabled: ${user.twoFactorEnabled ? '✅ Yes' : '❌ No'}
• Account Security: ${user.twoFactorEnabled ? 'High' : 'Standard'}

📅 ACCOUNT TIMELINE
• Account Created: ${formattedCreatedDate}
• Last Login: ${formattedLastLogin}
• Last Activity: ${formattedLastActive}
• Login Count: ${user.loginCount || 0} sessions

📊 ENGAGEMENT METRICS
• Total Orders: ${user.orders}
• Total Spent: $${user.totalSpent.toFixed(2)}
• Customer Value: ${user.totalSpent > 1000 ? 'High' : user.totalSpent > 100 ? 'Medium' : 'Low'}

🌍 LOCATION & DEVICE
• Country: ${user.location?.country || 'Unknown'}
• City: ${user.location?.city || 'Unknown'}
• Primary Device: ${user.deviceInfo?.type || 'Unknown'}
• Browser: ${user.deviceInfo?.browser || 'Unknown'}

${user.imageUrl ? `🖼️ Profile Image: Available` : "📷 No profile image"}
${user.tags?.length ? `🏷️ Tags: ${user.tags.join(', ')}` : "🏷️ No tags assigned"}
    `;

    // Create a custom modal for better user details display
    const detailModal = document.createElement('div');
    detailModal.innerHTML = `
      <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="fas fa-user-circle me-2"></i>
                User Profile - ${user.firstName} ${user.lastName}
              </h5>
              <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
            </div>
            <div class="modal-body">
              <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 0.9rem; line-height: 1.4;">${userDetails}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
              <button type="button" class="btn btn-primary" onclick="navigator.clipboard.writeText(\`${userDetails.replace(/`/g, '\\`')}\`); alert('User details copied to clipboard!')">Copy Details</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(detailModal);
  };

  // Bulk operations for multiple users
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select users first");
      return;
    }

    const confirmed = window.confirm(
      `Update status to "${newStatus}" for ${selectedUsers.length} selected users?`
    );

    if (!confirmed) return;

    const loadingToast = toast.loading(`Updating ${selectedUsers.length} users...`);

    try {
      const token = localStorage.getItem("token");
      const promises = selectedUsers.map(userId =>
        fetch(`${BASE_URL}/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }),
        })
      );

      await Promise.all(promises);

      setUsers(prev =>
        prev.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, status: newStatus }
            : user
        )
      );

      toast.dismiss(loadingToast);
      toast.success(`✅ Updated ${selectedUsers.length} users to ${newStatus}`);
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("❌ Bulk update failed");
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    const currentUser = getCurrentUser();
    
    // Prevent user from changing their own role
    if (currentUser.id === userId) {
      toast.error("You cannot change your own role!");
      return;
    }

    const loadingToast = toast.loading(`Updating user role to ${newRole}...`);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
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

      // Update local state
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
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
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

      // Update local state
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
    
    // Prevent user from deleting themselves
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
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete user`
        );
      }

      // Remove from local state
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
      // Update existing user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === savedUser.id ? { ...user, ...savedUser } : user
        )
      );
    } else {
      // Add new user
      setUsers((prevUsers) => [savedUser, ...prevUsers]);
    }
    refreshUsers(); // Refresh to get updated data
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

  // Export users to CSV
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
      country: user.location?.country || "Unknown",
      device: user.deviceInfo?.type || "Unknown",
    }));

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("📄 User data exported successfully!");
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        class: "bg-danger",
        icon: <FaCrown />,
        text: "Administrator",
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
          <h3>Loading Enterprise User Management</h3>
          <p>Initializing comprehensive dashboard...</p>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-users-container">
        {/* Executive Header Section */}
        <div className="admin-header-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="professional-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon-wrapper">
                        <FaUsers className="header-main-icon" />
                        <div className="icon-pulse"></div>
                      </div>
                      <div className="header-text">
                        <h1 className="header-title">Enterprise User Management</h1>
                        <p className="header-subtitle">
                          Advanced user administration, analytics, and security management platform
                        </p>
                        <div className="header-badges">
                          <span className={`status-badge ${backendStatus.connected ? 'online' : 'offline'}`}>
                            <FaDatabase className="me-1" />
                            {backendStatus.connected ? 'Backend Connected' : 'Backend Offline'}
                          </span>
                          <span className="status-badge realtime">
                            <FaWifi className="me-1" />
                            Real-time Sync
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="header-right">
                      <div className="header-metrics">
                        <div className="metric-card primary">
                          <div className="metric-icon"><FaUsers /></div>
                          <div className="metric-content">
                            <div className="metric-value">{userStats.total}</div>
                            <div className="metric-label">Total Users</div>
                          </div>
                        </div>
                        <div className="metric-card success">
                          <div className="metric-icon"><FaUserCheck /></div>
                          <div className="metric-content">
                            <div className="metric-value">{userStats.active}</div>
                            <div className="metric-label">Active</div>
                          </div>
                        </div>
                        <div className="metric-card warning">
                          <div className="metric-icon"><FaCrown /></div>
                          <div className="metric-content">
                            <div className="metric-value">{userStats.admins}</div>
                            <div className="metric-label">Admins</div>
                          </div>
                        </div>
                        <div className="metric-card info">
                          <div className="metric-icon"><FaChartLine /></div>
                          <div className="metric-content">
                            <div className="metric-value">{systemStats.newUsersToday}</div>
                            <div className="metric-label">New Today</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Status & Error Recovery Panel */}
        {(!backendStatus.connected || backendStatus.error) && (
          <div className="backend-status-panel">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className={`status-alert ${!backendStatus.connected ? 'error' : 'warning'}`}>
                    <div className="status-content">
                      <div className="status-icon">
                        {backendStatus.testing ? (
                          <FaSync className="fa-spin" />
                        ) : !backendStatus.connected ? (
                          <FaExclamationTriangle />
                        ) : (
                          <FaInfoCircle />
                        )}
                      </div>
                      <div className="status-text">
                        <h4 className="status-title">
                          {backendStatus.testing ? (
                            "Testing Backend Connection..."
                          ) : !backendStatus.connected ? (
                            "Backend Connection Failed"
                          ) : (
                            "Backend Status Warning"
                          )}
                        </h4>
                        <p className="status-message">
                          {backendStatus.testing ? (
                            "Verifying server connectivity and API endpoints..."
                          ) : backendStatus.error ? (
                            `Error: ${backendStatus.error}`
                          ) : (
                            "Backend connection unstable or intermittent"
                          )}
                        </p>
                        {!backendStatus.connected && (
                          <div className="troubleshooting-info">
                            <h5>📋 Troubleshooting Steps:</h5>
                            <ul>
                              <li>✅ Check if backend server is running</li>
                              <li>✅ Verify API URL: <code>{BASE_URL}</code></li>
                              <li>✅ Check network connectivity</li>
                              <li>✅ Verify CORS configuration on backend</li>
                              <li>✅ Check authentication token validity</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="status-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={refreshUsers}
                          disabled={backendStatus.testing}
                        >
                          <FaSync className={backendStatus.testing ? "fa-spin" : ""} />
                          {backendStatus.testing ? "Testing..." : "Retry Connection"}
                        </button>
                        {backendStatus.lastChecked && (
                          <small className="text-muted ms-2">
                            Last checked: {format(backendStatus.lastChecked, "HH:mm:ss")}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <BackendStatusChecker />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Dashboard */}
        <div className="analytics-section">
          <div className="container-fluid">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="analytics-card users-total">
                      <div className="card-header">
                        <div className="card-icon">
                          <FaUsers />
                        </div>
                        <div className="card-meta">
                          <span className="card-trend positive">
                            +{systemStats.userGrowthRate}%
                          </span>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-number">{userStats.total}</h3>
                        <p className="card-label">Registered Users</p>
                        <div className="card-description">
                          <FaChartLine className="trend-icon" />
                          <span>Growing {systemStats.userGrowthRate}% monthly</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="analytics-card users-active">
                      <div className="card-header">
                        <div className="card-icon">
                          <FaUserCheck />
                        </div>
                        <div className="card-meta">
                          <span className="engagement-rate">
                            {Math.round((userStats.active / Math.max(userStats.total, 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-number">{userStats.active}</h3>
                        <p className="card-label">Active Users</p>
                        <div className="card-description">
                          <FaClock className="trend-icon" />
                          <span>Avg session: {systemStats.avgSessionTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="analytics-card orders-total">
                      <div className="card-header">
                        <div className="card-icon">
                          <FaShoppingCart />
                        </div>
                        <div className="card-meta">
                          <span className="avg-indicator">
                            Avg: {Math.round(userStats.totalOrders / Math.max(userStats.total, 1))}
                          </span>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-number">{userStats.totalOrders}</h3>
                        <p className="card-label">Total Orders</p>
                        <div className="card-description">
                          <FaChartLine className="trend-icon" />
                          <span>Orders per user ratio</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="analytics-card revenue-total">
                      <div className="card-header">
                        <div className="card-icon">
                          <FaChartLine />
                        </div>
                        <div className="card-meta">
                          <span className="revenue-avg">
                            ${Math.round(userStats.totalRevenue / Math.max(userStats.total, 1))}
                          </span>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-number">${userStats.totalRevenue.toFixed(0)}</h3>
                        <p className="card-label">Total Revenue</p>
                        <div className="card-description">
                          <FaChartLine className="trend-icon" />
                          <span>Average per user</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="activity-panel">
                  <div className="panel-header">
                    <h4>
                      <FaHistory className="me-2" />
                      Recent Activity
                    </h4>
                    <span className="activity-count">{recentActivity.length} items</span>
                  </div>
                  <div className="activity-feed">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className={`activity-item ${activity.color}`}>
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                          <div className="activity-description">{activity.description}</div>
                          <div className="activity-meta">
                            <span className="activity-user">{activity.user}</span>
                            <span className="activity-time">
                              {format(new Date(activity.timestamp), "MMM dd, HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Control Panel */}
        <div className="control-panel-section">
          <div className="container-fluid">
            <div className="control-panel">
              <div className="panel-header">
                <div className="panel-title-section">
                  <h2 className="panel-title">
                    <FaUserCog className="me-2" />
                    User Operations Command Center
                  </h2>
                  <p className="panel-description">
                    Complete user lifecycle management with advanced controls
                  </p>
                </div>
                <div className="panel-actions">
                  <button
                    className="btn-professional btn-primary"
                    onClick={openCreateUserModal}
                  >
                    <FaUserPlus className="me-2" />
                    Create User
                  </button>
                  <button
                    className="btn-professional btn-secondary"
                    onClick={refreshUsers}
                  >
                    <FaSync className="me-2" />
                    Sync Data
                  </button>
                  <button
                    className="btn-professional btn-outline"
                    onClick={exportUsers}
                  >
                    <FaFileExport className="me-2" />
                    Export
                  </button>
                  {selectedUsers.length > 0 && (
                    <div className="bulk-actions">
                      <button
                        className="btn-professional btn-warning"
                        onClick={() => setShowBulkActions(!showBulkActions)}
                      >
                        <FaCheckSquare className="me-2" />
                        Bulk Actions ({selectedUsers.length})
                      </button>
                      {showBulkActions && (
                        <div className="bulk-dropdown">
                          <button onClick={() => bulkUpdateStatus('active')}>
                            <FaUserCheck className="me-2" />
                            Activate Selected
                          </button>
                          <button onClick={() => bulkUpdateStatus('inactive')}>
                            <FaBan className="me-2" />
                            Deactivate Selected
                          </button>
                          <button onClick={clearSelection}>
                            <FaUserTimes className="me-2" />
                            Clear Selection
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                      {searchTerm && (
                        <button 
                          className="clear-search"
                          onClick={() => setSearchTerm("")}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <select
                      className="filter-select"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">👑 Administrators</option>
                      <option value="user">👤 Regular Users</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-3">
                    <select
                      className="filter-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">✅ Active</option>
                      <option value="inactive">⏸️ Inactive</option>
                      <option value="suspended">🚫 Suspended</option>
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
                      {sortOrder === "asc" ? "A→Z" : "Z→A"}
                    </button>
                  </div>
                </div>

                {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
                  <div className="active-filters">
                    <span className="filter-label">Active Filters:</span>
                    {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
                    {filterRole !== "all" && <span className="filter-tag">Role: {filterRole}</span>}
                    {filterStatus !== "all" && <span className="filter-tag">Status: {filterStatus}</span>}
                    <button 
                      className="clear-filters"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRole("all");
                        setFilterStatus("all");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Enterprise Users Table */}
        <div className="users-table-section">
          <div className="container-fluid">
            <div className="professional-table-container">
              <div className="table-header">
                <div className="table-title-section">
                  <h3 className="table-title">
                    <FaUsers className="me-2" />
                    User Directory
                  </h3>
                  <div className="table-stats">
                    <span className="stat-item">
                      <FaEye className="me-1" />
                      Showing {filteredUsers.length} of {users.length}
                    </span>
                    <span className="stat-item">
                      <FaUserCheck className="me-1" />
                      {Math.round((userStats.active / Math.max(userStats.total, 1)) * 100)}% Active
                    </span>
                  </div>
                </div>
                <div className="table-controls">
                  <button 
                    className="table-control-btn"
                    onClick={selectedUsers.length === filteredUsers.length ? clearSelection : selectAllUsers}
                  >
                    {selectedUsers.length === filteredUsers.length ? (
                      <>
                        <FaSquare className="me-1" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <FaCheckSquare className="me-1" />
                        Select All
                      </>
                    )}
                  </button>
                </div>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="table-wrapper">
                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th className="select-column">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={selectedUsers.length === filteredUsers.length ? clearSelection : selectAllUsers}
                          />
                        </th>
                        <th>User Profile</th>
                        <th>Contact & Authentication</th>
                        <th>Access Level</th>
                        <th>Account Status</th>
                        <th>Account Timeline</th>
                        <th>Engagement Metrics</th>
                        <th>Management Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={`user-row ${selectedUsers.includes(user.id) ? 'selected' : ''}`}>
                          <td className="select-column">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </td>
                          
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
                                <div className={`status-indicator ${user.status}`}></div>
                              </div>
                              <div className="user-info">
                                <div className="user-name">
                                  {user.firstName} {user.lastName}
                                  {user.twoFactorEnabled && (
                                    <FaShieldAlt className="security-icon" title="2FA Enabled" />
                                  )}
                                </div>
                                <div className="user-meta">
                                  <span className="user-id">#{user.id.slice(-6)}</span>
                                  <span className="verification-status">
                                    {user.verificationStatus === 'verified' ? (
                                      <span className="verified">
                                        <FaShieldAlt className="me-1" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="unverified">
                                        <FaExclamationTriangle className="me-1" />
                                        Unverified
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="contact-info">
                              <div className="contact-primary">
                                <FaEnvelope className="contact-icon" />
                                <span className="email">{user.email}</span>
                              </div>
                              <div className="contact-meta">
                                <span className="location">
                                  <FaGlobe className="me-1" />
                                  {user.location?.country || 'Unknown'}
                                </span>
                                <span className="device">
                                  {user.deviceInfo?.type === 'mobile' ? <FaMobile /> : <FaDesktop />}
                                  {user.deviceInfo?.type || 'Unknown'}
                                </span>
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
                                disabled={getCurrentUser().id === user.id}
                              >
                                <option value="user">👤 Regular User</option>
                                <option value="admin">👑 Administrator</option>
                              </select>
                              {user.role === 'admin' && (
                                <div className="permission-indicator">
                                  <FaShieldAlt className="me-1" />
                                  Full Access
                                </div>
                              )}
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
                                <option value="active">✅ Active</option>
                                <option value="inactive">⏸️ Inactive</option>
                                <option value="suspended">🚫 Suspended</option>
                              </select>
                              <div className="status-meta">
                                Login count: {user.loginCount || 0}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="account-details">
                              <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <div className="detail-content">
                                  <span className="detail-label">Created</span>
                                  <span className="detail-value">
                                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                  </span>
                                </div>
                              </div>
                              <div className="detail-item">
                                <FaClock className="detail-icon" />
                                <div className="detail-content">
                                  <span className="detail-label">Last Login</span>
                                  <span className="detail-value">
                                    {user.lastLogin 
                                      ? format(new Date(user.lastLogin), "MMM dd, yyyy") 
                                      : "Never"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="activity-summary">
                              <div className="activity-metric orders">
                                <div className="metric-header">
                                  <FaShoppingCart className="metric-icon" />
                                  <span className="metric-value">{user.orders}</span>
                                </div>
                                <span className="metric-label">Orders</span>
                              </div>
                              <div className="activity-metric revenue">
                                <div className="metric-header">
                                  <FaChartLine className="metric-icon" />
                                  <span className="metric-value">${user.totalSpent.toFixed(0)}</span>
                                </div>
                                <span className="metric-label">Revenue</span>
                              </div>
                              <div className="customer-tier">
                                {user.totalSpent > 1000 ? (
                                  <span className="tier-premium">
                                    <FaStar className="me-1" />
                                    Premium
                                  </span>
                                ) : user.totalSpent > 100 ? (
                                  <span className="tier-regular">
                                    <FaUser className="me-1" />
                                    Regular
                                  </span>
                                ) : (
                                  <span className="tier-new">
                                    <FaUserPlus className="me-1" />
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view"
                                title="View Complete User Profile"
                                onClick={() => viewUserDetails(user)}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit"
                                title="Edit User Information"
                                onClick={() => openEditUserModal(user)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete"
                                title="Delete User Account"
                                onClick={() => deleteUser(user.id)}
                                disabled={getCurrentUser().id === user.id}
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
                  <div className="empty-content">
                    <div className="empty-icon">
                      <FaUsers />
                    </div>
                    <h3>No Users Found</h3>
                    <p>
                      {searchTerm || filterRole !== "all" || filterStatus !== "all" 
                        ? "No users match your current search criteria. Try adjusting your filters."
                        : "No users are currently registered in the system. Create the first user to get started."
                      }
                    </p>
                    <div className="empty-actions">
                      {searchTerm || filterRole !== "all" || filterStatus !== "all" ? (
                        <button
                          className="btn-professional btn-secondary"
                          onClick={() => {
                            setFilterRole("all");
                            setFilterStatus("all");
                            setSearchTerm("");
                          }}
                        >
                          <FaFilter className="me-2" />
                          Clear All Filters
                        </button>
                      ) : (
                        <button
                          className="btn-professional btn-primary"
                          onClick={openCreateUserModal}
                        >
                          <FaUserPlus className="me-2" />
                          Create First User
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Modal */}
      {showUserModal && (
        <UserModal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          user={editingUser}
          onUserSaved={handleUserSaved}
        />
      )}

      {/* Professional Enterprise Styling */}
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
          animation: fadeIn 0.5s ease-in;
        }

        .loading-spinner {
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: pulse 2s infinite;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .spinner-icon {
          font-size: 2.5rem;
          color: white;
          animation: spin 1s linear infinite;
        }

        .loading-progress {
          width: 200px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin: 1rem auto;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-users-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admin-header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4rem 0;
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
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-main-icon {
          font-size: 2.5rem;
          color: white;
        }

        .icon-pulse {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .header-text h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-subtitle {
          font-size: 1.2rem;
          margin: 0 0 1rem 0;
          opacity: 0.9;
          font-weight: 400;
        }

        .header-badges {
          display: flex;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .status-badge.online {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .status-badge.realtime {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        }

        .header-metrics {
          display: flex;
          gap: 1.5rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 120px;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .metric-card .metric-icon {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .metric-content {
          text-align: left;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .metric-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 0.25rem;
        }

        .analytics-section {
          padding: 3rem 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .analytics-card {
          background: white;
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .analytics-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          padding: 1.5rem 1.5rem 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .users-total .card-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .users-active .card-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .orders-total .card-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .revenue-total .card-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .card-meta {
          text-align: right;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .card-trend {
          color: #10b981;
        }

        .engagement-rate {
          color: #3b82f6;
        }

        .avg-indicator {
          color: #f59e0b;
        }

        .revenue-avg {
          color: #ef4444;
        }

        .card-content {
          padding: 1rem 1.5rem 1.5rem 1.5rem;
        }

        .card-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .card-label {
          font-size: 1rem;
          color: #6b7280;
          margin: 0.5rem 0;
          font-weight: 500;
        }

        .card-description {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .trend-icon {
          color: #10b981;
        }

        .activity-panel {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          height: 100%;
        }

        .activity-panel .panel-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-panel h4 {
          margin: 0;
          color: #374151;
          font-weight: 600;
        }

        .activity-count {
          background: #e5e7eb;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .activity-feed {
          padding: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f9fafb;
        }

        .activity-item.success {
          border-left: 3px solid #10b981;
        }

        .activity-item.info {
          border-left: 3px solid #3b82f6;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .activity-item.success .activity-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .activity-item.info .activity-icon {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .activity-content {
          flex: 1;
        }

        .activity-description {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .activity-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .control-panel-section {
          padding: 2rem 0;
        }

        .control-panel {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

        .panel-title-section {
          flex: 1;
        }

        .panel-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
        }

        .panel-description {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
        }

        .panel-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-professional {
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .btn-professional::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-professional:hover::before {
          left: 100%;
        }

        .btn-professional.btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-professional.btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .btn-professional.btn-secondary {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
        }

        .btn-professional.btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107, 114, 128, 0.6);
        }

        .btn-professional.btn-outline {
          background: white;
          color: #374151;
          border: 2px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-professional.btn-outline:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-2px);
        }

        .btn-professional.btn-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .bulk-actions {
          position: relative;
        }

        .bulk-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          min-width: 200px;
          z-index: 100;
        }

        .bulk-dropdown button {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          text-align: left;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bulk-dropdown button:hover {
          background: #f3f4f6;
        }

        .panel-filters {
          padding: 2rem;
        }

        .search-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
          z-index: 2;
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .filter-select {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .sort-toggle {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .sort-toggle:hover {
          border-color: #667eea;
          background: #f8fafc;
        }

        .active-filters {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-label {
          font-weight: 600;
          color: #374151;
        }

        .filter-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .clear-filters {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters:hover {
          background: #fecaca;
        }

        .users-table-section {
          padding: 2rem 0;
        }

        .professional-table-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

        .table-title-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .table-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .table-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .table-controls {
          display: flex;
          gap: 1rem;
        }

        .table-control-btn {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .table-control-btn:hover {
          border-color: #667eea;
          background: #f8fafc;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .professional-table {
          width: 100%;
          border-collapse: collapse;
        }

        .professional-table thead th {
          background: #f9fafb;
          padding: 1.5rem 1rem;
          text-align: left;
          font-weight: 700;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .professional-table tbody td {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: top;
        }

        .user-row {
          transition: all 0.3s ease;
        }

        .user-row:hover {
          background: #f8fafc;
        }

        .user-row.selected {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .select-column {
          width: 50px;
          text-align: center;
        }

        .select-column input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 15px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .status-indicator.active {
          background: #10b981;
        }

        .status-indicator.inactive {
          background: #f59e0b;
        }

        .status-indicator.suspended {
          background: #ef4444;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 700;
          color: #1f2937;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .security-icon {
          color: #10b981;
          font-size: 0.875rem;
        }

        .user-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .user-id {
          font-size: 0.75rem;
          color: #9ca3af;
          font-family: 'Monaco', 'Menlo', monospace;
          background: #f3f4f6;
          padding: 0.125rem 0.5rem;
          border-radius: 6px;
        }

        .verification-status .verified {
          color: #10b981;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .verification-status .unverified {
          color: #f59e0b;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-icon {
          color: #6b7280;
          flex-shrink: 0;
        }

        .email {
          color: #374151;
          font-weight: 500;
        }

        .contact-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .contact-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .role-management,
        .status-management {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .role-selector,
        .status-selector {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .role-selector:focus,
        .status-selector:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .role-selector:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .permission-indicator {
          font-size: 0.75rem;
          color: #ef4444;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .status-meta {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .account-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .detail-icon {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .activity-summary {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .metric-icon {
          color: #6b7280;
        }

        .metric-value {
          font-weight: 700;
          color: #1f2937;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .customer-tier {
          margin-top: 0.5rem;
        }

        .tier-premium {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .tier-regular {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .tier-new {
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn.view {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .action-btn.view:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .action-btn.edit {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .action-btn.edit:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .action-btn.delete {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .action-btn.delete:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .action-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #6b7280;
        }

        .empty-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 2rem;
          opacity: 0.3;
          color: #9ca3af;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .empty-state p {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .empty-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .header-content {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .header-metrics {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .admin-header-section {
            padding: 2rem 0;
          }

          .header-left {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .header-text h1 {
            font-size: 2rem;
          }

          .metric-card {
            min-width: 100px;
            padding: 1rem;
          }

          .metric-value {
            font-size: 1.5rem;
          }

          .panel-header {
            flex-direction: column;
            gap: 1rem;
          }

          .panel-actions {
            width: 100%;
            justify-content: center;
          }

          .table-header {
            flex-direction: column;
            gap: 1rem;
          }

          .table-stats {
            justify-content: center;
          }

          .professional-table {
            font-size: 0.875rem;
          }

          .professional-table th,
          .professional-table td {
            padding: 1rem 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .analytics-section {
            padding: 2rem 0;
          }

          .control-panel-section {
            padding: 1rem 0;
          }

          .users-table-section {
            padding: 1rem 0;
          }

          .professional-table th,
          .professional-table td {
            padding: 0.75rem 0.25rem;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
          }

          .avatar-placeholder {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminUsersPage;