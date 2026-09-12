import { useState } from 'react';

// This component only knows how to collect form input and hand it off.
// It doesn't know about the API — that's App.jsx's job (passed in via onAdd).
function ApplicationForm({ onAdd }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    link: '',
    notes: '',
  });

  // Runs on every keystroke in any input — updates just that one field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // stops the browser from doing a full page reload on submit
    if (!formData.company || !formData.role) return; // basic guard
    onAdd(formData);
    setFormData({ company: '', role: '', status: 'Applied', link: '', notes: '' }); // reset form
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <input
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        required
      />
      <input
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input
        name="link"
        placeholder="Job link (optional)"
        value={formData.link}
        onChange={handleChange}
      />
      <input
        name="notes"
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={handleChange}
      />
      <button type="submit">Add Application</button>
    </form>
  );
}

export default ApplicationForm;
