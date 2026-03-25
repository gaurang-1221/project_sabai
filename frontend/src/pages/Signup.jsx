import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(email, password, fullName);
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      if (!err.response) {
        setError("Network error. Please check your internet connection and ensure the backend is running.");
      } else {
        setError(err.response.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-purple-100 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200 -rotate-3">
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">Join our e-commerce community</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-fade-in">
              <AlertCircle size={20} className="shrink-0" />
              <span className="text-sm font-bold leading-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-black py-4 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-purple-100 hover:shadow-purple-200 active:scale-[0.98] mt-4"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <span>Create Account</span>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center relative z-10">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-black hover:text-purple-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
