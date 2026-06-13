import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  GraduationCap, 
  Award, 
  Heart
} from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Modern Teaching',
    subtitle: 'Join our community of innovative educators using cutting-edge technology',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: 2,
    title: 'Impact Rural Lives',
    subtitle: 'Teach students in Tier 3 districts and witness direct community improvement',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: 3,
    title: 'Earn Vitals',
    subtitle: 'Earn 20-30% higher than local market tutoring rates with weekly settlements',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: 4,
    title: 'Flexible Schedules',
    subtitle: 'Choose your home visits and scheduling timings with complete flexibility',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  },
  {
    id: 5,
    title: 'Professional Growth',
    subtitle: 'Build brand credibility, gain formal certificates, and advance your tutoring career',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
  }
];

const BENEFITS = [
  {
    icon: DollarSign,
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    title: 'Competitive Earnings',
    desc: 'Set your own rates and get paid weekly. Our teachers earn an average of $40/hour with top performers earning $80+/hour.'
  },
  {
    icon: Users,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    title: 'Targeted Students',
    desc: 'Our smart matching algorithm connects you with students who are the perfect fit for your teaching style and expertise.'
  },
  {
    icon: TrendingUp,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    title: 'Track Progress',
    desc: 'Advanced analytics help you monitor student progress, identify areas for improvement, and showcase your impact.'
  },
  {
    icon: Clock,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    title: 'Flexible Schedule',
    desc: 'Teach when it works for you. Set your availability and work around your existing commitments with complete freedom.'
  },
  {
    icon: ShieldAlert,
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    title: 'Full Support',
    desc: 'We handle payments, scheduling, and admin work so you can focus on what you do best - teaching and inspiring students.'
  },
  {
    icon: GraduationCap,
    color: 'from-indigo-400 to-indigo-600',
    bgColor: 'bg-indigo-50',
    title: 'Career Growth',
    desc: 'Build your reputation, expand your reach, and access professional development resources to advance your teaching career.'
  },
  {
    icon: Award,
    color: 'from-teal-400 to-teal-600',
    bgColor: 'bg-teal-50',
    title: 'Professional Recognition',
    desc: 'Get verified badges, collect student reviews, and build a stellar teaching profile that showcases your expertise.'
  },
  {
    icon: Heart,
    color: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    title: 'Make a Difference',
    desc: 'Transform lives through education. See the direct impact of your teaching on student success and achievement.'
  }
];

