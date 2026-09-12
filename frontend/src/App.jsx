import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import './App.css';

const API_URL = 'http://localhost:5000/api/applications';

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setApplications(res.data);
      setError(null);
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running and your MongoDB connection string is set in backend/.env.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      const res = await axios.post(API_URL, formData);
      setApplications((prev) => [res.data, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add application.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? res.data : app))
      );
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      setError('Failed to delete application.');
    }
  };

  // useMemo avoids recalculating this filtered list on every single render —
  // only recomputes when applications, searchTerm, or statusFilter actually change.
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  return (
    <div className="page">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <p className="subtitle">Track every application in one place — no more spreadsheets.</p>
      </header>

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
          <ApplicationList
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
