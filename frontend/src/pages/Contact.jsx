import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  User, 
  Users,
  MessageSquare, 
  BookOpen, 
  CheckCircle,
  X,
  ArrowRight,
  GraduationCap,
  Plus,
  Minus
} from 'lucide-react';

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 98765 43210',
    desc: 'Available Monday to Saturday, 9 AM to 7 PM',
    color: 'from-green-400 to-green-600'
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'contact@cogradpathshala.com',
    desc: 'We respond to inquiries within 24 hours',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Anywhere in India',
    desc: 'Serving families across metro and tier-2/3 cities',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon-Sat: 9 AM - 7 PM',
    desc: 'Sunday: 10 AM - 2 PM slots available',
    color: 'from-orange-400 to-orange-600'
  }
];

const FAQS = [
  {
    question: 'How much do home tuition classes cost?',
    answer: 'The cost varies based on the student\'s grade level and subjects, typically ranging from ₹1,500 to ₹3,500 per month. Get a free trial session to receive a custom quote.'
  },
  {
    question: 'What qualifications do your teachers have?',
    answer: 'All our instructors are local graduates or trained educators who undergo rigorous vetting, background checks, and subject expertise evaluation before matching.'
  },
  {
    question: 'Can I choose my preferred teacher?',
    answer: 'Yes! After your free demo session, you can share feedback, and we will pair you with a tutor whose style and schedule match your child\'s requirements.'
  },
  {
    question: 'How do you track student progress?',
    answer: 'We provide monthly progress reports and test result updates on the student dashboard, accompanied by regular discussions with parents.'
  }
];

