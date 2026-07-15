import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  Plus,
  Presentation,
  Search,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useDarkMode } from '../hooks/useTheme';

const THEME_MAP = {
  emerald: {
    outerBg: 'bg-[#EBF7EE]',
    brandText: 'text-[#047857]',
    activeNavText: 'text-[#047857]',
    hoverNav: 'text-slate-500 hover:text-[#047857] hover:bg-[#EBF7EE]/50',
    mobileMenuText: 'text-[#047857]',
    mobileMenuBg: 'bg-emerald-50',
    mobileMenuBorder: 'border-emerald-100',
    avatarBg: 'bg-[#047857]',
    headerTitleText: 'text-[#065f46]',
    ctaBtn: 'bg-[#059669] hover:bg-[#047857] text-white shadow-[0_6px_20px_rgba(16,185,129,0.25)]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(4,120,87,0.08)]',
    backdropBg: 'bg-emerald-950/30',
    ringColor: 'ring-emerald-200',
    notifDot: 'bg-emerald-500',
  },
  violet: {
    outerBg: 'bg-[#F5F3FF]',
    brandText: 'text-[#6d28d9]',
    activeNavText: 'text-[#6d28d9]',
    hoverNav: 'text-slate-500 hover:text-[#6d28d9] hover:bg-[#F5F3FF]/50',
    mobileMenuText: 'text-[#6d28d9]',
    mobileMenuBg: 'bg-violet-50',
    mobileMenuBorder: 'border-violet-100',
    avatarBg: 'bg-[#6d28d9]',
    headerTitleText: 'text-[#5b21b6]',
    ctaBtn: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-[0_6px_20px_rgba(124,58,237,0.25)]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(109,40,217,0.08)]',
    backdropBg: 'bg-violet-950/30',
    ringColor: 'ring-violet-200',
    notifDot: 'bg-violet-500',
  },
  amber: {
    outerBg: 'bg-[#FEFBF0]',
    brandText: 'text-[#b45309]',
    activeNavText: 'text-[#b45309]',
    hoverNav: 'text-slate-500 hover:text-[#b45309] hover:bg-[#FEFBF0]/50',
    mobileMenuText: 'text-[#b45309]',
    mobileMenuBg: 'bg-amber-50',
    mobileMenuBorder: 'border-amber-100',
    avatarBg: 'bg-[#b45309]',
    headerTitleText: 'text-[#92400e]',
    ctaBtn: 'bg-[#d97706] hover:bg-[#b45309] text-white shadow-[0_6px_20px_rgba(217,119,6,0.25)]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(180,83,9,0.08)]',
    backdropBg: 'bg-amber-950/30',
    ringColor: 'ring-amber-200',
    notifDot: 'bg-amber-500',
  },
  blue: {
    outerBg: 'bg-[#E9ECF5]',
    brandText: 'text-[#1e40af]',
    activeNavText: 'text-[#1e40af]',
    hoverNav: 'text-slate-500 hover:text-[#1e40af] hover:bg-[#E9ECF5]/50',
    mobileMenuText: 'text-[#1e40af]',
    mobileMenuBg: 'bg-blue-50',
    mobileMenuBorder: 'border-blue-100',
    avatarBg: 'bg-[#1e40af]',
    headerTitleText: 'text-[#1555a6]',
    ctaBtn: 'bg-[#2563eb] hover:bg-[#1e40af] text-white shadow-[0_6px_20px_rgba(37,99,235,0.25)]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(30,64,175,0.08)]',
    backdropBg: 'bg-blue-950/30',
    ringColor: 'ring-blue-200',
    notifDot: 'bg-blue-500',
  },
};

