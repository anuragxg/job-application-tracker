import { useState } from 'react';

function ApplicationForm({ onAdd }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    link: '',
    location: '',
    salary: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;
    onAdd(formData);
    setFormData({ company: '', role: '', status: 'Applied', link: '', location: '', salary: '', notes: '' });
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
      <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input name="location" placeholder="Location (optional)" value={formData.location} onChange={handleChange} />
      <input name="salary" placeholder="Salary (optional)" value={formData.salary} onChange={handleChange} />
      <input name="link" placeholder="Job link (optional)" value={formData.link} onChange={handleChange} />
      <button type="submit">Add Application</button>
    </form>
  );
}

export default ApplicationForm;
