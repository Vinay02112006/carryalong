import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Parcels from './pages/Parcels';
import SendParcel from './pages/SendParcel';
import ParcelDetails from './pages/ParcelDetails';
import Travel from './pages/Travel';
import PostTravel from './pages/PostTravel';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parcels"
        element={
          <ProtectedRoute>
            <Parcels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parcels/send"
        element={
          <ProtectedRoute>
            <SendParcel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parcels/:id"
        element={
          <ProtectedRoute>
            <ParcelDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/travel"
        element={
          <ProtectedRoute>
            <Travel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/travel/post"
        element={
          <ProtectedRoute>
            <PostTravel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
