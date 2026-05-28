import {
  Mail,
  Phone,
  Shield,
  KeyRound,
  User,
} from "lucide-react";

const Profile = () => {
  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">

          <div className="profile-avatar-large">
            N
          </div>

          <div>
            <h1>Niraj Kotadiya</h1>
            <p>Professional Trader</p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="profile-details">

          <div className="detail-card">
            <User size={18} />
            <div>
              <span>Username</span>
              <h3>niraj_trader</h3>
            </div>
          </div>

          <div className="detail-card">
            <Mail size={18} />
            <div>
              <span>Email</span>
              <h3>niraj@gmail.com</h3>
            </div>
          </div>

          <div className="detail-card">
            <Phone size={18} />
            <div>
              <span>Phone</span>
              <h3>+91 9876543210</h3>
            </div>
          </div>

          <div className="detail-card">
            <Shield size={18} />
            <div>
              <span>Account Type</span>
              <h3>Premium</h3>
            </div>
          </div>

        </div>

        {/* RESET PASSWORD */}
        <div className="reset-password-box">

          <div className="reset-left">

            <KeyRound size={20} />

            <div>
              <h3>Reset Password</h3>
              <p>
                Change your account password securely
              </p>
            </div>

          </div>

          <button className="reset-btn">
            Reset Password
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;