// Controlled inputs whose values live in the PARENT (App.jsx), passed down as props.
// This component just renders the inputs and reports changes upward — it holds no state of its own.
function FilterBar({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="filter-bar">
      <input
        className="search-input"
        placeholder="Search by company or role..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="filter-select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="All">All statuses</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}

export default FilterBar;
