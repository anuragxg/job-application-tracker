import CompanyLogo from './CompanyLogo';

const COLUMNS = ['Applied', 'Interview', 'Offer', 'Rejected'];

function Board({ applications, onSelect }) {
  return (
    <div className="board">
      {COLUMNS.map((status) => {
        const items = applications.filter((app) => app.status === status);
        return (
          <div className="board-column" key={status}>
            <div className={`board-column-header status-text-${status.toLowerCase()}`}>
              {status} <span className="board-count">{items.length}</span>
            </div>
            <div className="board-column-body">
              {items.length === 0 && <p className="board-empty">Nothing here</p>}
              {items.map((app) => (
                <div className="board-card" key={app._id} onClick={() => onSelect(app)}>
                  <div className="board-card-top">
                    <CompanyLogo company={app.company} size={26} />
                    <div>
                      <div className="board-card-role">{app.role}</div>
                      <div className="board-card-company">{app.company}</div>
                    </div>
                  </div>
                  <div className="board-card-meta">
                    <span className="board-card-date">📅 {new Date(app.dateApplied).toLocaleDateString()}</span>
                    {app.salary && <span className="board-card-salary">{app.salary}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Board;
