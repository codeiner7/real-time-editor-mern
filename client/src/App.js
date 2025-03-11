import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Editor from './components/Editor';
import { AuthProvider } from './components/AuthContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
