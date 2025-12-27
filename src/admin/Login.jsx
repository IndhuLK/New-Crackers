import { useState } from "react";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon }
  from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // fixed credentials
    if (email === "admin@crackers.com" && password === "123456") {
      login();
      navigate("/admin-dashboard");
    } else {
      setError("❌ Invalid Email or Password!");
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-body">

      {/* Card */}
      <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2 text-blue-950">
          🔥 Admin <span className="text-red-600">Login</span>
        </h1>
        <p className="text-center text-slate-500 mb-8">Access your dashboard</p>

        {/* ERROR MESSAGE */}
        {error && <p className="text-red-600 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        {/* Email field */}
        <div className="mb-5">
          <label className="block text-sm mb-1 text-blue-900 font-medium">Email</label>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 
          rounded-lg border border-slate-200 focus-within:ring-2
           focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <UserIcon className="w-5 text-slate-400" />
            <input
              type="email"
              placeholder="new@crackers.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none flex-1
               text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-blue-900 font-medium">Password</label>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-lg
           border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <LockClosedIcon className="w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none flex-1 
              text-slate-800 placeholder-slate-400"
            />
            <button onClick={() => setShowPassword(!showPassword)} type="button">
              {showPassword ? (
                <EyeSlashIcon className="w-5 text-slate-400 hover:text-blue-600" />
              ) : (
                <EyeIcon className="w-5 text-slate-400 hover:text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 py-3 
          rounded-lg text-white font-bold text-lg transition-all shadow-md
           hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-slate-400">
          © {new Date().getFullYear()} Crackers Admin — Secure Login
        </p>
      </div>
    </div>
  );
}
