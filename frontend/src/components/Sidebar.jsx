import { useState, useEffect } from 'react';

const DEFAULT_TODOS = [
  { id: 1, text: 'Update resume', done: false },
  { id: 2, text: 'Update LinkedIn profile', done: false },
  { id: 3, text: 'Update portfolio', done: false },
  { id: 4, text: 'Research target companies', done: false },
];

// Progress bars are derived from REAL application data (not hardcoded %),
// so they actually mean something as your tracker fills up.
function Sidebar({ applications }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : DEFAULT_TODOS;
  });
  const [newTodo, setNewTodo] = useState('');

  // Persist to-dos locally so they survive a refresh — these are personal
  // checklist items, not application data, so they don't need the backend.
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const total = applications.length || 1; // avoid divide-by-zero when empty
  const interviewRate = Math.round((applications.filter((a) => a.status === 'Interview').length / total) * 100);
  const offerRate = Math.round((applications.filter((a) => a.status === 'Offer').length / total) * 100);
  const rejectedRate = Math.round((applications.filter((a) => a.status === 'Rejected').length / total) * 100);
  const responseRate = Math.round(
    (applications.filter((a) => a.status !== 'Applied').length / total) * 100
  );

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const bars = [
    { label: 'Response rate', value: responseRate, color: 'var(--applied-text)' },
    { label: 'Interview rate', value: interviewRate, color: 'var(--interview-text)' },
    { label: 'Offer rate', value: offerRate, color: 'var(--offer-text)' },
    { label: 'Rejection rate', value: rejectedRate, color: 'var(--rejected-text)' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Progress</h3>
        {bars.map((bar) => (
          <div className="progress-row" key={bar.label}>
            <div className="progress-label">
              <span>{bar.label}</span>
              <span>{applications.length === 0 ? '—' : `${bar.value}%`}</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${applications.length === 0 ? 0 : bar.value}%`, background: bar.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <h3>To-Do List</h3>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'todo-done' : ''}>
              <label>
                <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
                <span>{todo.text}</span>
              </label>
            </li>
          ))}
        </ul>
        <form className="todo-add-form" onSubmit={addTodo}>
          <input
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </div>
    </aside>
  );
}

export default Sidebar;