const formatNotifTime = (createdAt) => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
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
  onCtaClick,
}) {
  const theme = THEME_MAP[roleColor] || THEME_MAP.blue;
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);
  const notifRef = useRef(null);
  const toastTimer = useRef(null);

  /* auto-show / auto-dismiss toast when toast.show changes */
  useEffect(() => {
    if (toast.show && toast.message) {
      setToastVisible(true);
      setToastExiting(false);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => {
        setToastExiting(true);
        setTimeout(() => setToastVisible(false), 280);
      }, 3200);
    }
    return () => clearTimeout(toastTimer.current);
  }, [toast.show, toast.message]);

  const unreadCount = notifications.filter((n) => n.isNew).length;
  const cleanName = userName.replace(/Mrs\.|Mr\.|Dr\./, '').trim();
  const initials = cleanName.slice(0, 2).toUpperCase() || 'U';

  /* close notif panel on outside click */
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  /* lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const getSidebarData = () => {
    const role = roleName.toLowerCase();
    if (role.includes('student')) {
      return {
        ctaLabel: 'Book Demo Class', ctaTab: 'Schedule',
        title: 'Student Dashboard', subtitle: 'Your Learning Hub',
        card1Val: '96%', card1Label: 'Attendance', card1Icon: Clock,
        card2Val: '12 Done', card2Label: 'Worksheets', card2Icon: ClipboardList,
        card3Val: '9.2/10', card3Label: 'Term GPA', card3Icon: Award,
        card4Val: '4 Passed', card4Label: 'Exams', card4Icon: GraduationCap,
      };
    }
    if (role.includes('teacher')) {
      return {
        ctaLabel: 'Create New Batch', ctaTab: 'Batches',
        title: 'Teacher Dashboard', subtitle: 'Your Teaching Hub',
        card1Val: '92%', card1Label: 'Batch Attend.', card1Icon: Users,
        card2Val: '3 Active', card2Label: 'Batches', card2Icon: BookOpen,
        card3Val: '17 Graded', card3Label: 'Worksheets', card3Icon: ClipboardList,
        card4Val: '48 Held', card4Label: 'Lectures', card4Icon: Presentation,
      };
    }
    if (role.includes('parent')) {
      return {
        ctaLabel: 'Contact Admin', ctaTab: 'Support',
        title: 'Parent Dashboard', subtitle: "Track Your Child's Progress",
        card1Val: '96%', card1Label: 'Child Attend.', card1Icon: Activity,
        card2Val: '2 Assigned', card2Label: 'Mentors', card2Icon: UserCheck,
        card3Val: '3 Cleared', card3Label: 'Payments', card3Icon: CreditCard,
        card4Val: '4 Ready', card4Label: 'Report Cards', card4Icon: FileText,
      };
    }
    return {
      title: 'Admin Dashboard', subtitle: 'Platform Control Center',
      card1Val: '99.9%', card1Label: 'Uptime', card1Icon: Activity,
      card2Val: '240 Active', card2Label: 'Tutors Vetted', card2Icon: Users,
      card3Val: '78 Vetted', card3Label: 'Pending: 22', card3Icon: ShieldCheck,
      card4Val: '3 Open', card4Label: 'Tickets', card4Icon: LifeBuoy,
    };
  };

  const stats = getSidebarData();
  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  });

  const goToCta = () => {
    const target = navItems.find((item) => {
      const n = item.name.toLowerCase();
      const t = stats.ctaTab.toLowerCase();
      return n.includes(t) || t.includes(n);
    });
    const tab = target?.name || navItems[1]?.name || navItems[0]?.name;
    if (tab) onTabChange(tab);
    setSidebarOpen(false);
  };

  /* filtered nav items for search */
  const filteredNav = searchQuery.trim()
    ? navItems.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;

  return (
    <div className={`min-h-[100dvh] ${darkMode ? 'bg-[#0f1117]' : theme.outerBg} p-0 md:p-6 flex items-center justify-center font-sans overflow-hidden relative transition-colors duration-300`}>
      {/* Corner decorative dots */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-dot-grid opacity-10 pointer-events-none hidden md:block" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-dot-grid opacity-10 pointer-events-none hidden md:block" aria-hidden="true" />

      {/* Main card */}
      <div className={`${darkMode ? 'bg-[#181a20] border-[#2a2d35]' : 'bg-white border-slate-100/50'} w-full min-h-[100dvh] md:min-h-0 md:h-[calc(100dvh-48px)] md:rounded-[40px] ${theme.sidebarShadow} overflow-hidden flex flex-col md:flex-row relative border transition-colors duration-300`}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 ${theme.backdropBg} backdrop-blur-sm z-30 md:hidden transition-opacity duration-200`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          aria-label="Dashboard navigation"
          className={`
            fixed md:relative top-0 bottom-0 left-0 h-full w-64 ${darkMode ? 'bg-[#181a20] text-slate-200' : 'bg-white text-slate-800'}
            flex flex-col z-40 shrink-0
            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            border-r ${darkMode ? 'border-[#2a2d35]' : 'border-slate-100/60'}
          `}
        >
          {/* Brand block */}
          <div className="px-6 pt-8 pb-4 flex flex-col gap-1.5 shrink-0 relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 right-4 md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-all"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
            <span className={`${theme.brandText} font-black text-2xl tracking-tight leading-tight`}>
              Cograd Pathshala
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {roleName}
            </span>
          </div>

          {/* CTA button */}
          {stats.ctaLabel && (
            <div className="px-5 mt-1 mb-5 shrink-0">
              <button
                onClick={onCtaClick || goToCta}
                className={`w-full flex items-center justify-center gap-2 text-white rounded-full font-black text-[11.5px] py-3 px-4 transition-all duration-200 cursor-pointer border-0 active:scale-[0.98] ${theme.ctaBtn}`}
              >
                {stats.ctaLabel !== 'Contact Admin' && (
                  <Plus className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                )}
                <span>{stats.ctaLabel}</span>
              </button>
            </div>
          )}

          {/* Nav items */}
          <nav
            role="navigation"
            aria-label="Dashboard sections"
            className="flex-grow px-3 space-y-0.5 overflow-y-auto sidebar-scroll"
          >
            {filteredNav.map(({ name, icon: Icon }) => {
              const active = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => { onTabChange(name); setSidebarOpen(false); }}
                  aria-current={active ? 'page' : undefined}
                  className={`
                    group w-full flex items-center gap-3 px-3.5 py-2.5 text-[12px] font-bold
                    transition-all duration-150 cursor-pointer text-left rounded-2xl border-0
                    ${active
                      ? `bg-white ${theme.activeNavText} font-black shadow-sm ring-1 ${theme.ringColor}`
                      : theme.hoverNav
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0 nav-icon-animate" aria-hidden="true" />
                  <span className="truncate flex-1">{name}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}

            {filteredNav.length === 0 && searchQuery && (
              <p className="text-center text-xs text-slate-400 py-4">No match for "{searchQuery}"</p>
            )}
          </nav>

          {/* Logout */}
          <div className={`px-3 py-4 shrink-0 border-t ${darkMode ? 'border-[#2a2d35]' : 'border-slate-100'}`}>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[12px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl cursor-pointer transition-all duration-150 border-0"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className={`flex-grow flex flex-col h-[100dvh] md:h-full overflow-hidden ${darkMode ? 'bg-[#13151a]' : 'bg-[#F8FAFC]'} min-w-0 transition-colors duration-300`}>

          {/* Header */}
          <header className={`h-[68px] px-5 md:px-7 border-b ${darkMode ? 'border-[#2a2d35] bg-[#181a20]' : 'border-slate-100 bg-white'} flex items-center justify-between shrink-0 gap-3 transition-colors duration-300`}>

            {/* Left: hamburger + search */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`md:hidden p-2 ${theme.mobileMenuBg} ${theme.mobileMenuText} hover:brightness-95 rounded-xl transition-colors cursor-pointer shrink-0 border ${theme.mobileMenuBorder}`}
                aria-label="Open navigation"
              >
                <Menu className="w-4.5 h-4.5" aria-hidden="true" />
              </button>

              {/* Brand on mobile */}
              <span className={`md:hidden font-black text-lg ${theme.brandText} tracking-tight shrink-0`}>
                Cograd Pathshala
              </span>

              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-2 w-52 lg:w-72 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-300/50 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder={`Search ${roleName.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none text-slate-700 w-full placeholder:text-slate-400 font-medium"
                  aria-label="Search dashboard sections"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: date + notif + avatar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className={`text-[10px] font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider hidden lg:block`}>
                {dateStr}
              </span>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 border ${
                  darkMode
                    ? 'bg-[#2a2d35] border-[#3a3d45] text-amber-400 hover:bg-[#333640] hover:text-amber-300'
                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <div className="relative w-4.5 h-4.5">
                  <Sun className={`w-4.5 h-4.5 absolute inset-0 transition-all duration-300 ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                  <Moon className={`w-4.5 h-4.5 absolute inset-0 transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                </div>
              </button>

              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                  className="relative w-9 h-9 bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 animate-bell-hover"
                >
                  <Bell className="w-4.5 h-4.5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification panel */}
                {notifOpen && (
                  <div className="notif-panel" role="dialog" aria-label="Notifications">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="text-sm font-bold text-slate-800">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && onClearNotifs && (
                          <button
                            onClick={() => { onClearNotifs(); setNotifOpen(false); }}
                            className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setNotifOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-all"
                          aria-label="Close notifications"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="empty-state py-8">
                          <div className="empty-state-icon mx-auto">
                            <Bell className="w-5 h-5" />
                          </div>
                          <p className="empty-state-title text-sm">All caught up!</p>
                          <p className="empty-state-desc text-xs">No new notifications.</p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const displayTime = n.createdAt
                            ? formatNotifTime(n.createdAt)
                            : n.time;
                          return (
                            <div key={n.id} className={`notif-item ${n.isNew ? 'unread' : ''}`}>
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isNew ? theme.notifDot : 'bg-slate-200'}`} aria-hidden="true" />
                              <div className="min-w-0">
                                <p className="text-[12px] font-medium text-slate-700 leading-snug">{n.text}</p>
                                {displayTime && (
                                  <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">{displayTime}</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full ${theme.avatarBg} text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm cursor-default`}
                title={`Signed in as ${userName}`}
                aria-label={`User: ${userName}`}
              >
                {initials}
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <main
            className="flex-1 overflow-y-auto px-5 md:px-7 pb-10 scrollbar-thin"
            role="main"
          >
            <div className="max-w-6xl w-full mx-auto">
              {/* Page title row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pt-7 pb-5">
                <div>
                  <h1 className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-slate-100' : theme.headerTitleText} leading-tight tracking-tight`}>
                    {activeTab}
                  </h1>
                  <p className={`text-[11px] font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-1 flex items-center gap-1.5`}>
                    <span>{stats.title}</span>
                    <span aria-hidden="true">•</span>
                    <span>{stats.subtitle}</span>
                  </p>
                </div>
                {headerRight && (
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {headerRight}
                  </div>
                )}
              </div>

              {/* Tab content */}
              <section className="dashboard-content-body min-h-[400px]">
                {children}
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* ── GLOBAL TOAST ── */}
      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className={`toast ${toastExiting ? 'toast-exit' : ''} ${toast.type === 'error' ? 'toast-error'
              : toast.type === 'info' ? 'toast-info'
                : 'toast-success'
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
