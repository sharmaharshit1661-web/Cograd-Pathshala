import { useState, useEffect } from 'react';
import { CheckCircle, MapPin, Calendar, Clock, User, Phone, X, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { api } from '../utils/api';

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Basics'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INDIAN_CITIES = [
  'Adoni', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Alappuzha', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Ambattur', 'Ambikapur', 'Amravati', 'Amreli', 'Amritsar', 'Amroha', 'Anand', 'Anantapur', 'Arrah', 'Asansol', 'Aurangabad', 'Avadi', 'Azamgarh', 'Badlapur', 'Bagar', 'Bagaha', 'Bahadurgarh', 'Baharampur', 'Bahraich', 'Balasore', 'Ballia', 'Bally', 'Balurghat', 'Banda', 'Bangalore', 'Banganapalle', 'Banswara', 'Barakpur', 'Barasat', 'Baraut', 'Bardhaman', 'Bareilly', 'Barmer', 'Barnala', 'Barrackpore', 'Baruni', 'Basirhat', 'Basti', 'Batala', 'Bathinda', 'Beawar', 'Begusarai', 'Belgaum', 'Bellary', 'Bengaluru', 'Bettiah', 'Betul', 'Bhadravati', 'Bhadreswar', 'Bhagalpur', 'Bhagirathi', 'Bhalesa', 'Bharatpur', 'Bharuch', 'Bhatpara', 'Bhavnagar', 'Bhawanipatna', 'Bhel', 'Bhilai', 'Bhilwara', 'Bhimavaram', 'Bhind', 'Bhiwandi', 'Bhiwani', 'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bhusawal', 'Bidar', 'Bihar Sharif', 'Bijapur', 'Bikaner', 'Bilaspur', 'Bobbili', 'Bokaro Steel City', 'Bongaigaon', 'Bongaon', 'Bulandshahr', 'Bundi', 'Burdwan', 'Burhanpur', 'Buxar', 'Calcutta', 'Calicut', 'Central Delhi', 'Chandausi', 'Chandigarh', 'Chandrapur', 'Chapra', 'Chennai', 'Chhattarpur', 'Chhindwara', 'Chidambaram', 'Chikkamagaluru', 'Chitradurga', 'Chittoor', 'Churu', 'Coimbatore', 'Cooch Behar', 'Cuddalore', 'Cuttack', 'Dabgram', 'Dabra', 'Daltonganj', 'Daman', 'Darbhanga', 'Darjeeling', 'Davangere', 'Deesa', 'Dehradun', 'Dehri', 'Delhi', 'Delhi NCR', 'Deoria', 'Dewas', 'Dhanbad', 'Dhar', 'Dharamshala', 'Dharmavaram', 'Dharwad', 'Dhule', 'Dibrugarh', 'Dimapur', 'Dindigul', 'Dispur', 'Diu', 'Dombivli', 'Dumdum', 'Durg', 'Durgapur', 'Dwarka', 'East Delhi', 'Eluru', 'English Bazar', 'Erode', 'Etah', 'Etawah', 'Faridabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Firozpur', 'Gadag-Betageri', 'Gandhidham', 'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad', 'Ghazipur', 'Giridih', 'Goa', 'Godhra', 'Gokal Pur', 'Gonda', 'Gondia', 'Gorakhpur', 'Greater Noida', 'Gudivada', 'Gulbarga', 'Guna', 'Guntur', 'Gurgaon', 'Gurugram', 'Guwahati', 'Gwalior', 'Haldia', 'Haldwani', 'Hansi', 'Hapur', 'Hardoi', 'Haridwar', 'Hassan', 'Hathras', 'Hazaribagh', 'Himatnagar', 'Hindupur', 'Hinganghat', 'Hisar', 'Hoshangabad', 'Hoshiarpur', 'Hospet', 'Howrah', 'Hubli', 'Hubli-Dharwad', 'Hugli-Chinsurah', 'Hyderabad', 'Ichalkaranji', 'Imphal', 'Indore', 'Irinjalakuda', 'Itanagar', 'Jabalpur', 'Jagdalpur', 'Jagdevpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jalna', 'Jalpaiguri', 'Jamalpur', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jaunpur', 'Jehanabad', 'Jhansi', 'Jhunjhunu', 'Jind', 'Jodhpur', 'Jorhat', 'Junagadh', 'Kadapa', 'Kaithal', 'Kakinada', 'Kalaburagi', 'Kalyan', 'Kalyan-Dombivli', 'Kalyani', 'Kamarhati', 'Kancheepuram', 'Kanchrapara', 'Kandla', 'Kannur', 'Kanpur', 'Kanyakumari', 'Kapadvanj', 'Kapurthala', 'Karaikal', 'Karaikudi', 'Karawal Nagar', 'Karimnagar', 'Karnal', 'Karur', 'Karwar', 'Kashipur', 'Katihar', 'Katni', 'Kavali', 'Kavaratti', 'Kayamkulam', 'Kendrapara', 'Khammam', 'Khandwa', 'Kharagpur', 'Kharar', 'Khargone', 'Kheda', 'Kishangarh', 'Kochi', 'Kohima', 'Kolar', 'Kolhapur', 'Kolkata', 'Kollam', 'Koppal', 'Korba', 'Kota', 'Kothagudem', 'Kottayam', 'Kovvur', 'Kozhikode', 'Krishnanagar', 'Kullu', 'Kumbakonam', 'Kurnool', 'Kurukshetra', 'Lakhimpur', 'Lalitpur', 'Latur', 'Lonavala', 'Loni', 'Lucknow', 'Ludhiana', 'Machilipatnam', 'Madanapalle', 'Madhavpur', 'Madhyamgram', 'Madurai', 'Mahad', 'Mahbubnagar', 'Mahesana', 'Mahestala', 'Mahoba', 'Mainpuri', 'Malappuram', 'Malegaon', 'Malerkotla', 'Mandi', 'Mandla', 'Mandsaur', 'Mandya', 'Mangalore', 'Mangaluru', 'Mango', 'Mapusa', 'Margao', 'Mathura', 'Maunath Bhanjan', 'Mavelikkara', 'Mayiladuthurai', 'Medinipur', 'Meerut', 'Mehsana', 'Mewat', 'Mirzapur', 'Mirzapur-cum-Vindhyachal', 'Moga', 'Mohali', 'Moradabad', 'Morena', 'Motiari', 'Motihari', 'Mount Abu', 'Mughalsarai', 'Mumbai', 'Munger', 'Murwara', 'Mussoorie', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore', 'Mysuru', 'Nabadwip', 'Nadiad', 'Nagaon', 'Nagapattinam', 'Nagaur', 'Nagercoil', 'Nagpur', 'Nahan', 'Nainital', 'Nanded', 'Nanded-Waghala', 'Nandyal', 'Nangloi Jat', 'Naraura', 'Narayangaon', 'Narnaul', 'Narsinghpur', 'Nashik', 'Navi Mumbai', 'Navsari', 'Neemuch', 'Nellore', 'New Delhi', 'Neyveli', 'Nizamabad', 'Noida', 'North Delhi', 'Ongole', 'Orai', 'Osmanabad', 'Ooty', 'Palakkad', 'Palanpur', 'Pali', 'Palghar', 'Pallavaram', 'Palwal', 'Panaji', 'Panchkula', 'Pandharpur', 'Panipat', 'Panvel', 'Paradip', 'Paramakudi', 'Parbhani', 'Patan', 'Pathankot', 'Patiala', 'Patna', 'Pithoragarh', 'Pimpri-Chinchwad', 'Ponda', 'Ponnur', 'Port Blair', 'Porbandar', 'Proddatur', 'Puducherry', 'Pujali', 'Pune', 'Puri', 'Purnia', 'Purulia', 'Pushkar', 'Raichur', 'Raiganj', 'Raigarh', 'Raipur', 'Rajahmundry', 'Rajkot', 'Rajnandgaon', 'Rajouri', 'Ramachandrapuram', 'Ramagundam', 'Ramanathapuram', 'Rampur', 'Ranchi', 'Raniganj', 'Ratlam', 'Ratnagiri', 'Raurkela', 'Ravel', 'Rewa', 'Rewari', 'Rishikesh', 'Rohtak', 'Roorkee', 'Rourkela', 'Rudrapur', 'Sagar', 'Saharanpur', 'Saharsa', 'Salem', 'Samastipur', 'Sambalpur', 'Sambhal', 'Sangli', 'Sangli-Miraj-Kupwad', 'Sangrur', 'Satara', 'Satna', 'Secunderabad', 'Sehore', 'Seoni', 'Serampore', 'Shahjahanpur', 'Shamli', 'Shikohabad', 'Shillong', 'Shimla', 'Shivamogga', 'Shivpuri', 'Sholapur', 'Shrirampur', 'Siddipet', 'Sikar', 'Silchar', 'Siliguri', 'Silvassa', 'Simla', 'Singrauli', 'Sinnar', 'Siras', 'Sirsa', 'Sitamarhi', 'Sitapur', 'Sivakasi', 'Siwan', 'Solan', 'Solapur', 'Sonepat', 'Sonipat', 'South Delhi', 'Sreekaryam', 'Srikakulam', 'Srinagar', 'Sujangarh', 'Sultan Pur', 'Surat', 'Surendranagar Dudhrej', 'Suryapet', 'Tadepalligudem', 'Tadpatri', 'Tambaram', 'Tarn Taran', 'Tezpur', 'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur', 'Tinsukia', 'Tiptur', 'Tiruchirappalli', 'Tiruelveli', 'Tirupati', 'Tirupattur', 'Tiruppur', 'Tirur', 'Tiruvannamalai', 'Tohana', 'Tonk', 'Trichur', 'Trichy', 'Trimbak', 'Tumkur', 'Tumakuru', 'Tuni', 'Tuticorin', 'Udaipur', 'Udhampur', 'Ujjain', 'Ulhasnagar', 'Uluberia', 'Unnao', 'Uttarpara Kotrung', 'Vadodara', 'Valsad', 'Vanchiyoor', 'Vapi', 'Varanasi', 'Vasai-Virar', 'Vasco da Gama', 'Vellore', 'Veraval', 'Vidisha', 'Vijayawada', 'Viluppuram', 'Virar', 'Virudhunagar', 'Visakhapatnam', 'Vizianagaram', 'Vrindavan', 'Vyara', 'Wadhwan', 'Wani', 'Warangal', 'Wardha', 'Washim', 'Wayanad', 'West Delhi', 'Yamunanagar', 'Yavatmal', 'Yelahanka', 'Zirakpur'
];

