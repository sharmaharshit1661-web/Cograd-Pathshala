import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Users, GraduationCap, Award,
  TrendingUp, Clock, ShieldCheck, Star, ArrowRight, Zap,
  Play, Heart, Sparkles,
} from 'lucide-react';


const STATS = [
  { icon: MapPin,        value: '8',    label: 'Active Districts',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { icon: Users,         value: '125+', label: 'Students Impacted', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: GraduationCap, value: '25',   label: 'Expert Tutors',     color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
  { icon: Award,         value: '95%',  label: 'Parent Satisfaction',color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Fully Vetted Teachers',  desc: 'Every teacher undergoes 3-step background verification and subject testing before joining.' },
  { icon: TrendingUp,  title: 'Measurable Progress',    desc: 'Weekly assessments, progress reports, and direct parent feedback loops built in.' },
  { icon: Heart,       title: 'Personalised Learning',  desc: 'Custom study plans aligned to each student\'s pace, curriculum, and learning style.' },
  { icon: MapPin,      title: 'Home Visits Included',   desc: 'Teachers travel to your home — no commute, no disruption to your child\'s routine.' },
];

const TESTIMONIALS = [
  { name: 'Anjali Sharma', role: 'Parent, Meerut', rating: 5, text: 'My son\'s grades improved dramatically within just 2 months. The teacher was incredibly patient and dedicated.' },
  { name: 'Rajesh Kumar', role: 'Parent, Allahabad', rating: 5, text: 'Finally found a trustworthy tutoring service that actually comes to our village. Outstanding quality!' },
  { name: 'Priya Singh', role: 'Parent, Meerut', rating: 5, text: 'The weekly progress reports keep me informed. I always know exactly how my daughter is doing.' },
];

const DISTRICTS = [
  {
    city: 'Meerut',
    status: 'Active',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    students: '30,000+',
    teachers: '50+',
    accentColor: 'border-l-primary-500',
    desc: 'Our flagship district — fully operational with a rapidly growing teacher network.',
    statsLabel1: 'Target Students',
    statsLabel2: 'Deployed Tutors',
    actionText: 'Book Free Demo in Meerut',
    link: '/demo-booking'
  },
  {
    city: 'Allahabad',
    status: 'Launching Soon',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-100',
    students: '25,000+',
    teachers: '40+',
    accentColor: 'border-l-secondary-500',
    desc: 'Coming soon — pre-registration is open for early access and priority teacher matching.',
    statsLabel1: 'Pre-registered Students',
    statsLabel2: 'Interested Tutors',
    actionText: 'Pre-Register in Allahabad',
    link: '/demo-booking'
  }
];

/* ── Intersection-Observer scroll reveal ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal-on-scroll');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

const Home = () => {
  const pageRef = useReveal();
  const [selectedDistrict, setSelectedDistrict] = useState(0);

  return (
    <div ref={pageRef} className="min-h-screen bg-neutral-50">

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-secondary-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50/30 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Left Side Tree Photo Frame */}
          <div className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 z-20 pointer-events-none select-none">
            {/* The decorative vine/branch stem */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200/80 to-transparent" />
            
            {/* Image 1 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-4 -rotate-6">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Student" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* Image 2 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-4 rotate-6">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Books" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* Image 3 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-2 -rotate-3">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Group Study" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Right Side Tree Photo Frame */}
          <div className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 z-20 pointer-events-none select-none">
            {/* The decorative vine/branch stem */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200/80 to-transparent" />
            
            {/* Image 1 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-4 rotate-6">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Classroom" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* Image 2 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-4 -rotate-6">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Teacher" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* Image 3 */}
            <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-2 rotate-3">
              <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                <img 
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=240&h=320&q=80" 
                  className="w-24 h-32 rounded-lg object-cover" 
                  alt="Study" 
                />
              </div>
              {/* Hanging pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-white border rounded-full text-xs sm:text-sm font-semibold mb-8 animate-fade-in animate-badge-glow badge-shimmer-sweep shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
              <span className="text-gradient-shark">Shark Tank India Featured EdTech</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-neutral-900 mb-6 tracking-tight animate-slide-up leading-[1.08]">
              Quality Education<br />
              at Your{' '}
              <span className="color-blend-text">Doorstep</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '120ms' }}>
              Cograd Pathshala connects students with verified, experienced home teachers — making premium tuition accessible in Tier 3 districts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '220ms' }}>
              <Link to="/student" className="btn-primary text-base px-8 py-4 flex items-center gap-2 shadow-lg shadow-primary-500/25">
                Find a Teacher <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo-booking" className="btn-outline-primary text-base px-8 py-4 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Book Free Demo
              </Link>
            </div>

            {/* Social proof row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '350ms' }}>
              <span className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1 font-semibold text-neutral-700">4.9 / 5</span>
              </span>
              <span className="w-px h-4 bg-neutral-200" />
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-400" /> 125+ students enrolled</span>
              <span className="w-px h-4 bg-neutral-200" />
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 25+ vetted tutors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="py-14 border-y border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`reveal-on-scroll text-center flex flex-col items-center gap-3 p-5 rounded-2xl border ${s.border} bg-white hover:shadow-md transition-all duration-300`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                    <Icon className={`w-5.5 h-5.5 ${s.color}`} />
                  </div>
                  <div>
                    <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-[12.5px] text-neutral-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TWO CARDS ─── */}
      <section className="relative py-16 bg-slate-50/60 overflow-hidden border-y border-neutral-100">
        {/* Decorative background grid and blurs */}
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 text-xs font-semibold text-primary-700 rounded-full mb-3 uppercase tracking-wider">
              Choose Your Path
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight animate-slide-up">
              How Can We Help You?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* For Students / Parents */}
            <div className="reveal-on-scroll slide-left bg-white rounded-2xl border border-neutral-200/60 border-l-4 border-l-primary-500 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-r-neutral-300 hover:border-t-neutral-300 hover:border-b-neutral-300 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group">
              <div className="w-20 h-20 bg-primary-50/50 border border-primary-100/50 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <img src="/learning_3d_icon.png" alt="Student Learning" className="w-16 h-16 object-contain group-hover:rotate-3 transition-transform duration-300" />
              </div>
              <div className="flex-grow flex flex-col h-full">
                <div className="mb-2">
                  <span className="inline-block text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-0.5 rounded border border-primary-100/50">
                    Parents & Students
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1">Find Your Home Teacher</h3>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  Connect with verified home tutors for personalized 1-on-1 tuition at your doorstep.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-auto pt-4 border-t border-neutral-100">
                  <Link to="/student" className="btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 px-5 shadow-sm">
                    Find Tutors <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/demo-booking" className="btn-outline-primary py-2.5 text-xs font-bold px-5">
                    Free Demo
                  </Link>
                </div>
              </div>
            </div>

            {/* For Teachers */}
            <div className="reveal-on-scroll slide-right bg-white rounded-2xl border border-neutral-200/60 border-l-4 border-l-secondary-500 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-r-neutral-300 hover:border-t-neutral-300 hover:border-b-neutral-300 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group">
              <div className="w-20 h-20 bg-secondary-50/50 border border-secondary-100/50 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <img src="/teaching_3d_icon.png" alt="Tutor Mission" className="w-16 h-16 object-contain group-hover:-rotate-3 transition-transform duration-300" />
              </div>
              <div className="flex-grow flex flex-col h-full">
                <div className="mb-2">
                  <span className="inline-block text-[10px] font-bold text-secondary-600 uppercase tracking-wider bg-secondary-50 px-2.5 py-0.5 rounded border border-secondary-100/50">
                    Tutors & Educators
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1">Join Cograd's Mission</h3>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  Grow your tutoring career with flexible scheduling and premium compensation rates.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-auto pt-4 border-t border-neutral-100">
                  <Link to="/teacher" className="btn-secondary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 px-5 shadow-sm">
                    Learn More <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/register/teacher" className="btn-outline-secondary py-2.5 text-xs font-bold px-5">
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ─── WHY COGRAD ─── */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Our Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">Why Families Choose Us</h2>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto">Built from the ground up for Tier 3 India — every feature reflects the needs of home tuition students and families.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="reveal-on-scroll bg-neutral-50 rounded-2xl p-6 border border-neutral-100 hover:bg-white hover:shadow-md hover:border-neutral-200 transition-all duration-300 text-center group"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:border-primary-200 group-hover:bg-primary-50 transition-all duration-300 shadow-sm">
                    <Icon className="w-5.5 h-5.5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">Get Started in 3 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200" />

            {[
              { step: '01', title: 'Book a Free Demo', desc: 'Fill out our simple booking form. We match you with the right verified teacher within 24 hours.', icon: Clock, color: 'bg-blue-600', ring: 'ring-blue-100' },
              { step: '02', title: 'Meet Your Teacher', desc: 'Your assigned tutor visits your home at your preferred time for a complimentary demo session.', icon: Users, color: 'bg-violet-600', ring: 'ring-violet-100' },
              { step: '03', title: 'Start Learning',   desc: 'Enjoy personalised, structured lessons with regular progress reports shared with parents.', icon: TrendingUp, color: 'bg-emerald-600', ring: 'ring-emerald-100' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="reveal-on-scroll bg-white rounded-2xl p-7 border border-neutral-100 shadow-sm hover:shadow-md transition-all text-center relative"
                  style={{ transitionDelay: `${i * 110}ms` }}
                >
                  <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ring-4 ${item.ring}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-black text-neutral-300 mb-2 tracking-widest">STEP {item.step}</div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DISTRICTS ─── */}
      <section className="relative py-20 bg-white border-t border-neutral-100 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Centered Section Title */}
          <div className="text-center mb-12 reveal-on-scroll">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 border border-primary-100 text-xs font-bold text-primary-700 rounded-full mb-3 uppercase tracking-widest animate-pulse">
              Coverage Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-wide leading-tight">
              Where We Operate
            </h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed tracking-wide">
              Currently serving Meerut and Allahabad — expanding rapidly across Uttar Pradesh.
            </p>
          </div>

          {/* Unified Dashboard Widget */}
          <div className="max-w-4xl mx-auto reveal-on-scroll bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: Interactive SVG Map Panel */}
            <div className="w-full lg:col-span-5 flex flex-col justify-center items-center bg-slate-50/50 border border-slate-100/80 rounded-2xl p-4 relative overflow-hidden min-h-[300px]">
              <svg viewBox="0 0 450 300" className="w-full h-full text-neutral-300">
                <defs>
                  <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#eff6ff" />
                  </linearGradient>
                  <linearGradient id="mapBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <pattern id="dotGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.6" />
                  </pattern>
                </defs>
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .animate-dash-flow {
                    stroke-dasharray: 6, 4;
                    animation: dash 3s linear infinite;
                  }
                `}</style>

                {/* Styled Background State Shape (Uttar Pradesh approximation) */}
                <path
                  d="M 30 110 C 50 60, 100 40, 150 70 C 200 90, 250 80, 300 110 C 350 130, 420 140, 440 180 C 460 210, 420 250, 390 260 C 350 270, 310 240, 280 250 C 230 260, 180 270, 150 220 C 120 180, 70 200, 40 170 C 20 150, 20 130, 30 110 Z"
                  fill="url(#mapGrad)"
                  stroke="url(#mapBorder)"
                  strokeWidth="2.5"
                />
                <path
                  d="M 30 110 C 50 60, 100 40, 150 70 C 200 90, 250 80, 300 110 C 350 130, 420 140, 440 180 C 460 210, 420 250, 390 260 C 350 270, 310 240, 280 250 C 230 260, 180 270, 150 220 C 120 180, 70 200, 40 170 C 20 150, 20 130, 30 110 Z"
                  fill="url(#dotGrid)"
                  pointerEvents="none"
                />

                {/* Connection paths */}
                <g fill="none" strokeWidth="1.5">
                  <path d="M 60 110 L 85 80" stroke="#94a3b8" strokeDasharray="3, 3" className="opacity-50" />
                  <path d="M 85 80 Q 150 120, 220 150" stroke="url(#lineGrad)" className="animate-dash-flow" />
                  <path d="M 220 150 Q 270 190, 320 220" stroke="url(#lineGrad)" className="animate-dash-flow" />
                  <path d="M 220 150 L 380 215" stroke="#cbd5e1" strokeDasharray="4, 4" className="opacity-40" />
                  <path d="M 320 220 L 380 215" stroke="#cbd5e1" strokeDasharray="4, 4" className="opacity-40" />
                </g>

                {/* City Nodes */}
                {[
                  { name: 'Noida', x: 60, y: 110, status: 'Soon', color: '#94a3b8' },
                  { name: 'Meerut', x: 85, y: 80, status: 'Active', color: '#10b981', index: 0 },
                  { name: 'Lucknow', x: 220, y: 150, status: 'Soon', color: '#94a3b8' },
                  { name: 'Allahabad', x: 320, y: 220, status: 'Launching', color: '#f59e0b', index: 1 },
                  { name: 'Varanasi', x: 380, y: 215, status: 'Soon', color: '#94a3b8' },
                ].map((c) => {
                  const isInteractive = c.index !== undefined;
                  const isActive = isInteractive && selectedDistrict === c.index;
                  const nodeColor = isActive 
                    ? (c.index === 0 ? '#3b82f6' : '#8b5cf6')
                    : c.color;

                  return (
                    <g 
                      key={c.name} 
                      className={isInteractive ? 'cursor-pointer group/node' : 'opacity-70'}
                      onClick={() => isInteractive && setSelectedDistrict(c.index)}
                    >
                      {/* Concentric pulsing circles for active node */}
                      {isActive && (
                        <>
                          <circle cx={c.x} cy={c.y} r="6" fill={nodeColor} opacity="0.4">
                            <animate attributeName="r" values="6;22" dur="2.5s" begin="0s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0" dur="2.5s" begin="0s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={c.x} cy={c.y} r="6" fill={nodeColor} opacity="0.4">
                            <animate attributeName="r" values="6;22" dur="2.5s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0" dur="2.5s" begin="1.25s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}

                      {/* Main Node Point */}
                      <circle 
                        cx={c.x} 
                        cy={c.y} 
                        r={isActive ? "6" : "4.5"} 
                        fill={nodeColor} 
                        className="transition-all duration-300 stroke-white stroke-2 group-hover/node:scale-125"
                        style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                      />

                      {/* Node label */}
                      <text 
                        x={c.x} 
                        y={c.y - 12} 
                        textAnchor="middle" 
                        className={`text-[10px] select-none transition-all duration-300 ${
                          isActive 
                            ? 'font-bold fill-neutral-900 drop-shadow-sm' 
                            : 'font-semibold fill-neutral-400 group-hover/node:fill-neutral-700'
                        }`}
                        style={{ transformOrigin: `${c.x}px ${c.y - 12}px` }}
                      >
                        {c.name}
                      </text>

                      {/* Mini status indicator */}
                      {!isInteractive && (
                        <text 
                          x={c.x} 
                          y={c.y + 13} 
                          textAnchor="middle" 
                          className="text-[6.5px] font-medium fill-neutral-400 tracking-wide select-none"
                        >
                          {c.status}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-neutral-200/80 shadow-sm rounded-full text-[9px] font-bold text-neutral-600 tracking-wider uppercase z-20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Interactive Coverage Map
              </div>
            </div>

            {/* Right Side: Interactive Details Panel */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              {/* Tab Selector */}
              <div className="flex bg-slate-100/85 p-1.5 rounded-xl border border-slate-200/50">
                {DISTRICTS.map((d, index) => (
                  <button
                    key={d.city}
                    onClick={() => setSelectedDistrict(index)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedDistrict === index
                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/40'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {d.city}
                    {d.status === 'Active' ? (
                      <span className="ml-1.5 w-1.5 h-1.5 inline-block bg-emerald-500 rounded-full animate-pulse" />
                    ) : (
                      <span className="ml-1.5 w-1.5 h-1.5 inline-block bg-amber-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* District Detail Content */}
              <div className="flex-grow flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{DISTRICTS[selectedDistrict].city}</h3>
                    <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                      {DISTRICTS[selectedDistrict].desc}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${DISTRICTS[selectedDistrict].statusColor}`}>
                    {DISTRICTS[selectedDistrict].status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors duration-300">
                    <div className={`text-3xl font-extrabold ${selectedDistrict === 0 ? 'text-primary-600' : 'text-secondary-600'}`}>
                      {DISTRICTS[selectedDistrict].students}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1.5 font-semibold tracking-wide uppercase">
                      {DISTRICTS[selectedDistrict].statsLabel1}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors duration-300">
                    <div className={`text-3xl font-extrabold ${selectedDistrict === 0 ? 'text-primary-600' : 'text-secondary-600'}`}>
                      {DISTRICTS[selectedDistrict].teachers}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1.5 font-semibold tracking-wide uppercase">
                      {DISTRICTS[selectedDistrict].statsLabel2}
                    </div>
                  </div>
                </div>
              </div>

              {/* Call-to-Action */}
              <Link
                to={DISTRICTS[selectedDistrict].link}
                className={`w-full py-3.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  selectedDistrict === 0 
                    ? 'btn-primary shadow-sm shadow-primary-500/10 hover:shadow-primary-500/25' 
                    : 'btn-secondary shadow-sm shadow-secondary-500/10 hover:shadow-secondary-500/25'
                }`}
              >
                {DISTRICTS[selectedDistrict].actionText} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">Loved by Families</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="reveal-on-scroll bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-grid-subtle opacity-10" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
                <Zap className="w-7 h-7 text-amber-300" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
                Join students across Meerut getting quality education right at home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/student" className="btn-slide-white px-8 py-4 text-base gap-2">
                  Find a Teacher <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/teacher" className="btn-outline-white px-8 py-4 text-base">
                  Join as Teacher
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
