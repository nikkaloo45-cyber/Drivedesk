import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>DriveDesk - Home</h1>} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