const CONFETTI_PARTICLES = Array.from({ length: 40 }).map((_, i) => {
  const left = Math.random() * 100;
  const size = Math.random() * 8 + 6;
  const delay = Math.random() * 3;
  const color = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 7)];
  const duration = Math.random() * 2 + 2;
  return { id: i, left, size, delay, color, duration };
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Student',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(prev => prev === idx ? null : idx);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    setRefCode('MSG-' + Math.floor(100000 + Math.random() * 900000));
    setShowSuccess(true);
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Student',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100 bg-dot-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-slide-up">
              Get in <span className="color-blend-text">Touch</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed animate-slide-up" style={{ animationDelay: '150ms' }}>
              Have questions about our home tuition services? Want to join as a teacher? We are here to help you get started on your educational journey.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of contact details */}
      <section className="py-16 bg-white border-b border-gray-100 bg-grid-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-on-scroll">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Multiple Ways to Connect</h2>
            <p className="text-gray-600 text-sm">Choose the most convenient way to reach us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_METHODS.map((method, idx) => {
              const IconComp = method.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal-on-scroll"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-md`}>
                    <IconComp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-base font-extrabold text-primary-500 mb-1">{method.value}</p>
                  <p className="text-gray-500 text-xs">{method.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form and Quick Actions */}
      <section className="py-16 bg-slate-50 relative overflow-hidden bg-dot-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Form card - Takes 7 columns of 12 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 lg:col-span-7 reveal-on-scroll slide-left">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Send us a <span className="color-blend-text">Message</span>
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label text-xs font-semibold">
                      <User className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                      Your Name
                    </label>
                    <div className="relative focus-within-icon-parent">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label text-xs font-semibold">
                      <Mail className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                      Email Address
                    </label>
                    <div className="relative focus-within-icon-parent">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs font-semibold">
                    <Phone className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                    Phone Number
                  </label>
                  <div className="relative focus-within-icon-parent">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      title="Please enter a valid 10-digit mobile number starting with 6-9"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs font-semibold block mb-2 text-slate-700">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { role: 'Student', icon: GraduationCap, label: 'Student', activeClass: 'border-blue-500 text-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20' },
                      { role: 'Parent', icon: Users, label: 'Parent', activeClass: 'border-amber-500 text-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20' },
                      { role: 'Teacher', icon: BookOpen, label: 'Teacher', activeClass: 'border-purple-500 text-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20' }
                    ].map(item => {
                      const IconComp = item.icon;
                      const isSelected = formData.role === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: item.role }))}
                          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer text-xs sm:text-sm font-bold ${
                            isSelected 
                              ? `${item.activeClass} shadow-sm scale-[1.02]` 
                              : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs font-semibold">
                    <MessageSquare className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                    Message
                  </label>
                  <div className="relative focus-within-icon-parent">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                      <MessageSquare className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                    </div>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400 resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.01] btn-shimmer cursor-pointer active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-4.5 h-4.5 animate-pulse" />
                </button>
              </form>
            </div>

            {/* Quick Actions & FAQ overview - Takes 5 columns of 12 */}
            <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
              
              {/* Location details card */}
              <div 
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 reveal-on-scroll slide-right"
                style={{ transitionDelay: '100ms' }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Locations</h3>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 text-center">
                  <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-3 animate-pin-bounce" />
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Currently Serving</h4>
                  <p className="text-gray-700 font-semibold mb-2">Anywhere in India</p>
                  <p className="text-gray-500 text-xs">We match vetted local home tutors nationwide</p>
                </div>
              </div>

              {/* Quick Actions Links */}
              <div 
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 reveal-on-scroll slide-right"
                style={{ transitionDelay: '200ms' }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    {
                      to: '/demo-booking',
                      label: 'Book Free Demo Class',
                      desc: 'Schedule a live demo session with our vetted tutors.',
                      icon: GraduationCap,
                      color: 'text-primary-600 bg-primary-50'
                    },
                    {
                      to: '/register',
                      label: 'Register as Student / Parent',
                      desc: 'Sign up to find highly qualified teachers in India.',
                      icon: User,
                      color: 'text-emerald-600 bg-emerald-50'
                    },
                    {
                      to: '/register/teacher',
                      label: 'Join as Teacher',
                      desc: 'Apply to teach on our platform and grow your career.',
                      icon: BookOpen,
                      color: 'text-purple-600 bg-purple-50'
                    }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link 
                        key={index}
                        to={action.to} 
                        className="group flex items-start space-x-3.5 p-3.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/40 hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${action.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow pt-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800 text-[14px] group-hover:text-primary-600 transition-colors duration-200">
                              {action.label}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                          <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                            {action.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* FAQ box */}
              <div 
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 reveal-on-scroll slide-right"
                style={{ transitionDelay: '300ms' }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-sans">Common Questions</h3>
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div 
                        key={idx} 
                        className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                        onMouseEnter={() => setOpenFaqIdx(idx)}
                        onMouseLeave={() => setOpenFaqIdx(null)}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between text-left focus:outline-none group/faq cursor-pointer"
                        >
                          <span className="font-semibold text-gray-800 text-sm group-hover/faq:text-primary-600 transition-colors duration-200">
                            {faq.question}
                          </span>
                          <span className="flex-shrink-0 ml-3 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-gray-500 group-hover/faq:bg-primary-50 group-hover/faq:text-primary-600 transition-colors duration-200">
                            {isOpen ? (
                              <Minus className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </span>
                        </button>
                        <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                          <div>
                          <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed pl-3 border-l-2 border-primary-500/40 mt-2.5">
                            {faq.answer}
                          </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
          
          {/* Falling Confetti Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_PARTICLES.map(p => (
              <div
                key={p.id}
                className="confetti-particle animate-pulse"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`
                }}
              />
            ))}
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-100 p-8 text-center relative z-10 animate-slide-up">
            <button
              onClick={closeSuccessModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-sm text-gray-500 mb-6 font-semibold">Reference Code: {refCode}</p>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Thank you, <strong>{formData.name}</strong>! We have received your inquiry as a <strong>{formData.role}</strong>. A support officer will respond via email at <strong>{formData.email}</strong> or call you at <strong>{formData.phone}</strong> shortly.
            </p>

            <button
              onClick={closeSuccessModal}
              className="w-full btn-primary py-3 font-bold cursor-pointer btn-shimmer active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contact;
