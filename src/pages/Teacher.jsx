import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Users, TrendingUp, Clock, ShieldAlert, GraduationCap,
  Award, Heart, ChevronLeft, ChevronRight, ArrowRight, CheckCircle,
} from 'lucide-react';

const SLIDES = [
  { id: 1, title: 'Modern Teaching', subtitle: 'Join innovative educators using technology to inspire learners.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80' },
  { id: 2, title: 'Impact Lives', subtitle: 'Teach students in Tier 3 districts and witness real community change.', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80' },
  { id: 3, title: 'Earn More', subtitle: 'Earn 20–30% higher than local market rates with weekly settlements.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80' },
  { id: 4, title: 'Flexible Schedule', subtitle: 'Choose your home visits and scheduling times with complete freedom.', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80' },
  { id: 5, title: 'Professional Growth', subtitle: 'Build brand credibility, earn certificates, and advance your career.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80' },
];

const BENEFITS = [
  { icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', title: 'Competitive Earnings', desc: 'Teachers earn an average of ₹600/hr. Set your own rates and get paid weekly.' },
  { icon: Users, color: 'bg-blue-50 text-blue-600', title: 'Smart Matching', desc: 'Our algorithm connects you with students that fit your teaching style and expertise.' },
  { icon: TrendingUp, color: 'bg-violet-50 text-violet-600', title: 'Track Progress', desc: 'Analytics help you monitor student growth and showcase your impact.' },
  { icon: Clock, color: 'bg-orange-50 text-orange-600', title: 'Flexible Schedule', desc: 'Set your availability and work around your existing commitments freely.' },
  { icon: ShieldAlert, color: 'bg-rose-50 text-rose-600', title: 'Full Support', desc: 'We handle payments and admin so you can focus on teaching.' },
  { icon: GraduationCap, color: 'bg-indigo-50 text-indigo-600', title: 'Career Growth', desc: 'Access professional development resources to advance your teaching career.' },
  { icon: Award, color: 'bg-teal-50 text-teal-600', title: 'Recognition', desc: 'Earn verified badges and build a stellar profile that attracts students.' },
  { icon: Heart, color: 'bg-pink-50 text-pink-600', title: 'Make a Difference', desc: 'See the direct impact of your teaching on student success and community.' },
];

const STATS = [
  { value: '10,000+', label: 'Active Students' },
  { value: '500+', label: 'Expert Teachers' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '₹2M+', label: 'Paid to Teachers' },
];

const Teacher = () => {
  const [slide, setSlide] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    const els = containerRef.current?.querySelectorAll('.reveal-on-scroll') || [];
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-neutral-100 bg-dot-subtle relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-50 rounded-full blur-[80px] opacity-60 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-5 tracking-tight">
            Transform Lives Through{' '}
            <span className="color-blend-purple">Home Tutoring</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Cograd's mission — connect with students in Tier 3 districts, set your own schedule, and earn 20–30% above market rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register/teacher" className="btn-secondary text-base px-7 py-3.5 gap-2">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#benefits" className="btn-outline-secondary text-base px-7 py-3.5">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">Experience Modern Teaching</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 lg:h-[440px] reveal-on-scroll">
            {SLIDES.map((s, i) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${s.image}")` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/85 via-neutral-900/50 to-transparent flex items-center">
                    <div className="text-white px-10 md:px-16 max-w-lg">
                      <h3 className={`text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight transition-all duration-500 ${i === slide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {s.title}
                      </h3>
                      <p className={`text-white/80 text-base leading-relaxed transition-all duration-500 delay-100 ${i === slide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setSlide((p) => (p === 0 ? SLIDES.length - 1 : p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/35 transition-all z-20 cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setSlide((p) => (p + 1) % SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/35 transition-all z-20 cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className={`rounded-full transition-all cursor-pointer ${i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Why Join Us</p>
            <h2 className="text-3xl font-bold text-neutral-900">Why Teachers Choose Cograd</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="reveal-on-scroll bg-neutral-50 rounded-2xl p-6 hover:bg-white hover:shadow-sm hover:border hover:border-neutral-100 transition-all" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${b.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2 text-[15px]">{b.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 reveal-on-scroll bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 lg:p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Teaching?</h3>
            <p className="text-white/75 mb-6 max-w-lg mx-auto">Join our community and start making a difference in students' lives today.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register/teacher" className="btn-slide-white px-8 py-3.5 text-base">Apply Now</Link>
              <Link to="/contact" className="btn-outline-white px-8 py-3.5 text-base">Get in Touch</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14 pt-14 border-t border-neutral-100 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="reveal-on-scroll" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="text-3xl font-extrabold text-primary-600 mb-1">{s.value}</div>
                <div className="text-sm text-neutral-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Apply & Get Verified', desc: 'Submit your qualifications. Our team verifies credentials within 24 hours.', color: 'bg-blue-50 text-blue-600' },
              { step: '02', title: 'Create Your Profile', desc: 'Build an attractive profile showcasing expertise, subjects, and availability.', color: 'bg-violet-50 text-violet-600' },
              { step: '03', title: 'Start Teaching', desc: 'Get matched with local students, conduct sessions, and earn weekly.', color: 'bg-emerald-50 text-emerald-600' },
            ].map((item, i) => (
              <div key={i} className="reveal-on-scroll bg-white rounded-2xl p-7 border border-neutral-100 shadow-sm text-center hover:shadow-md transition-all" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-lg ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-primary-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Teaching Journey?</h2>
          <p className="text-white/75 mb-7">Thousands of educators are already earning and making a difference.</p>
          <Link to="/register/teacher" className="btn-slide-white px-8 py-3.5 text-base inline-flex items-center gap-2">
            Apply as Teacher <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Teacher;
