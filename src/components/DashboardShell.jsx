import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut, Menu, X, ChevronRight } from 'lucide-react';

/**
 * DashboardShell — shared professional layout for all dashboards.
 *
 * Props:
 *   navItems      : [{ name, icon: LucideIcon }]
 *   activeTab     : string
 *   onTabChange   : (name) => void
 *   roleName      : string  e.g. 'Student Dashboard'
 *   roleColor     : string  tailwind color key e.g. 'emerald' | 'blue' | 'violet' | 'amber'
 *   userName      : string
 *   notifications : [{ id, text, time, isNew }]
 *   onClearNotifs : () => void
 *   onLogout      : () => void   (component handles the actual nav)
 *   headerRight   : ReactNode   (optional extra header content)
 *   children      : ReactNode
 *   toast         : { show, message }
 */
const COLOR_MAP = {
  emerald : { icon: 'bg-emerald-500 shadow-emerald-500/20', active: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25', dot: 'bg-emerald-500' },
  blue    : { icon: 'bg-blue-600   shadow-blue-500/20',    active: 'bg-blue-600   text-white shadow-md shadow-blue-600/25',    dot: 'bg-blue-500' },
  violet  : { icon: 'bg-violet-600 shadow-violet-500/20',  active: 'bg-violet-600 text-white shadow-md shadow-violet-600/25',  dot: 'bg-violet-500' },
  amber   : { icon: 'bg-amber-500  shadow-amber-500/20',   active: 'bg-amber-500  text-white shadow-md shadow-amber-500/25',   dot: 'bg-amber-500' },
};

export default function DashboardShell({
  navItems = [],
  activeTab,
  onTabChange,
  roleName = 'Dashboard',
  roleColor = 'blue',
  userName = 'User',
  notifications = [],
  onClearNotifs,
  onLogout,
  headerRight,
  children,
  toast = { show: false, message: '' },
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const colors = COLOR_MAP[roleColor] || COLOR_MAP.blue;
  const unreadCount = notifications.filter(n => n.isNew).length;
  const initials = userName.replace(/Mrs\.|Mr\.|Dr\./, '').trim().slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-100
          flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${colors.icon} flex items-center justify-center text-white shadow-md text-sm font-black shrink-0`}>
              CP
            </div>
            <div>
              <Link to="/" className="logo-shimmer font-black text-[15px] leading-none tracking-tight block">
                Cograd Pathshala
              </Link>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{roleName}</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ name, icon: Icon }) => {
            const isActive = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => { onTabChange(name); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold
                  transition-all duration-200 active:scale-[0.98] cursor-pointer text-left group
                  ${isActive
                    ? `${colors.active}`
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                `}
              >
                <div className={`
                  w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'}
                `}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={isActive ? 'font-bold' : ''}>{name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Profile footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className={`w-8 h-8 rounded-full ${colors.icon} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{userName}</div>
              <div className="text-[10px] font-medium text-slate-400 truncate">{roleName}</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 h-15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Page title */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Navigation</div>
              <h1 className="text-base font-black text-slate-800 leading-tight">{activeTab}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerRight}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center px-0.5 border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-slide-up">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Notifications</span>
                    <button
                      onClick={() => { onClearNotifs?.(); setNotifOpen(false); }}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No new notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 text-xs hover:bg-slate-50 transition-colors ${n.isNew ? 'bg-blue-50/30' : ''}`}>
                        <p className={`leading-snug ${n.isNew ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
              <div className={`w-6 h-6 rounded-full ${colors.icon} text-white font-bold flex items-center justify-center text-[10px]`}>
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── TOAST ── */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-xs">
            <div className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