const CONFETTI = Array.from({ length: 30 }).map((_, i) => ({
  id: i, left: Math.random() * 100,
  size: Math.random() * 7 + 5,
  delay: Math.random() * 2,
  color: ['#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
  duration: Math.random() * 1.5 + 1.5,
}));

const DemoBooking = ({ isEmbedded = false, onClose }) => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState('next');
  const [shake, setShake] = useState(false);
  const [form, setForm] = useState({ studentName: '', parentPhone: '', studentClass: '', preferredDate: '', preferredTime: '', district: '', villageArea: '', landmark: '' });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [citySearch, setCitySearch] = useState(form.district || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const filteredCities = INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    if (step === 2 && form.district) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await api.get(`/teachers/available-slots?district=${encodeURIComponent(form.district)}`);
          setAvailableSlots(res);
        } catch (error) {
          console.error('Failed to fetch available slots:', error);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [step, form.district]);

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
      if (!form.district) { alert('Please select your district.'); return false; }
    }
    if (s === 2) {
      if (selectedSubjects.length === 0) { alert('Select at least one subject.'); return false; }
      if (!form.preferredDate) { alert('Please select a preferred date.'); return false; }
      if (selectedSlot) {
        const dateObj = new Date(form.preferredDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dateDay = daysOfWeek[dateObj.getDay()];
        if (dateDay.toLowerCase() !== selectedSlot.day.toLowerCase()) {
          alert(`The selected date is a ${dateDay}, but the slot chosen is for ${selectedSlot.day}. Please select a date that falls on a ${selectedSlot.day}.`);
          return false;
        }
      } else {
        if (!form.preferredTime) { alert('Fill preferred time.'); return false; }
        if (selectedDays.length === 0) { alert('Select at least one preferred day.'); return false; }
      }
    }
    if (s === 3) {
      if (!form.villageArea.trim()) { alert('Enter your village or area.'); return false; }
    }
    return true;
  };

  const goNext = () => {
    if (validateStep(step)) { setDir('next'); setStep((p) => p + 1); }
    else triggerShake();
  };
  const goPrev = () => { setDir('prev'); setStep((p) => p - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) { triggerShake(); return; }
    try {
      const response = await api.post('/demo-bookings', {
        studentName: form.studentName,
        parentPhone: form.parentPhone,
        studentClass: form.studentClass,
        subjects: selectedSubjects,
        preferredDate: form.preferredDate,
        preferredTime: selectedSlot ? selectedSlot.time : form.preferredTime,
        preferredDays: selectedSlot ? [selectedSlot.day] : selectedDays,
        district: form.district,
        villageArea: form.villageArea,
        landmark: form.landmark,
        assigned_teacher_id: selectedSlot ? selectedSlot.teacherId : null
      });
      setRefCode(response.id);
      setShowSuccess(true);
    } catch (error) {
      alert('Failed to book demo class: ' + error.message);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    setStep(1); setForm({ studentName: '', parentPhone: '', studentClass: '', preferredDate: '', preferredTime: '', district: '', villageArea: '', landmark: '' });
    setSelectedSubjects([]); setSelectedDays([]);
    setSelectedSlot(null);
    setCitySearch('');
    setShowCityDropdown(false);
    if (onClose) onClose();
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
    <div className={isEmbedded ? "bg-white p-2 rounded-2xl" : "min-h-screen bg-neutral-50"}>

      {/* Hero */}
      {!isEmbedded && (
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
      )}

      {/* Main */}
      <section className={isEmbedded ? "pt-2 pb-2" : "pt-12 pb-16"}>
        <div className={isEmbedded ? "max-w-xl mx-auto" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
          <div className={isEmbedded ? "w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"}>

            {/* Form card */}
            <div className={`bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all ${shake ? 'animate-shake' : ''} relative`}>

              {/* Progress header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-5 text-white rounded-t-2xl relative">
                {isEmbedded && onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors border-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center gap-2 mb-4">
                  {STEPS.map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2 flex-1 last:flex-none">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shrink-0 ${
                        step > s.n
                          ? 'bg-white text-primary-700 border-white'
                          : step === s.n
                          ? 'bg-white/20 text-white border-white shadow-md'
                          : 'bg-white/10 text-white/50 border-white/20'
                      }`}>
                        {step > s.n ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : s.n}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:block ${step >= s.n ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-px mx-1 transition-all duration-500" style={{ background: step > s.n ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }} />
                      )}
                    </div>
                  ))}
                </div>
                <h2 className="text-base font-bold">Book Free Demo Class</h2>
                <p className="text-white/70 text-xs mt-0.5">Fill in details to experience learning at home</p>
              </div>

              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div key={step} className={`relative z-20 ${dir === 'next' ? 'step-enter-next' : 'step-enter-prev'}`}>

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
                        <div className="relative z-10">
                          <label className="form-label mb-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1.5" aria-hidden="true" />
                            Search and Select Your District / City
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type to search (e.g. Pune, Noida, Meerut)..."
                              value={citySearch}
                              onChange={(e) => {
                                setCitySearch(e.target.value);
                                setShowCityDropdown(true);
                                setForm(p => ({ ...p, district: e.target.value }));
                              }}
                              onFocus={() => setShowCityDropdown(true)}
                              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                              className="form-input"
                              aria-autocomplete="list"
                              aria-expanded={showCityDropdown}
                              role="combobox"
                            />
                            {showCityDropdown && (
                              <div className="dropdown-list" role="listbox" aria-label="City suggestions">
                                {filteredCities.length === 0 ? (
                                  <div className="dropdown-item text-slate-400 italic">
                                    No matches — using "{citySearch}"
                                  </div>
                                ) : (
                                  filteredCities.map((city) => (
                                    <button
                                      key={city}
                                      type="button"
                                      role="option"
                                      onMouseDown={() => {
                                        setForm(p => ({ ...p, district: city }));
                                        setCitySearch(city);
                                        setShowCityDropdown(false);
                                        setSelectedSlot(null);
                                      }}
                                      className="dropdown-item w-full text-left flex items-center gap-2"
                                    >
                                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" aria-hidden="true" />
                                      {city}
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                          {form.district && (
                            <p className="text-[11px] text-primary-600 font-semibold mt-1.5 flex items-center gap-1">
                              <span aria-hidden="true">📍</span> Selected: <strong>{form.district}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div>
                          <label className="form-label mb-2"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Subjects</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        <div className="space-y-4">
                          <div>
                            <label className="form-label"><Calendar className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Preferred Date</label>
                            <input type="date" name="preferredDate" required min={getMinDate()} value={form.preferredDate} onChange={handleChange} className="form-input cursor-pointer" />
                          </div>

                          {loadingSlots ? (
                            <div className="text-xs text-neutral-400 font-semibold italic animate-pulse">Loading tutor availability in {form.district}...</div>
                          ) : availableSlots.length > 0 ? (
                            <div>
                              <label className="form-label mb-2"><Clock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Available Tutor Slots in {form.district}</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {availableSlots.map((slot) => {
                                  const isSel = selectedSlot?.slot === slot.slot && selectedSlot?.teacherId === slot.teacherId;
                                  return (
                                    <button
                                      key={`${slot.teacherId}-${slot.slot}`}
                                      type="button"
                                      onClick={() => {
                                        setSelectedSlot(slot);
                                        setForm(p => ({ ...p, preferredTime: slot.time }));
                                        setSelectedDays([slot.day]);
                                      }}
                                      className={`p-3 text-left rounded-xl border cursor-pointer transition-all ${
                                        isSel
                                          ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm ring-1 ring-primary-500'
                                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                                      }`}
                                    >
                                      <div className="font-bold text-xs">{slot.slot}</div>
                                      <div className="text-[10px] text-neutral-400 font-medium mt-0.5">Tutor: {slot.teacherName}</div>
                                    </button>
                                  );
                                })}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSlot(null);
                                  setForm(p => ({ ...p, preferredTime: '' }));
                                  setSelectedDays([]);
                                }}
                                className="mt-2 text-xs text-blue-500 hover:underline font-bold cursor-pointer"
                              >
                                Clear selection / Request custom slot
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-neutral-400 font-semibold italic">No direct teacher slots listed for {form.district}. Please choose a custom slot.</div>
                          )}

                          {(!selectedSlot || availableSlots.length === 0) && (
                            <div className="space-y-4 pt-3 border-t border-neutral-100">
                              <p className="text-[11px] text-neutral-400 font-semibold italic">Choose a custom day and time slot if no teacher slots fit your schedule:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                  <label className="form-label mb-2"><Clock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Preferred Time</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                    {TIME_SLOTS.map((t) => (
                                      <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, preferredTime: t }))} className={`py-2 text-[10.5px] font-medium rounded-lg border cursor-pointer transition-all text-center ${form.preferredTime === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                                        {t}
                                      </button>
                                    ))}
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
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                      <div className="space-y-5">
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

                        {form.villageArea && (
                          <div className="mt-4 space-y-1">
                            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider block">Address Preview Map</span>
                            <div className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-sm bg-white p-1">
                              <iframe
                                title="Google Map Preview"
                                width="100%"
                                height="180"
                                style={{ border: 0, borderRadius: '8px' }}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${form.villageArea}, ${form.landmark ? form.landmark + ', ' : ''}${form.district}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                                loading="lazy"
                              ></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-7 relative z-0">
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
            {!isEmbedded && (
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
          )}
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
