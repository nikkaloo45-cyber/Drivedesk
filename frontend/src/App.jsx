import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlarmProvider } from './contexts/AlarmContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AlarmManager from './components/alarms/AlarmManager';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AlarmProvider>
            <AlarmManager /> 
            <AppRoutes />
          </AlarmProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

