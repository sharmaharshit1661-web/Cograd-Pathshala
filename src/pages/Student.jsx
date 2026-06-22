import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Star, 
  Clock, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  X, 
  Sparkles,
  MapPin
} from 'lucide-react';

const TUTORS_DATA = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    subject: 'Mathematics',
    rating: 4.9,
    experience: '8 years',
    specialties: ['CBSE Maths', 'ICSE Maths', 'Geometry'],
    rate: '₹600/hour',
    city: 'Meerut',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'PhD in Applied Mathematics. Dedicated to making school board algebra and geometry simple and intuitive for students.'
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    subject: 'Physics',
    rating: 4.8,
    experience: '12 years',
    specialties: ['CBSE Physics', 'ICSE Physics', 'State Board'],
    rate: '₹650/hour',
    city: 'Allahabad',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bio: 'Former university professor. Specializes in preparing secondary school students for physics board examinations.'
  },
  {
    id: 3,
    name: 'Ms. Emily Davis',
    subject: 'English',
    rating: 4.9,
    experience: '6 years',
    specialties: ['CBSE English', 'ICSE English', 'IB English'],
    rate: '₹500/hour',
    city: 'Lucknow',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bio: 'Passionate English educator focusing on communication skills, literature appreciation, and board-level academic writing.'
  },
  {
    id: 4,
    name: 'Mr. Rajesh Kumar',
    subject: 'Chemistry',
    rating: 4.7,
    experience: '9 years',
    specialties: ['CBSE Chemistry', 'ICSE Chemistry', 'State Board'],
    rate: '₹600/hour',
    city: 'Meerut',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bio: 'Chemistry enthusiast who designs creative visual aids and fun home-based experiments to explain school board science concepts.'
  },
  {
    id: 5,
    name: 'Dr. Anjali Gupta',
    subject: 'Biology',
    rating: 4.9,
    experience: '10 years',
    specialties: ['CBSE Biology', 'ICSE Biology', 'State Board'],
    rate: '₹650/hour',
    city: 'Allahabad',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bio: 'Medical research scholar. Focuses on bringing practical biological insights into secondary school board biology lessons.'
  },
  {
    id: 6,
    name: 'Mr. David Wilson',
    subject: 'Computer Science',
    rating: 4.8,
    experience: '7 years',
    specialties: ['CBSE Coding', 'ICSE Computer Applications', 'State Board CS'],
    rate: '₹700/hour',
    city: 'Delhi NCR',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bio: 'Software engineer turned educator. Helps students build real-world coding projects aligned with board school curriculum.'
  }
];

const SUBJECTS = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science'
];

const WHY_CHOOSE_US = [
  {
    icon: CheckCircle,
    title: 'Verified Tutors',
    description: 'All our tutors are thoroughly vetted and verified for qualifications, background, and teaching experience.'
  },
  {
    icon: GraduationCap,
    title: 'Personalized Learning',
    description: 'Get customized lesson plans tailored to your child\'s learning style, speed, and specific academic goals.'
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book sessions at your convenience with easy rescheduling and flexible day/time options.'
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'Our students show significant academic improvements, reporting an average increase of two grades within three months.'
  },
  {
    icon: Users,
    title: 'Personal Mentor Matching',
    description: 'Tutors are carefully matched based on the child\'s unique learning needs, curriculum, and personality.'
  },
  {
    icon: Search,
    title: 'Progress Tracking',
    description: 'Monitor performance over time with regular detailed report cards, assessments, and feedback loops.'
  }
];

