import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/providers', label: 'AI Providers', icon: '⚙' },
  { to: '/agent-config', label: 'Agent Config', icon: '🔗' },
  { to: '/chat', label: 'Chat', icon: '💬' },
  { to: '/translator', label: 'Translator', icon: '🌐' },
  { to: '/summarizer', label: 'Summarizer', icon: '📝' },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-4">
        <h1 className="text-xl font-bold">NexMind</h1>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
