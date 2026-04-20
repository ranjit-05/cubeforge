import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-cube">
          <div className="cube-spinner">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`face face-${i}`} />
            ))}
          </div>
        </div>
        <p>Loading CubeForge...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
