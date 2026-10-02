function StatsBar({ applications }) {
  const counts = {
    total: applications.length,
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Offer: applications.filter((a) => a.status === 'Offer').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="stats-bar">
      <div className="stat-card stat-total"><span className="stat-number">{counts.total}</span><span className="stat-label">Total</span></div>
      <div className="stat-card stat-applied"><span className="stat-number">{counts.Applied}</span><span className="stat-label">Applied</span></div>
      <div className="stat-card stat-interview"><span className="stat-number">{counts.Interview}</span><span className="stat-label">Interview</span></div>
      <div className="stat-card stat-offer"><span className="stat-number">{counts.Offer}</span><span className="stat-label">Offer</span></div>
      <div className="stat-card stat-rejected"><span className="stat-number">{counts.Rejected}</span><span className="stat-label">Rejected</span></div>
    </div>
  );
}

export default StatsBar;
