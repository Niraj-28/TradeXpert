import { useState, useEffect } from "react";
import {
  Mail, Phone, Shield, KeyRound, User, Edit2, Check, X,
  Wallet, Briefcase, PlusCircle, Globe, Eye, EyeOff
} from "lucide-react";
import { getHoldings } from "../../services/holdingService";
import { getOrders } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile, changeUserPassword } from "../../services/authService";
import toast from "react-hot-toast";

// Helper to format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const Profile = () => {
  const { user, login } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.name || "Niraj Kotadiya",
    username: user?.username || "",
    email: user?.email || "niraj@gmail.com",
    phone: user?.phone || "",
    bio: user?.bio || "FII/DII tracking & quantitative futures virtual trader.",
    accountType: "Premium Simulator Tier"
  });

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({ ...profileData });

  // Sync edits if user context resolves after initial load
  useEffect(() => {
    if (user) {
      const data = {
        fullName: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "FII/DII tracking & quantitative futures virtual trader.",
        accountType: "Premium Simulator Tier",
        balance: user.balance !== undefined ? user.balance : 1000000
      };
      setProfileData(data);
      setEditedFields(data);
    }
  }, [user]);

  // Password reset state
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState(false);

  // Virtual statistics
  const [stats, setStats] = useState({
    marginDeployed: 0,
    ordersCount: 0,
    holdingsCount: 0
  });

  // Fetch real simulation statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const holdingsData = await getHoldings();
        const holdingsList = holdingsData.holdings || [];
        const deployed = holdingsList.reduce((sum, h) => sum + h.quantity * h.avgPrice, 0);

        const ordersData = await getOrders();
        const ordersList = ordersData.orders || [];

        setStats({
          marginDeployed: deployed,
          ordersCount: ordersList.length,
          holdingsCount: holdingsList.length
        });

        // Fetch latest profile details (including balance) and sync
        const profile = await getUserProfile();
        login(profile);
      } catch (error) {
        console.error("Failed to load profile metrics:", error);
      }
    };
    loadStats();
  }, []);

  // Save profile edits to database
  const handleSaveProfile = async () => {
    if (!editedFields.fullName.trim()) {
      toast.error("Full Name cannot be empty!");
      return;
    }
    try {
      const payload = {
        name: editedFields.fullName,
        username: editedFields.username,
        email: editedFields.email,
        phone: editedFields.phone,
        bio: editedFields.bio,
      };
      const updated = await updateUserProfile(payload);
      
      // Update session context
      login(updated);
      setIsEditing(false);
      toast.success("Profile details updated in database successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile!");
    }
  };

  // Change Password submit handler in database
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordFields.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    
    try {
      const payload = {
        currentPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
      };
      await changeUserPassword(payload);
      toast.success("Password changed successfully in database!", { icon: "🔒" });
      setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordBox(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect current password or update failed!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        
        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profileData.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info-block">
            <div className="profile-title-action-row">
              <div className="profile-name-bio-box">
                <h1>{profileData.fullName}</h1>
                <p className="profile-title">{profileData.bio}</p>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => { setIsEditing(true); setEditedFields({ ...profileData }); }}
                  className="profile-edit-toggle-btn"
                >
                  <Edit2 size={12} /> Edit Profile
                </button>
              ) : (
                <div className="profile-action-btn-group">
                  <button 
                    onClick={handleSaveProfile}
                    className="profile-save-btn"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="profile-cancel-btn"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS GRID OR EDIT MODE FORM */}
        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-card">
              <User size={18} />
              <div>
                <span>Username</span>
                <h3>{profileData.username}</h3>
              </div>
            </div>

            <div className="detail-card">
              <Mail size={18} />
              <div>
                <span>Email Address</span>
                <h3>{profileData.email}</h3>
              </div>
            </div>

            <div className="detail-card">
              <Phone size={18} />
              <div>
                <span>Phone Number</span>
                <h3>{profileData.phone}</h3>
              </div>
            </div>

            <div className="detail-card">
              <Shield size={18} />
              <div>
                <span>Account Status</span>
                <h3>{profileData.accountType}</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-edit-form">
            <h3 className="profile-section-subtitle">Edit Personal Details</h3>
            <div className="profile-form-grid">
              <div className="form-field-group">
                <label className="field-label-small">Full Name</label>
                <input 
                  type="text"
                  value={editedFields.fullName}
                  onChange={(e) => setEditedFields({ ...editedFields, fullName: e.target.value })}
                  className="profile-input"
                />
              </div>
              <div className="form-field-group">
                <label className="field-label-small">Username</label>
                <input 
                  type="text"
                  value={editedFields.username}
                  onChange={(e) => setEditedFields({ ...editedFields, username: e.target.value })}
                  className="profile-input"
                />
              </div>
              <div className="form-field-group">
                <label className="field-label-small">Email Address</label>
                <input 
                  type="email"
                  value={editedFields.email}
                  onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })}
                  className="profile-input"
                />
              </div>
              <div className="form-field-group">
                <label className="field-label-small">Phone Number</label>
                <input 
                  type="text"
                  value={editedFields.phone}
                  onChange={(e) => setEditedFields({ ...editedFields, phone: e.target.value })}
                  className="profile-input"
                />
              </div>
              <div className="form-field-group span-2">
                <label className="field-label-small">Bio / Profile Description</label>
                <textarea
                  value={editedFields.bio}
                  onChange={(e) => setEditedFields({ ...editedFields, bio: e.target.value })}
                  className="profile-textarea"
                />
              </div>
            </div>
          </div>
        )}

        {/* METRICS / VIRTUAL LIMITS PANEL */}
        <div className="profile-metrics-panel">
          <h2 className="profile-section-subtitle border-bottom">Virtual Simulator Portfolio Summary</h2>
          <div className="profile-metrics-grid">
            
            <div className="profile-metric-card">
              <div className="profile-metric-icon emerald">
                <Wallet size={20} />
              </div>
              <div className="profile-metric-info">
                <span className="metric-label">Total Balance</span>
                <strong className="metric-val">{formatINR(profileData.balance ?? 1000000)}</strong>
              </div>
            </div>

            <div className="profile-metric-card">
              <div className="profile-metric-icon blue">
                <Briefcase size={20} />
              </div>
              <div className="profile-metric-info">
                <span className="metric-label">Active Margins</span>
                <strong className="metric-val">{formatINR(stats.marginDeployed)}</strong>
              </div>
            </div>

            <div className="profile-metric-card">
              <div className="profile-metric-icon amber">
                <PlusCircle size={20} />
              </div>
              <div className="profile-metric-info">
                <span className="metric-label">Holdings Count</span>
                <strong className="metric-val">{stats.holdingsCount} Positions</strong>
              </div>
            </div>

            <div className="profile-metric-card">
              <div className="profile-metric-icon purple">
                <Globe size={20} />
              </div>
              <div className="profile-metric-info">
                <span className="metric-label">Trades Recorded</span>
                <strong className="metric-val">{stats.ordersCount} Orders</strong>
              </div>
            </div>

          </div>
        </div>

        {/* CHANGE PASSWORD COLLAPSE BOX */}
        <div className="change-password-accordion">
          <div 
            onClick={() => setShowPasswordBox(!showPasswordBox)}
            className="change-password-header-row"
          >
            <div className="accordion-title-block">
              <KeyRound size={20} className="key-icon" />
              <div>
                <h3>Change Password</h3>
                <p>Update account access password securely</p>
              </div>
            </div>
            <button className="accordion-toggle-indicator">
              {showPasswordBox ? "Close Form" : "Open Form"}
            </button>
          </div>

          {showPasswordBox && (
            <form onSubmit={handleResetPassword} className="profile-password-form">
              <div className="profile-form-grid">
                <div className="form-field-group relative-position">
                  <label className="field-label-small">Current Password</label>
                  <input 
                    type={showPass ? "text" : "password"}
                    value={passwordFields.currentPassword}
                    onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })}
                    className="profile-input input-with-eye"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="password-eye-btn"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <div className="form-field-group">
                  <label className="field-label-small">New Password</label>
                  <input 
                    type="password"
                    value={passwordFields.newPassword}
                    onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
                    className="profile-input"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label-small">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwordFields.confirmPassword}
                    onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })}
                    className="profile-input"
                    required
                  />
                </div>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="profile-submit-btn">
                  Confirm Reset
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;