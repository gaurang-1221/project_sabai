import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, LogOut, Edit2, Check, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null; // The ProtectedRoute handles redirecting if no user
  }

  const handleSaveName = async () => {
    try {
      setSaving(true);
      await updateProfile(editName);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 h-32 sm:h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-90"></div>
          {/* Abstract decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>
        </div>
        
        <div className="relative px-6 pb-8 sm:px-10 sm:pb-12">
          {/* Avatar Area */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-8 z-10 relative">
            <div className="flex flex-col items-center sm:items-start group">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-indigo-50 shadow-lg flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <span className="text-5xl font-extrabold text-indigo-600">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="mt-4 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user.fullName || "User"}
                </h1>
                <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-flex mt-2 items-center gap-1.5 shadow-sm">
                  <Shield size={14} />
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-gray-50/50 rounded-2xl p-6 sm:p-8 border border-gray-100 mb-8 shadow-inner">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-indigo-500" size={20} />
              Account Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between text-indigo-600 mb-2">
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span className="text-sm font-semibold text-gray-500">Full Name</span>
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => {
                        setEditName(user.fullName || "");
                        setIsEditing(true);
                      }}
                      className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="pl-8">
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your name"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={saving}
                        className="p-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                        className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900 mt-1">
                      {user.fullName || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 text-indigo-600 mb-1">
                  <Mail size={18} />
                  <span className="text-sm font-semibold text-gray-500">Email Address</span>
                </div>
                <p className="font-medium text-gray-900 mt-1 pl-8 truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all font-bold shadow-sm active:scale-95"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
