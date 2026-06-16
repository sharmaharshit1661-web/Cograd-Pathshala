import { useState } from 'react';
import { CheckCircle, MapPin, Calendar, Clock, User, Phone, X, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Basics'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CONFETTI = Array.from({ length: 30 }).map((_, i) => ({
  id: i, left: Math.random() * 100,
  size: Math.random() * 7 + 5,
  delay: Math.random() * 2,
  color: ['#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
  duration: Math.random() * 1.5 + 1.5,
}));

const DemoBooking = () => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState('next');
  const [shake, setShake] = useState(false);
  const [form, setForm] = useState({ studentName: '', parentPhone: '', studentClass: '', preferredDate: '', preferredTime: '', district: '', villageArea: '', landmark: '' });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'parentPhone') {
      setForm((p) => ({ ...p, [name]: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 400); };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.studentName.trim()) { alert('Please enter student name.'); return false; }
      if (!/^[6789]\d{9}$/.test(form.parentPhone)) { alert('Enter a valid 10-digit mobile number.'); return false; }
      if (!form.studentClass) { alert('Please select a class.'); return false; }
    }
    if (s === 2) {
      if (selectedSubjects.length === 0) { alert('Select at least one subject.'); return false; }
      if (!form.preferredDate || !form.preferredTime) { alert('Fill preferred date and time.'); return false; }
      if (selectedDays.length === 0) { alert('Select at least one preferred day.'); return false; }
    }
    if (s === 3) {
      if (!form.district) { alert('Select a district.'); return false; }
      if (!form.villageArea.trim()) { alert('Enter your village or area.'); return false; }
    }
    return true;
  };

  const goNext = () => {
    if (validateStep(step)) { setDir('next'); setStep((p) => p + 1); }
    else triggerShake();
  };
  const goPrev = () => { setDir('prev'); setStep((p) => p - 1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) { triggerShake(); return; }
    setRefCode('DEMO-' + Math.floor(100000 + Math.random() * 900000));
    setShowSuccess(true);
  };

  const closeModal = () => {
    setShowSuccess(false);
    setStep(1); setForm({ studentName: '', parentPhone: '', studentClass: '', preferredDate: '', preferredTime: '', district: '', villageArea: '', landmark: '' });
    setSelectedSubjects([]); setSelectedDays([]);
  };

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const STEPS = [
    { n: 1, label: 'Student' },
    { n: 2, label: 'Schedule' },
    { n: 3, label: 'Location' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Hero */}
      <section className="pt-28 pb-14 bg-white border-b border-neutral-100 bg-dot-subtle">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-5">
            <CheckCircle className="w-4 h-4" />
            100% Free Demo Class
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
            Book Your <span className="color-blend-text">Free Demo</span>
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Experience quality home tuition with our expert teachers — no commitment required.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Form card */}
            <div className={`bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden transition-all ${shake ? 'animate-shake' : ''}`}>

              {/* Progress header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                        step > s.n ? 'bg-white text-primary-700 border-white' :
                        step === s.n ? 'bg-white/20 text-white border-white' :
                        'bg-white/10 text-white/50 border-white/20'
                      }`}>
                        {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                      </div>
                      <span className={`text-sm font-medium ${step >= s.n ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                      {i < STEPS.length - 1 && <div className="w-10 h-px bg-white/20 mx-1" />}
                    </div>
                  ))}
                </div>
                <h2 className="text-lg font-bold">Book Free Demo Class</h2>
                <p className="text-white/75 text-sm">Fill in details to experience learning at home</p>
              </div>

              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div key={step} className={dir === 'next' ? 'step-enter-next' : 'step-enter-prev'}>

                    {/* Step 1 */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="form-label"><User className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Student Name</label>
                          <input type="text" name="studentName" required value={form.studentName} onChange={handleChange} className="form-input" placeholder="Student's full name" />
                        </div>
                        <div>
                          <label className="form-label"><Phone className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Parent Phone</label>
                          <div className="flex border border-neutral-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 bg-neutral-50 transition-all">
                            <span className="flex items-center px-3.5 text-sm font-medium text-neutral-500 border-r border-neutral-200 bg-neutral-100">🇮🇳 +91</span>
                            <input type="tel" name="parentPhone" required value={form.parentPhone} onChange={handleChange} className="flex-1 px-3.5 py-2.5 bg-transparent text-[14px] focus:outline-none font-medium text-neutral-800" placeholder="10-digit mobile" />
                          </div>
                        </div>
                        <div>
                          <label className="form-label mb-2"><GraduationCap className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Student Class</label>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {CLASSES.map((c) => (
                              <button key={c} type="button" onClick={() => setForm((p) => ({ ...p, studentClass: c }))} className={`py-2 text-xs font-medium rounded-lg border cursor-pointer transition-all ${form.studentClass === c ? 'bg-primary-600 text-white border-primary-600 shadow-sm scale-105' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                                {c.replace('Class ', '')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div>
                          <label className="form-label mb-2"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Subjects</label>
                          <div className="grid grid-cols-3 gap-2">
                            {SUBJECTS.map((s) => {
                              const sel = selectedSubjects.includes(s);
                              return (
                                <button key={s} type="button" onClick={() => setSelectedSubjects((p) => sel ? p.filter((x) => x !== s) : [...p, s])} className={`py-2.5 px-2 rounded-xl border text-xs font-medium cursor-pointer transition-all text-center ${sel ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="form-label"><Calendar className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Preferred Date</label>
                            <input type="date" name="preferredDate" required min={getMinDate()} value={form.preferredDate} onChange={handleChange} className="form-input cursor-pointer" />
                          </div>
                          <div>
                            <label className="form-label mb-2"><Clock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Preferred Time</label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {TIME_SLOTS.map((t) => (
                                <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, preferredTime: t }))} className={`py-2 text-[10.5px] font-medium rounded-lg border cursor-pointer transition-all text-center ${form.preferredTime === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="form-label mb-2"><Calendar className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Preferred Days</label>
                          <div className="flex flex-wrap gap-2">
                            {DAYS.map((d) => {
                              const sel = selectedDays.includes(d);
                              return (
                                <button key={d} type="button" onClick={() => setSelectedDays((p) => sel ? p.filter((x) => x !== d) : [...p, d])} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${sel ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                                  {d.slice(0, 3)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                      <div className="space-y-5">
                        <div>
                          <label className="form-label mb-2"><MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />District</label>
                          <div className="grid grid-cols-2 gap-4">
                            {['Meerut', 'Allahabad'].map((d) => (
                              <button key={d} type="button" onClick={() => setForm((p) => ({ ...p, district: d }))} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${form.district === d ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'}`}>
                                <MapPin className={`w-5 h-5 ${form.district === d ? 'text-primary-500 animate-pin-bounce' : 'text-neutral-400'}`} />
                                <span className="font-semibold text-sm">{d}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="form-label"><MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Village / Area</label>
                            <input type="text" name="villageArea" required value={form.villageArea} onChange={handleChange} className="form-input" placeholder="Your village or area" />
                          </div>
                          <div>
                            <label className="form-label">Landmark <span className="text-neutral-400 font-normal">(optional)</span></label>
                            <input type="text" name="landmark" value={form.landmark} onChange={handleChange} className="form-input" placeholder="Near school, temple…" />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-7">
                    {step > 1 && (
                      <button type="button" onClick={goPrev} className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl cursor-pointer transition-all">
                        Back
                      </button>
                    )}
                    {step < 3 ? (
                      <button type="button" onClick={goNext} className="flex-1 btn-primary py-3 gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button type="submit" className="flex-1 btn-primary py-3 gap-2">
                        Book Free Demo <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right info panel */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Why Our Demo Classes?</h2>
                <div className="space-y-5">
                  {[
                    { icon: GraduationCap, title: 'Expert Teachers', desc: 'Vetted, experienced teachers who understand localized challenges.', color: 'bg-blue-50 text-blue-600' },
                    { icon: Clock, title: 'Flexible Timing', desc: 'Choose timings that work for your child with convenient weekly options.', color: 'bg-amber-50 text-amber-600' },
                    { icon: MapPin, title: 'Home Convenience', desc: 'Tutors come to your home — no travel, fully personalized.', color: 'bg-violet-50 text-violet-600' },
                    { icon: CheckCircle, title: 'Personalized Learning', desc: 'One-on-one attention matching your child\'s pace and goals.', color: 'bg-emerald-50 text-emerald-600' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="reveal-on-scroll flex items-start gap-4" style={{ transitionDelay: `${i * 80}ms` }}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-0.5">{item.title}</h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="reveal-on-scroll bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  {['Fill out the demo booking form', 'We contact you within 24 hours', 'Schedule your free demo at home', 'Experience quality education firsthand'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-neutral-600">
                      <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal-on-scroll bg-primary-50 border border-primary-100 rounded-2xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">Trust Cograd</h3>
                <div className="space-y-2.5">
                  {['Shark Tank India featured brand', '500+ verified home tutors', '10,000+ students learning', '4.9/5 parent satisfaction'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-neutral-600">
                      {i === 0 ? (
                        <img src="/shark-tank.png" alt="Shark Tank India" className="w-5 h-5 object-contain flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI.map((p) => (
              <div key={p.id} className="confetti-particle" style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-neutral-100 animate-slide-up relative z-10">
            <button onClick={closeModal} className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"><X className="w-4.5 h-4.5" /></button>
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">Demo Class Booked!</h3>
            <p className="text-sm text-neutral-400 mb-5">Reference: <span className="font-mono font-medium text-neutral-600">{refCode}</span></p>
            <div className="bg-neutral-50 rounded-xl p-4 text-left text-sm space-y-2 mb-5 border border-neutral-100">
              <div className="flex justify-between"><span className="text-neutral-400">Student:</span><span className="font-medium text-neutral-700">{form.studentName}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Class:</span><span className="font-medium text-neutral-700">{form.studentClass}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Date & Time:</span><span className="font-medium text-neutral-700">{form.preferredDate} at {form.preferredTime}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">District:</span><span className="font-medium text-neutral-700">{form.district}</span></div>
            </div>
            <p className="text-sm text-neutral-500 mb-5">Our coordinator will call <strong className="text-neutral-700">+91 {form.parentPhone}</strong> within 24 hours.</p>
            <button onClick={closeModal} className="w-full btn-primary py-3">Back to Home</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DemoBooking;
