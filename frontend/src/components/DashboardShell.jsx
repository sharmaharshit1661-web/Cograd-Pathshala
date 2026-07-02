import { useState } from 'react';
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
  Plus,
  Presentation,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

const THEME_MAP = {
  emerald: {
    outerBg: 'bg-[#EBF7EE]',
    brandText: 'text-[#047857]',
    brandSub: 'text-[#065f46]',
    activeNavText: 'text-[#047857]',
    activeNavBg: 'bg-[#EBF7EE]',
    hoverNav: 'text-slate-500 hover:text-[#047857] hover:bg-[#EBF7EE]/50',
    mobileMenuText: 'text-[#047857]',
    mobileMenuBg: 'bg-emerald-50',
    mobileMenuBorder: 'border-emerald-100',
    avatarBg: 'bg-[#047857]',
    avatarShadow: 'shadow-emerald-600/10',
    headerTitleText: 'text-[#065f46]',
    ctaBtn: 'bg-[#059669] hover:bg-[#047857] text-white shadow-[0_6px_20px_rgba(16,185,129,0.25)] btn-border-beam-emerald',
    cardGradient: 'from-[#047857] to-[#10b981] shadow-emerald-600/10',
    cardSub: 'text-emerald-200',
    cardText: 'text-emerald-50/90',
    notifText: 'text-[#047857]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(4,120,87,0.08)]',
    backdropBg: 'bg-emerald-950/30',
  },
  violet: {
    outerBg: 'bg-[#F5F3FF]',
    brandText: 'text-[#6d28d9]',
    brandSub: 'text-[#5b21b6]',
    activeNavText: 'text-[#6d28d9]',
    activeNavBg: 'bg-[#F5F3FF]',
    hoverNav: 'text-slate-500 hover:text-[#6d28d9] hover:bg-[#F5F3FF]/50',
    mobileMenuText: 'text-[#6d28d9]',
    mobileMenuBg: 'bg-violet-50',
    mobileMenuBorder: 'border-violet-100',
    avatarBg: 'bg-[#6d28d9]',
    avatarShadow: 'shadow-violet-600/10',
    headerTitleText: 'text-[#5b21b6]',
    ctaBtn: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-[0_6px_20px_rgba(124,58,237,0.25)] btn-border-beam-purple',
    cardGradient: 'from-[#6d28d9] to-[#8b5cf6] shadow-violet-600/10',
    cardSub: 'text-violet-200',
    cardText: 'text-violet-50/90',
    notifText: 'text-[#6d28d9]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(109,40,217,0.08)]',
    backdropBg: 'bg-violet-950/30',
  },
  amber: {
    outerBg: 'bg-[#FEFBF0]',
    brandText: 'text-[#b45309]',
    brandSub: 'text-[#92400e]',
    activeNavText: 'text-[#b45309]',
    activeNavBg: 'bg-[#FEFBF0]',
    hoverNav: 'text-slate-500 hover:text-[#b45309] hover:bg-[#FEFBF0]/50',
    mobileMenuText: 'text-[#b45309]',
    mobileMenuBg: 'bg-amber-50',
    mobileMenuBorder: 'border-amber-100',
    avatarBg: 'bg-[#b45309]',
    avatarShadow: 'shadow-amber-600/10',
    headerTitleText: 'text-[#92400e]',
    ctaBtn: 'bg-[#d97706] hover:bg-[#b45309] text-white shadow-[0_6px_20px_rgba(217,119,6,0.25)] btn-border-beam-amber',
    cardGradient: 'from-[#b45309] to-[#f59e0b] shadow-amber-600/10',
    cardSub: 'text-amber-200',
    cardText: 'text-amber-50/90',
    notifText: 'text-[#b45309]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(180,83,9,0.08)]',
    backdropBg: 'bg-amber-950/30',
  },
  blue: {
    outerBg: 'bg-[#E9ECF5]',
    brandText: 'text-[#1e40af]',
    brandSub: 'text-[#1d4ed8]',
    activeNavText: 'text-[#1e40af]',
    activeNavBg: 'bg-[#E9ECF5]',
    hoverNav: 'text-slate-500 hover:text-[#1e40af] hover:bg-[#E9ECF5]/50',
    mobileMenuText: 'text-[#1e40af]',
    mobileMenuBg: 'bg-blue-50',
    mobileMenuBorder: 'border-blue-100',
    avatarBg: 'bg-[#1e40af]',
    avatarShadow: 'shadow-blue-600/10',
    headerTitleText: 'text-[#1555a6]',
    ctaBtn: 'bg-[#2563eb] hover:bg-[#1e40af] text-white shadow-[0_6px_20px_rgba(37,99,235,0.25)] btn-border-beam-blue',
    cardGradient: 'from-[#1e40af] to-[#7c3aed]',
    cardSub: 'text-blue-200',
    cardText: 'text-blue-100/90',
    notifText: 'text-[#1e40af]',
    sidebarShadow: 'md:shadow-[0_25px_60px_rgba(30,64,175,0.08)]',
    backdropBg: 'bg-blue-950/30',
  },
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
  const theme = THEME_MAP[roleColor] || THEME_MAP.blue;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.isNew).length;
  const cleanName = userName.replace(/Mrs\.|Mr\.|Dr\./, '').trim();
  const initials = cleanName.slice(0, 2).toUpperCase() || 'U';
  const firstName = cleanName.split(' ')[0] || 'User';

  const getSidebarData = () => {
    const role = roleName.toLowerCase();
    if (role.includes('student')) {
      return {
        ctaLabel: 'Book Demo Class',
        ctaTab: 'Schedule',
        title: 'Class 10 Student',
        subtitle: 'Meerut Batch',
        card1Val: '96%',
        card1Label: 'Attendance',
        card1Icon: Clock,
        card2Val: '12 Done',
        card2Label: 'Worksheets',
        card2Icon: ClipboardList,
        card3Val: '9.2 / 10',
        card3Label: 'Term GPA',
        card3Icon: Award,
        card4Val: '4 Passed',
        card4Label: 'Exams',
        card4Icon: GraduationCap,
      };
    }
    if (role.includes('teacher')) {
      return {
        ctaLabel: 'Create New Batch',
        ctaTab: 'Batches',
        title: 'Mathematics Faculty',
        subtitle: 'Meerut Center',
        card1Val: '92%',
        card1Label: 'Batch Attend.',
        card1Icon: Users,
        card2Val: '3 Active',
        card2Label: 'Batches',
        card2Icon: BookOpen,
        card3Val: '17 Graded',
        card3Label: 'Worksheets',
        card3Icon: ClipboardList,
        card4Val: '48 Held',
        card4Label: 'Lectures',
        card4Icon: Presentation,
      };
    }
    if (role.includes('parent')) {
      return {
        ctaLabel: 'Contact Mentor',
        ctaTab: 'Support',
        title: 'Parent of Rahul',
        subtitle: 'Noida Center',
        card1Val: '96%',
        card1Label: 'Child Attend.',
        card1Icon: Activity,
        card2Val: '2 Assigned',
        card2Label: 'Mentors',
        card2Icon: UserCheck,
        card3Val: '3 Cleared',
        card3Label: 'Payments',
        card3Icon: CreditCard,
        card4Val: '4 Ready',
        card4Label: 'Report Cards',
        card4Icon: FileText,
      };
    }
    return {
      ctaLabel: 'Add New Tutor',
      ctaTab: 'Teachers',
      title: 'Chief Administrator',
      subtitle: 'System Controller',
      card1Val: '99.9%',
      card1Label: 'Uptime',
      card1Icon: Activity,
      card2Val: '240 Active',
      card2Label: 'Tutors Vetted',
      card2Icon: Users,
      card3Val: '78 Vetted',
      card3Label: 'Pending: 22',
      card3Icon: ShieldCheck,
      card4Val: '3 Open',
      card4Label: 'Tickets',
      card4Icon: LifeBuoy,
    };
  };

  const stats = getSidebarData();
  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const goToCta = () => {
    const targetTab = navItems.find((item) => {
      const navName = item.name.toLowerCase();
      const target = stats.ctaTab.toLowerCase();
      return navName.includes(target) || target.includes(navName);
    });
    const fallbackTab = targetTab?.name || navItems[1]?.name || navItems[0]?.name;
    if (fallbackTab) onTabChange(fallbackTab);
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-[100dvh] ${theme.outerBg} p-0 md:p-6 flex items-center justify-center font-sans overflow-hidden relative select-none`}>
      {/* Decorative dot grids in corners */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-dot-grid opacity-15 pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-dot-grid opacity-15 pointer-events-none hidden md:block" />

      {/* Main floating card container */}
      <div className={`bg-white w-full min-h-[100dvh] md:min-h-0 md:h-[calc(100dvh-48px)] md:rounded-[40px] ${theme.sidebarShadow} overflow-hidden flex flex-col md:flex-row relative border border-slate-100/50`}>
        
        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 ${theme.backdropBg} backdrop-blur-sm z-30 md:hidden`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── COLUMN 1: LEFT SIDEBAR ── */}
        <aside
          className={`
            fixed md:relative top-0 bottom-0 left-0 h-full w-64 bg-white/50 text-slate-800
            flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Website Name Block */}
          <div className="px-6 pt-9 pb-4 flex flex-col gap-2 shrink-0 relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-5 md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Website name - increased size, no icon */}
            <div>
              <span className={`${theme.brandText} font-black text-3xl tracking-tight block leading-tight`}>Cograd Pathshala</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                {roleName}
              </span>
            </div>
          </div>

          {/* Violet CTA pill button */}
          <div className="px-5 mt-2 mb-6 shrink-0">
            <button
              onClick={goToCta}
              className={`w-full flex items-center justify-center gap-2 text-white rounded-full font-black text-[11.5px] py-3.5 px-4 transition-all cursor-pointer border-0 ${theme.ctaBtn}`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{stats.ctaLabel}</span>
            </button>
          </div>

          {/* Navigation Items (White capsule active items) */}
          <nav className="flex-grow px-3 space-y-1 overflow-y-auto scrollbar-none">
            {navItems.map(({ name, icon: Icon }) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => {
                    onTabChange(name);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3.5 px-4.5 py-3 text-[12px] font-bold
                    transition-all duration-200 cursor-pointer text-left rounded-[22px] border-0
                    ${isActive ? `bg-white ${theme.activeNavText} font-black shadow-sm` : theme.hoverNav}
                  `}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="truncate">{name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar: Logout */}
          <div className="px-3 py-4 shrink-0 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4.5 py-3 text-[12px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[22px] cursor-pointer transition-all border-0"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── COLUMN 2: MAIN CONTENT AREA ── */}
        <div className="flex-grow flex flex-col h-[100dvh] md:h-full overflow-hidden bg-[#F8FAFC] min-w-0">
          
          {/* Content Header */}
          <header className="h-[72px] px-6 md:px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`md:hidden p-2.5 ${theme.mobileMenuBg} ${theme.mobileMenuText} hover:brightness-95 rounded-xl transition-colors cursor-pointer shrink-0 border ${theme.mobileMenuBorder} animate-fade-in`}
                aria-label="Open navigation"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>

              {/* Website name on mobile header */}
              <div className="flex items-center md:hidden select-none shrink-0 animate-fade-in">
                <span className={`font-black text-xl ${theme.brandText} tracking-tight`}>Cograd Pathshala</span>
              </div>

              {/* Minimal Search Bar - Hidden on extra-small mobile screens to make space for branding */}
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-4 py-2 w-44 sm:w-64 rounded-[20px] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/20 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none text-xs focus:outline-none text-slate-700 w-full placeholder:text-slate-400 font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Date String */}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider hidden sm:block">
                {dateStr}
              </span>

              {/* Mobile Profile & Notification bell */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  className="w-9 h-9 bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-800 rounded-xl flex items-center justify-center relative cursor-pointer"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
                </button>

                <div className={`w-9 h-9 rounded-full ${theme.avatarBg} text-white text-xs font-black flex items-center justify-center border border-white shadow-sm`}>
                  {initials.slice(0, 1)}
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Dashboard Viewport */}
          <main className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 scrollbar-thin">
            <div className="max-w-4xl w-full mx-auto">
              
              {/* Title & Custom Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-7 pb-6">
                <div>
                  <h1 className={`text-2xl font-black ${theme.headerTitleText} leading-tight tracking-tight`}>{activeTab}</h1>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{stats.title} • {stats.subtitle}</p>
                </div>
                {headerRight && <div className="flex items-center gap-2 self-start sm:self-auto">{headerRight}</div>}
              </div>

              {/* Mobile-Only 2x2 Grid of Square Stats Cards (hidden on lg and up) */}
              <section className="lg:hidden mb-6 grid grid-cols-2 gap-3.5">
                {[
                  { val: stats.card1Val, label: stats.card1Label, icon: stats.card1Icon, style: 'bg-[#FFF1F2] border-[#FFE4E6]/50 text-[#9F1239]' },
                  { val: stats.card2Val, label: stats.card2Label, icon: stats.card2Icon, style: 'bg-[#ECFDF5] border-[#D1FAE5]/50 text-[#065F46]' },
                  { val: stats.card3Val, label: stats.card3Label, icon: stats.card3Icon, style: 'bg-[#FFFBEB] border-[#FEF3C7]/50 text-[#92400E]' },
                  { val: stats.card4Val, label: stats.card4Label, icon: stats.card4Icon, style: 'bg-[#EFF6FF] border-[#DBEAFE]/50 text-[#1E40AF]' }
                ].map(({ val, label, icon: Icon, style: cardStyle }) => (
                  <div key={label} className={`p-4 rounded-[22px] border ${cardStyle} flex flex-col justify-between aspect-square shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-black opacity-80">{label}</span>
                      <div className="p-1.5 rounded-xl bg-white/50 border border-white/20"><Icon className="w-4 h-4" /></div>
                    </div>
                    <div className="text-lg font-black tracking-tight leading-none mt-3">{val}</div>
                  </div>
                ))}
              </section>

              {/* Main Tab Content */}
              <section className="dashboard-content-body min-h-[400px]">
                {children}
              </section>
            </div>
          </main>
        </div>

        {/* ── COLUMN 3: RIGHT PROFILE & STATISTICS PANEL (lg and up) ── */}
        <aside className="w-80 border-l border-slate-100 bg-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0 relative">
          
          {/* User Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* Initials Avatar */}
              <div className={`w-11 h-11 rounded-full ${theme.avatarBg} text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-md ${theme.avatarShadow} shrink-0`}>
                {initials}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Logged In</span>
                <span className="text-sm font-black text-slate-800 truncate block mt-1">Hi, {firstName}!</span>
              </div>
            </div>

            {/* Quick Action Control Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-500 hover:text-slate-800 rounded-xl flex items-center justify-center relative cursor-pointer"
                title="Notifications"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
              </button>
              <button className="w-9 h-9 bg-slate-50 hover:bg-slate-150 border border-slate-150 text-slate-500 hover:text-slate-800 rounded-xl flex items-center justify-center cursor-pointer" title="Preferences">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2x2 Grid of Square Stats Cards ("My Devices/Statuses") */}
          <div className="mb-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">Statuses Overview</h3>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { val: stats.card1Val, label: stats.card1Label, icon: stats.card1Icon, style: 'bg-[#FFF1F2] border-[#FFE4E6]/50 text-[#9F1239]' },
                { val: stats.card2Val, label: stats.card2Label, icon: stats.card2Icon, style: 'bg-[#ECFDF5] border-[#D1FAE5]/50 text-[#065F46]' },
                { val: stats.card3Val, label: stats.card3Label, icon: stats.card3Icon, style: 'bg-[#FFFBEB] border-[#FEF3C7]/50 text-[#92400E]' },
                { val: stats.card4Val, label: stats.card4Label, icon: stats.card4Icon, style: 'bg-[#EFF6FF] border-[#DBEAFE]/50 text-[#1E40AF]' }
              ].map(({ val, label, icon: Icon, style: cardStyle }) => (
                <div key={label} className={`p-4 rounded-[22px] border ${cardStyle} flex flex-col justify-between aspect-square hover:scale-[1.03] transition-transform duration-200 shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-black opacity-80">{label}</span>
                    <div className="p-1.5 rounded-xl bg-white/50 border border-white/20"><Icon className="w-4 h-4" /></div>
                  </div>
                  <div className="text-xl font-black tracking-tight leading-none mt-4">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom decorative classroom vector container */}
          <div className={`mt-auto bg-gradient-to-br ${theme.cardGradient} text-white p-5.5 rounded-[28px] relative overflow-hidden shadow-lg`}>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-1.5">
              <span className={`text-[8px] uppercase font-black ${theme.cardSub} tracking-wider`}>Active Learning Workspace</span>
              <h4 className="text-sm font-black mt-0.5">Cograd Live Portal</h4>
              <p className={`text-[10px] ${theme.cardText} mt-1 font-semibold leading-relaxed`}>
                Interactive digital notebooks and live home tuition sync slots are active. Keep studying!
              </p>
              <div
                onClick={goToCta}
                className="mt-3.5 flex items-center gap-1 text-[10px] font-black text-white hover:underline cursor-pointer select-none"
              >
                <span>Check details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </aside>

        {/* ── NOTIFICATION DRAWER / DROPDOWN ── */}
        {notifOpen && (
          <div className="absolute top-[76px] right-6 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_48px_rgba(15,23,42,0.14)] z-50 p-4 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Notifications</span>
              <button
                onClick={() => {
                  onClearNotifs?.();
                  setNotifOpen(false);
                }}
                className={`text-[10px] ${theme.notifText} hover:underline font-extrabold`}
              >
                Clear all
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No new notifications</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="py-3.5 text-xs text-left">
                    <p className={`leading-snug ${n.isNew ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                    {n.time && <span className="text-[9px] text-slate-400 font-bold block mt-1">{n.time}</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Toast system */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-slate-950 text-white text-xs font-semibold px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-xs border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
