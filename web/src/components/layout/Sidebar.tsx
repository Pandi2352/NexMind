import { NavLink } from 'react-router-dom';

const navCategories = [
  {
    title: 'Applications',
    items: [
      { to: '/chat', label: 'Chat', icon: '💬' },
      { to: '/translator', label: 'Translator', icon: '🌐' },
      { to: '/summarizer', label: 'Summarizer', icon: '📝' },
      { to: '/prompt-optimizer', label: 'Prompt Optimizer', icon: '✨' },
      { to: '/health', label: 'Health Advisor', icon: '🩺' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { to: '/providers', label: 'AI Providers', icon: '⚙' },
      { to: '/agent-config', label: 'Agent Config', icon: '🔗' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-[220px] flex flex-col bg-[#0B1120] text-slate-300 border-r border-[#1E293B] shadow-2xl relative z-10 transition-all">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      
      <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-[#1E293B]/60 backdrop-blur-md relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg leading-none">N</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
            NexMind
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar relative z-20">
        {navCategories.map((category) => (
          <div key={category.title}>
            <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 select-none">
              {category.title}
            </h2>
            <ul className="space-y-0.5">
              {category.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-300 shadow-sm border border-blue-500/20'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span 
                          className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all duration-300 ${
                            isActive 
                              ? 'bg-blue-500/20 text-blue-400 scale-110 shadow-inner' 
                              : 'bg-slate-800/80 group-hover:bg-slate-700/80 group-hover:scale-105 group-hover:text-slate-200'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