const Student = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || 'All';
  const initialArea = searchParams.get('area') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [areaQuery, setAreaQuery] = useState(initialArea);

  const [bookingTutor, setBookingTutor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const containerRef = useRef(null);

  // Sync state if search params change (e.g. searching again from home)
  useEffect(() => {
    const loc = searchParams.get('location') || 'All';
    const ar = searchParams.get('area') || '';
    setSelectedCity(loc);
    setAreaQuery(ar);
  }, [searchParams]);

  const filteredTutors = TUTORS_DATA.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tutor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || tutor.subject === selectedSubject;
    const matchesCity = selectedCity === 'All' || tutor.city === selectedCity;
    const matchesArea = !areaQuery || 
                        tutor.bio.toLowerCase().includes(areaQuery.toLowerCase()) || 
                        tutor.specialties.some(s => s.toLowerCase().includes(areaQuery.toLowerCase()));
    return matchesSearch && matchesSubject && matchesCity && matchesArea;
  });

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
        threshold: 0.05,
      }
    );

    const elements = containerRef.current?.querySelectorAll('.reveal-on-scroll') || [];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [filteredTutors]);

  const handleBookSession = (tutor) => {
    setBookingTutor(tutor);
    setBookingSuccess(false);
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      
      {/* Hero Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100 bg-dot-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-fade-in">
              Find Your Perfect <span className="color-blend-blue">Home Teacher</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in">
              Connect with verified, experienced teachers who will come to your home and help your child achieve academic goals. Personalized learning, flexible scheduling, and regular progress tracking.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.1)] focus-within:border-primary-400 focus-within:scale-[1.01] p-1.5 flex items-center">
                <div className="flex items-center pl-4 flex-1">
                  <Search className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for tutors by subject, name, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                  />
                </div>
                <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 btn-shimmer cursor-pointer active:scale-95 flex items-center gap-2 shadow-sm">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Filter by City */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 animate-slide-up">
              <span className="text-xs font-bold text-gray-400 self-center uppercase tracking-wider mr-2">City:</span>
              {['All', 'Meerut', 'Allahabad', 'Lucknow', 'Delhi NCR'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    if (city === 'All') {
                      searchParams.delete('location');
                    } else {
                      searchParams.set('location', city);
                    }
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 active:scale-95 ${
                    selectedCity === city
                      ? 'bg-primary-500 text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {areaQuery && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700 animate-slide-up mb-6 animate-fade-in">
                <MapPin className="w-3.5 h-3.5 text-primary-500" />
                <span>Area filter: <strong>"{areaQuery}"</strong></span>
                <button 
                  onClick={() => { 
                    setAreaQuery(''); 
                    searchParams.delete('area'); 
                    setSearchParams(searchParams); 
                  }} 
                  className="hover:text-primary-900 font-bold ml-1 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-slide-up">
              <Link to="/register/student" className="btn-primary flex-1 py-3 btn-shimmer active:scale-95">
                Get Started
              </Link>
              <a href="#tutors-list" className="btn-outline-primary flex-1 py-3 btn-shimmer active:scale-95">
                Browse Tutors
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter by Subject */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Subjects</h2>
            <p className="text-gray-600 text-sm">Filter tutors by subject and find the perfect match for your child</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-5 py-2.5 rounded-xl border font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-md active:scale-95 ${
                  selectedSubject === subject
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent shadow-md scale-[1.015]'
                    : 'bg-gradient-to-r from-primary-50 to-purple-50 text-gray-700 border-primary-200/60 hover:bg-white hover:border-primary-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Listing Grid */}
      <section id="tutors-list" className="py-16 bg-dot-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Tutors</h2>
            <p className="text-gray-600 text-sm">Meet some of our top-rated tutors who are ready to help you succeed</p>
          </div>

          {filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutors.map((tutor, index) => (
                <div 
                  key={`${tutor.id}-${selectedSubject}`} 
                  className="reveal-on-scroll tutor-card-reveal card overflow-hidden flex flex-col justify-between group"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary-100 shadow flex-shrink-0 group-hover:border-primary-400 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                        <img
                          src={tutor.image}
                          alt={tutor.name}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-500 transition-colors duration-300">{tutor.name}</h3>
                        <span className="inline-block bg-primary-50 text-primary-600 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1">
                          {tutor.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 border-y border-gray-50 py-2.5">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                        <span className="font-bold text-gray-800 text-sm">{tutor.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-semibold">{tutor.experience} exp</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                      {tutor.bio}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.specialties.map((spec) => (
                          <span key={spec} className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-primary-100 transition-colors duration-200">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-t border-gray-100 p-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-primary-500">{tutor.rate}</span>
                    <button
                      onClick={() => handleBookSession(tutor)}
                      className="btn-primary text-sm py-2 px-5 font-bold btn-shimmer cursor-pointer active:scale-95"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow border border-gray-100 max-w-lg mx-auto">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No tutors found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSubject('All'); }}
                className="mt-4 text-primary-500 font-bold hover:underline"
              >
                Clear filters and search again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white border-t border-gray-100 bg-grid-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why Students Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We provide everything you need for successful home learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {WHY_CHOOSE_US.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.title} 
                  className="reveal-on-scroll text-center p-8 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.06)] hover:-translate-y-1.5 group cursor-pointer border border-transparent hover:border-gray-100"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-105 group-hover:rotate-3 group-hover:bg-primary-100/80 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <IconComp className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-6">Start Your Learning Journey Today</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their grades and confidence with our expert home tutors.
          </p>
          <Link to="/register/student" className="btn-slide-white px-8 py-4 text-lg btn-shimmer active:scale-95">
            Find Your Tutor
          </Link>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 role-modal-backdrop"
            onClick={() => setBookingTutor(null)}
          />

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-100 relative z-10 animate-slide-up">
            <button
              onClick={() => setBookingTutor(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={confirmBooking} className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 mx-auto mb-3 shadow">
                    <img src={bookingTutor.image} alt={bookingTutor.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Book a Session</h3>
                  <p className="text-sm text-gray-500">with {bookingTutor.name} ({bookingTutor.subject})</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name</label>
                    <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Student name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Phone Number</label>
                    <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+91 xxxxx xxxxx" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
                      <input required type="date" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
                      <select required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white">
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" className="w-full btn-primary py-3 font-bold text-center btn-shimmer active:scale-95">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Inquiry Sent!</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Thank you! We have received your booking inquiry for <strong>{bookingTutor.name}</strong>. Our team will contact you within 24 hours to schedule the session.
                </p>
                <button
                  onClick={() => setBookingTutor(null)}
                  className="w-full btn-primary py-2.5 font-bold btn-shimmer active:scale-95"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Student;
