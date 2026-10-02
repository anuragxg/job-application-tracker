import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import Board from './components/Board';
import ApplicationDetail from './components/ApplicationDetail';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import './App.css';

// VITE_API_URL is set in .env (local) or in your hosting platform's dashboard (deployed).
// Vite only exposes env vars prefixed with VITE_ to frontend code — this is a
// security feature, so secrets without that prefix never leak into the browser bundle.
const API_URL = `${import.meta.env.VITE_API_URL}/api/applications`;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null); // the application shown in the detail modal

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    if (token) fetchApplications();
  }, [token]);

  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setApplications([]);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, authHeader());
      setApplications(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Could not connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      const res = await axios.post(API_URL, formData, authHeader());
      setApplications((prev) => [res.data, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add application.');
    }
  };

  // Full edit — used by the detail modal to save ANY field, including dateApplied.
  const handleUpdate = async (id, updatedFields) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedFields, authHeader());
      setApplications((prev) => prev.map((app) => (app._id === id ? res.data : app)));
    } catch (err) {
      setError('Failed to save changes.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, authHeader());
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      setError('Failed to delete application.');
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  if (!token) {
    return <Auth onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className="page">
      <Toolbar
        onSearchFocus={() => document.querySelector('.search-input')?.focus()}
        onAddFocus={() => document.querySelector('.application-form input')?.focus()}
        onThemeToggle={toggleTheme}
        theme={theme}
      />

      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Job Application Tracker</h1>
            <p className="subtitle">Track every application in one place.</p>
          </div>
          <div className="user-box">
            <span>Hi, {username}</span>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>

      <div className="layout">
        <Sidebar applications={applications} />

        <div className="container">
          <StatsBar applications={applications} />
          <ApplicationForm onAdd={handleAdd} />
          {error && <p className="error-message">{error}</p>}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          {loading ? (
            <p className="loading-text">Loading applications...</p>
          ) : (
            <Board applications={filteredApplications} onSelect={setSelectedApp} />
          )}
        </div>
      </div>

      <ApplicationDetail
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
