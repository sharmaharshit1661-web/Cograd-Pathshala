import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, MapPin, GraduationCap, Sparkles, Compass,
  ShieldCheck, Heart, ArrowRight, Globe,
} from 'lucide-react';

/* ── Custom Brand Icons ── */
const LinkedInIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal-on-scroll');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

const TIMELINE = [
  { year: '2020', title: 'Cograd Founded', desc: 'Started with a vision to democratize education across non-metropolitan India.', icon: Compass },
  { year: '2021', title: 'First Home Tuition', desc: 'Assigned our first verified home tutor in Uttar Pradesh.', icon: MapPin },
  { year: '2022', title: 'Shark Tank India', desc: 'Featured on Shark Tank India, securing investments and national credibility.', img: '/shark-tank.png' },
  { year: '2023', title: '500+ Assigned Tutors', desc: 'Vetted and assigned 500+ home tutors across major districts.', icon: Users },
  { year: '2024', title: 'Pathshala Launch', desc: 'Launched home tuition platform across metro and tier-2/3 cities in India.', icon: GraduationCap },
];

const VALUES = [
  { title: 'Empathy', desc: 'Understanding the unique challenges of families and adapting to individual student needs.', icon: Heart, color: 'bg-rose-50   text-rose-600', border: 'border-rose-100', glow: 'group-hover:shadow-rose-100' },
  { title: 'Innovation', desc: 'Using technology to bridge educational divides and build interactive tools.', icon: Sparkles, color: 'bg-amber-50  text-amber-600', border: 'border-amber-100', glow: 'group-hover:shadow-amber-100' },
  { title: 'Community', desc: 'Building sustainable micro-economies by recruiting local, trained teachers.', icon: Users, color: 'bg-blue-50   text-blue-600', border: 'border-blue-100', glow: 'group-hover:shadow-blue-100' },
  { title: 'Excellence', desc: 'Maintaining high curriculum standards, thorough vetting, and transparency.', icon: ShieldCheck, color: 'bg-violet-50 text-violet-600', border: 'border-violet-100', glow: 'group-hover:shadow-violet-100' },
];

const TEAM = [
  {
    name: 'Himanshu Chaurasia',
    role: 'Founder & CEO',
    desc: 'I had the vision to build a trusted network for home tuitions in India. I handle and guide the team as the executive, driving our mission to democratize quality education across India.',
    img: '/himanshu.png',
    tag: 'Visionary',
    linkedin: 'https://www.linkedin.com/in/chaurasia-himanshu/',
    website: 'https://cograd.in/',
  },
  {
    name: 'Saurabh Yadav',
    role: 'Co-founder & COO',
    desc: 'I joined the Cograd team as COO at a very early age. I handle the operations side of Cograd, ensuring seamless delivery and excellence in every district we serve.',
    img: '/saurabh.jpg',
    tag: 'Operations',
    linkedin: 'https://www.linkedin.com/in/saurabh-yadav-8048a013b/',
    website: 'https://cograd.in/',
  },
];

const About = () => {
  const pageRef = useReveal();

  return (
    <div ref={pageRef} className="min-h-screen bg-neutral-50">

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 bg-white border-b border-neutral-100 bg-dot-subtle relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-secondary-50 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-5 py-2.5 bg-white border rounded-full text-xs sm:text-sm font-semibold mb-6 animate-badge-glow badge-shimmer-sweep shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
            <span className="text-gradient-shark">Shark Tank India Featured Company</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 mb-5 tracking-tight leading-[1.1]">
            About <span className="color-blend-text">Cograd</span>
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            We're on a mission to bridge the educational gap — connecting qualified, vetted home teachers with students in Tier 3 districts.
          </p>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-neutral-900 mb-5 reveal-on-scroll">
                Education accessible to every child
              </h2>
              <div className="space-y-4 text-neutral-500 text-[15px] leading-relaxed">
                <p className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
                  To democratize quality education by making it accessible, affordable, and effective for every student — regardless of their geography or economic background.
                </p>
                <p className="reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
                  Every child deserves access to excellent teachers and structured mentoring, starting in areas where schools and resources are most needed.
                </p>
              </div>

              <div className="mt-7 flex items-start gap-4 p-5 bg-primary-50 border border-primary-100 rounded-2xl reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
                <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-0.5">Doorstep Learning Approach</h4>
                  <p className="text-sm text-neutral-500">We provide direct personal tutoring where development challenges are greatest.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm reveal-on-scroll slide-right">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Our Vision</h3>
              <ul className="space-y-4">
                {[
                  'Transform home tuition and local educational landscapes through technology.',
                  'Create sustainable livelihoods for qualified local teachers.',
                  'Build a replicable, high-impact model for Tier 3 districts.',
                  'Empower families with transparent student progress metrics.',
                ].map((v, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {v}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">History</p>
            <h2 className="text-3xl font-bold text-neutral-900">Our Journey</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-100 via-primary-200 to-secondary-100" />
            <div className="space-y-9">
              {TIMELINE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="reveal-on-scroll flex gap-5" style={{ transitionDelay: `${i * 90}ms` }}>
                    <div className="w-12 h-12 bg-white border-2 border-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm z-10 relative overflow-hidden hover:border-primary-300 transition-colors">
                      {item.img ? (
                        <img src={item.img} alt={item.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <Icon className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <div className="text-xs font-bold text-primary-600 mb-1 tracking-widest">{item.year}</div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Values ─── */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Principles</p>
            <h2 className="text-3xl font-bold text-neutral-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className={`reveal-on-scroll group bg-white rounded-2xl p-6 border ${v.border} shadow-sm hover:shadow-lg transition-all duration-300 text-center`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${v.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Founders ─── */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">The People Behind It</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Meet Our <span className="color-blend-text">Founders</span>
            </h2>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
              Two passionate leaders who left their comfort zones to build a better future for India's home tuition network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM.map((m, i) => (
              <div
                key={i}
                className={`reveal-on-scroll ${i === 0 ? 'slide-left' : 'slide-right'} group bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 overflow-hidden flex flex-col`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Image area */}
                <div className="relative bg-gradient-to-br from-neutral-50 to-primary-50/30 p-8 pb-0 flex justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-grid-subtle opacity-40" />
                  {/* Glow blob */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-100/50 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-56 h-56 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {/* Tag badge */}
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-primary-600 text-white text-[11px] font-bold rounded-full shadow-lg">
                      {m.tag}
                    </div>
                  </div>
                </div>

                {/* Info area */}
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-neutral-900">{m.name}</h3>
                    <p className="text-sm font-semibold text-primary-600 mt-0.5">{m.role}</p>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed flex-grow">{m.desc}</p>

                  {/* Social links */}
                  <div className="flex gap-2 mt-5">
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:border-[#0077b5]/20 transition-all duration-300"
                        title="LinkedIn Profile"
                      >
                        <LinkedInIcon className="w-4 h-4" />
                      </a>
                    )}
                    {m.website && (
                      <a
                        href={m.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all duration-300"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-subtle opacity-10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-white text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Join Our Mission Today</h2>
            <p className="text-white/75 max-w-md">Whether you're a teacher or parent, we're here to support you every step of the way.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/register/teacher" className="btn-slide-white px-8 py-3.5 flex items-center gap-2">
              Join as Teacher <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register/student" className="btn-outline-white px-8 py-3.5">
              Find Teachers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