const Teacher = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);

  // Scroll reveal setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    const elements = containerRef.current?.querySelectorAll('.reveal-on-scroll') || [];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 relative overflow-hidden bg-grid-subtle">
      
      {/* Hero Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-100 relative overflow-hidden bg-dot-subtle">
        {/* Decorative Floating Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/40 rounded-full opacity-40 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100/40 rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-slide-up">
              Transform Lives Through <span className="color-blend-purple">Rural Education</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              Join Cograd's mission to bridge the educational gap in rural areas. Connect with students in Tier 3 districts, set your own schedule, and make a meaningful impact while earning 20-30% higher than market rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <Link to="/register/teacher" className="btn-secondary btn-shimmer flex-1 py-3 active:scale-95 transition-all duration-300">
                Apply Now
              </Link>
              <a href="#modern-teaching-section" className="btn-outline-secondary flex-1 py-3 active:scale-95 transition-all duration-300">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Modern Teaching Carousel */}
      <section id="modern-teaching-section" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-on-scroll">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Experience Modern Teaching</h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Discover the world of localized education and see how our teachers are making a difference.
            </p>
          </div>

          {/* Interactive Carousel */}
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-[500px] reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat relative"
                  style={{ backgroundImage: `url("${slide.image}")` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-transparent flex items-center">
                    <div className="text-left text-white px-8 md:px-16 max-w-2xl">
                      <h3 className={`text-3xl lg:text-5xl font-black mb-4 tracking-tight drop-shadow-sm transition-all duration-700 ease-out transform ${
                        idx === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}>
                        {slide.title}
                      </h3>
                      <p className={`text-base lg:text-lg opacity-90 leading-relaxed drop-shadow transition-all duration-700 delay-150 ease-out transform ${
                        idx === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}>
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Nav Left */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all duration-200 z-20 hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Slider Nav Right */}
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all duration-200 z-20 hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-20">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>

            {/* Bottom Timer Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${((currentSlide + 1) / CAROUSEL_SLIDES.length) * 100}%` }}
              ></div>
            </div>

            {/* Page Count tag */}
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold z-20">
              {currentSlide + 1} / {CAROUSEL_SLIDES.length}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Benefits Section */}
      <section className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Why Teachers <span className="text-primary-500">Choose Us</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of educators who have transformed their teaching careers with our platform. Discover the benefits that make us the #1 choice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div 
                  key={idx} 
                  className="reveal-on-scroll group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between h-full"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 to-blue-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div>
                    <div className="mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-6`}>
                        <IconComp className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Card */}
          <div className="reveal-on-scroll mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 lg:p-12 text-white shadow-xl max-w-4xl mx-auto text-center" style={{ transitionDelay: '150ms' }}>
            <h3 className="text-3xl font-extrabold mb-4">Ready to Start Your Teaching Journey?</h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community today and start earning while making a difference in students' lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/register/teacher" className="btn-slide-white btn-shimmer px-8 py-3 active:scale-95 transition-all duration-300">
                Apply Now
              </Link>
              <Link to="/contact" className="btn-outline-white px-8 py-3 active:scale-95 transition-all duration-300">
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Big Number Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 text-center max-w-5xl mx-auto border-t border-gray-200/50 pt-16">
            <div className="reveal-on-scroll" style={{ transitionDelay: '0ms' }}>
              <div className="text-4xl lg:text-5xl font-black text-primary-500 mb-2">10,000+</div>
              <div className="text-gray-500 font-bold uppercase tracking-wider text-xs">Active Students</div>
            </div>
            <div className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="text-4xl lg:text-5xl font-black text-primary-500 mb-2">500+</div>
              <div className="text-gray-500 font-bold uppercase tracking-wider text-xs">Expert Teachers</div>
            </div>
            <div className="reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="text-4xl lg:text-5xl font-black text-primary-500 mb-2">4.9/5</div>
              <div className="text-gray-500 font-bold uppercase tracking-wider text-xs">Average Rating</div>
            </div>
            <div className="reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
              <div className="text-4xl lg:text-5xl font-black text-primary-500 mb-2">$2M+</div>
              <div className="text-gray-500 font-bold uppercase tracking-wider text-xs">Paid to Teachers</div>
            </div>
          </div>

        </div>
      </section>

      {/* How it works steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Getting started as a teacher on our platform is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="reveal-on-scroll text-center group" style={{ transitionDelay: '0ms' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg">
                <span className="text-2xl font-black text-white">01</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors group-hover:text-primary-500">Apply & Get Verified</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                Submit your application with qualifications and experience. Our team will verify your credentials within 24 hours.
              </p>
            </div>

            <div className="reveal-on-scroll text-center group" style={{ transitionDelay: '150ms' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg">
                <span className="text-2xl font-black text-white">02</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors group-hover:text-primary-500">Create Your Profile</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                Build an attractive profile showcasing your expertise, preferred subjects, and availability slots to attract students.
              </p>
            </div>

            <div className="reveal-on-scroll text-center group" style={{ transitionDelay: '300ms' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg">
                <span className="text-2xl font-black text-white">03</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors group-hover:text-primary-500">Start Teaching</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                Get matched with local students, conduct doorstep sessions, track progress, and start earning weekly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-primary-500 text-white text-center relative overflow-hidden reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
        {/* Subtle Decorative Floating Circles in Footer CTA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Start Your Teaching Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of teachers who are already earning and making a difference through our platform.
          </p>
          <Link to="/register/teacher" className="btn-slide-white btn-shimmer px-8 py-4 text-lg active:scale-95 transition-all duration-300">
            Apply as Teacher
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Teacher;
