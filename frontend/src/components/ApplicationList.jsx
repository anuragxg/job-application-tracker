// Displays the list of applications as a table.
// Receives data + callback functions as props — doesn't call the API itself.
function ApplicationList({ applications, onStatusChange, onDelete }) {
  if (applications.length === 0) {
    return <p className="empty-state">No applications yet. Add your first one above!</p>;
  }

  return (
    <table className="application-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Status</th>
          <th>Date Applied</th>
          <th>Link</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {/* .map() turns each application object into a table row.
            'key' is required by React to track each row efficiently across re-renders. */}
        {applications.map((app) => (
          <tr key={app._id}>
            <td>{app.company}</td>
            <td>{app.role}</td>
            <td>
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app._id, e.target.value)}
                className={`status-badge status-${app.status.toLowerCase()}`}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </td>
            <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
            <td>
              {app.link ? (
                <a href={app.link} target="_blank" rel="noreferrer">View</a>
              ) : (
                '—'
              )}
            </td>
            <td>{app.notes || '—'}</td>
            <td>
              <button className="delete-btn" onClick={() => onDelete(app._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationList;
