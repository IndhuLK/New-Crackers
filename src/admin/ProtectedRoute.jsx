import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
}
