import { useState, useEffect } from 'react';
import CompanyLogo from './CompanyLogo';

function ApplicationDetail({ app, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (app) {
      setForm({
        ...app,
        dateApplied: app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : '',
      });
    }
  }, [app]);

  if (!app || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(app._id, form);
    onClose();
  };

  const handleDelete = () => {
    onDelete(app._id);
    onClose();
  };

  // Each row mirrors the template's "icon — label — value" list style:
  // an emoji icon, a small caps label, and an inline-editable value on the right.
  const rows = [
    { icon: '🏢', label: 'Company', name: 'company', type: 'text' },
    { icon: '🔗', label: 'URL', name: 'link', type: 'text', placeholder: 'Empty' },
    { icon: '📅', label: 'Application Date', name: 'dateApplied', type: 'date' },
    { icon: '📍', label: 'Location', name: 'location', type: 'text', placeholder: 'Empty' },
    { icon: '💰', label: 'Pay / Salary', name: 'salary', type: 'text', placeholder: 'Empty' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title-row">
          <CompanyLogo company={form.company} size={40} />
          <input
            className="modal-title-input"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Job Role"
          />
        </div>

        <div className="modal-row-list">
          {rows.map((row) => (
            <div className="modal-row" key={row.name}>
              <span className="modal-row-icon">{row.icon}</span>
              <span className="modal-row-label">{row.label}</span>
              <input
                className="modal-row-value"
                type={row.type}
                name={row.name}
                value={form[row.name] || ''}
                onChange={handleChange}
                placeholder={row.placeholder}
              />
            </div>
          ))}
          <div className="modal-row">
            <span className="modal-row-icon">🚦</span>
            <span className="modal-row-label">Status</span>
            <select className="modal-row-value modal-status-select" name="status" value={form.status} onChange={handleChange}>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="modal-section">
          <h3>Notes</h3>
          <textarea
            name="notes"
            value={form.notes || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Research the company, prep interview questions, track feedback..."
          />
        </div>

        <div className="modal-actions">
          <button className="modal-delete-btn" onClick={handleDelete}>Delete</button>
          <button className="modal-save-btn" onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
