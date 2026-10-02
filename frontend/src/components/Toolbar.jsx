// Every icon here does something real — no decorative-only buttons.
function Toolbar({ onSearchFocus, onAddFocus, onThemeToggle, theme }) {
  return (
    <div className="toolbar">
      <button className="toolbar-icon" title="Search applications" onClick={onSearchFocus}>🔍</button>
      <button className="toolbar-icon" title="Add new application" onClick={onAddFocus}>➕</button>
      <button className="toolbar-icon" title="Toggle theme" onClick={onThemeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default Toolbar;
