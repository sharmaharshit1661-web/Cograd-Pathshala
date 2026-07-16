import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Users, GraduationCap, Award,
  TrendingUp, ShieldCheck, Star, ArrowRight, Zap,
  Heart, Sparkles, ClipboardCheck, UserCheck, Search, ChevronDown
} from 'lucide-react';


const CITY_GROUPS = [
  {
    label: "Delhi NCR",
    cities: [
      { name: "Delhi NCR", value: "Delhi NCR" },
      { name: "Delhi", value: "Delhi" },
      { name: "Noida", value: "Noida" },
      { name: "Greater Noida", value: "Greater Noida" },
      { name: "Gurugram / Gurgaon", value: "Gurugram" },
      { name: "Faridabad", value: "Faridabad" },
      { name: "Ghaziabad", value: "Ghaziabad" }
    ]
  },
  {
    label: "Uttar Pradesh",
    cities: [
      { name: "Meerut", value: "Meerut" },
      { name: "Allahabad (Prayagraj)", value: "Allahabad" },
      { name: "Lucknow", value: "Lucknow" },
      { name: "Agra", value: "Agra" },
      { name: "Aligarh", value: "Aligarh" },
      { name: "Amroha", value: "Amroha" },
      { name: "Azamgarh", value: "Azamgarh" },
      { name: "Ballia", value: "Ballia" },
      { name: "Banda", value: "Banda" },
      { name: "Baraut", value: "Baraut" },
      { name: "Basti", value: "Basti" },
      { name: "Bulandshahr", value: "Bulandshahr" },
      { name: "Deoria", value: "Deoria" },
      { name: "Etah", value: "Etah" },
      { name: "Etawah", value: "Etawah" },
      { name: "Farrukhabad", value: "Farrukhabad" },
      { name: "Fatehpur", value: "Fatehpur" },
      { name: "Firozabad", value: "Firozabad" },
      { name: "Ghazipur", value: "Ghazipur" },
      { name: "Gonda", value: "Gonda" },
      { name: "Gorakhpur", value: "Gorakhpur" },
      { name: "Hapur", value: "Hapur" },
      { name: "Hardoi", value: "Hardoi" },
      { name: "Hathras", value: "Hathras" },
      { name: "Jaunpur", value: "Jaunpur" },
      { name: "Jhansi", value: "Jhansi" },
      { name: "Kanpur", value: "Kanpur" },
      { name: "Lakhimpur", value: "Lakhimpur" },
      { name: "Mainpuri", value: "Mainpuri" },
      { name: "Mathura", value: "Mathura" },
      { name: "Mirzapur", value: "Mirzapur" },
      { name: "Moradabad", value: "Moradabad" },
      { name: "Muzaffarnagar", value: "Muzaffarnagar" },
      { name: "Orai", value: "Orai" },
      { name: "Rampur", value: "Rampur" },
      { name: "Saharanpur", value: "Saharanpur" },
      { name: "Sambhal", value: "Sambhal" },
      { name: "Shahjahanpur", value: "Shahjahanpur" },
      { name: "Sitapur", value: "Sitapur" },
      { name: "Unnao", value: "Unnao" },
      { name: "Varanasi", value: "Varanasi" }
    ]
  },
  {
    label: "Haryana",
    cities: [
      { name: "Ambala", value: "Ambala" },
      { name: "Bahadurgarh", value: "Bahadurgarh" },
      { name: "Bhiwani", value: "Bhiwani" },
      { name: "Hisar", value: "Hisar" },
      { name: "Jind", value: "Jind" },
      { name: "Karnal", value: "Karnal" },
      { name: "Kurukshetra", value: "Kurukshetra" },
      { name: "Panchkula", value: "Panchkula" },
      { name: "Panipat", value: "Panipat" },
      { name: "Rewari", value: "Rewari" },
      { name: "Rohtak", value: "Rohtak" },
      { name: "Sirsa", value: "Sirsa" },
      { name: "Sonipat", value: "Sonipat" },
      { name: "Yamunanagar", value: "Yamunanagar" }
    ]
  },
  {
    label: "Uttarakhand",
    cities: [
      { name: "Dehradun", value: "Dehradun" },
      { name: "Haldwani", value: "Haldwani" },
      { name: "Haridwar", value: "Haridwar" },
      { name: "Kashipur", value: "Kashipur" },
      { name: "Nainital", value: "Nainital" },
      { name: "Rishikesh", value: "Rishikesh" },
      { name: "Roorkee", value: "Roorkee" },
      { name: "Rudrapur", value: "Rudrapur" }
    ]
  },
  {
    label: "Punjab",
    cities: [
      { name: "Amritsar", value: "Amritsar" },
      { name: "Barnala", value: "Barnala" },
      { name: "Batala", value: "Batala" },
      { name: "Bathinda", value: "Bathinda" },
      { name: "Firozpur", value: "Firozpur" },
      { name: "Hoshiarpur", value: "Hoshiarpur" },
      { name: "Jalandhar", value: "Jalandhar" },
      { name: "Ludhiana", value: "Ludhiana" },
      { name: "Moga", value: "Moga" },
      { name: "Mohali (SAS Nagar)", value: "Mohali" },
      { name: "Pathankot", value: "Pathankot" },
      { name: "Patiala", value: "Patiala" },
      { name: "Sangrur", value: "Sangrur" }
    ]
  },
  {
    label: "Nearby States & Territories",
    cities: [
      { name: "Chandigarh", value: "Chandigarh" },
      { name: "Jaipur", value: "Jaipur" },
      { name: "Ajmer", value: "Ajmer" },
      { name: "Alwar", value: "Alwar" },
      { name: "Bikaner", value: "Bikaner" },
      { name: "Jodhpur", value: "Jodhpur" },
      { name: "Kota", value: "Kota" },
      { name: "Udaipur", value: "Udaipur" },
      { name: "Shimla", value: "Shimla" },
      { name: "Dharamshala", value: "Dharamshala" },
      { name: "Mandi", value: "Mandi" },
      { name: "Solan", value: "Solan" }
    ]
  }
];

const STATS = [
  { icon: MapPin,        value: '50+',  label: 'Cities Covered',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { icon: Users,         value: '2.5k+', label: 'Students Matched', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: GraduationCap, value: '500+', label: 'Expert Tutors',     color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
  { icon: Award,         value: '98%',  label: 'Parent Satisfaction',color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Fully Vetted Teachers',  desc: 'Every teacher undergoes 3-step background verification and subject testing before joining.' },
  { icon: TrendingUp,  title: 'Measurable Progress',    desc: 'Weekly assessments, progress reports, and direct parent feedback loops built in.' },
  { icon: Heart,       title: 'Personalised Learning',  desc: 'Custom study plans aligned to each student\'s pace, curriculum, and learning style.' },
  { icon: MapPin,      title: 'Home Visits Included',   desc: 'Teachers travel to your home — no commute, no disruption to your child\'s routine.' },
];

const TESTIMONIALS = [
  { name: 'Anjali Sharma', role: 'Parent, Delhi NCR', rating: 5, text: 'My son\'s grades improved dramatically within just 2 months. The teacher was incredibly patient and dedicated.' },
  { name: 'Rajesh Kumar', role: 'Parent, Mumbai', rating: 5, text: 'Finally found a trustworthy tutoring service that actually comes to our village. Outstanding quality!' },
  { name: 'Priya Singh', role: 'Parent, Bengaluru', rating: 5, text: 'The weekly progress reports keep me informed. I always know exactly how my daughter is doing.' },
];

const DISTRICTS = [
  {
    city: 'Delhi NCR',
    status: 'Fully Active',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    students: '8,200+',
    teachers: '450+',
    accentColor: 'border-l-primary-500',
    desc: 'Extensive coverage across the national capital region. Fast 1-on-1 home tutor matching.',
    statsLabel1: 'Students Served',
    statsLabel2: 'Vetted Tutors',
    actionText: 'Book Free Demo in NCR',
    link: '/demo-booking',
    cities: ['Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Greater Noida'],
    textColor: 'text-blue-600',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 hover:shadow-blue-500/25'
  },
  {
    city: 'Uttar Pradesh',
    status: 'Active Coverage',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    students: '12,400+',
    teachers: '620+',
    accentColor: 'border-l-violet-500',
    desc: 'Connecting students to qualified local home tutors in key educational and regional hubs.',
    statsLabel1: 'Matched Students',
    statsLabel2: 'Verified Tutors',
    actionText: 'Find Tutor in UP',
    link: '/demo-booking',
    cities: ['Meerut', 'Allahabad', 'Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Saharanpur', 'Jhansi', 'Gorakhpur'],
    textColor: 'text-violet-600',
    btnClass: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/10 hover:shadow-violet-500/25'
  },
  {
    city: 'Haryana',
    status: 'Fully Active',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    students: '4,800+',
    teachers: '240+',
    accentColor: 'border-l-teal-500',
    desc: 'Premium home tutors serving major urban cities and educational hubs across the state.',
    statsLabel1: 'Enrolled Students',
    statsLabel2: 'Home Tutors',
    actionText: 'Find Tutor in Haryana',
    link: '/demo-booking',
    cities: ['Faridabad', 'Gurugram', 'Ambala', 'Hisar', 'Karnal', 'Panipat', 'Rohtak', 'Panchkula', 'Sonipat'],
    textColor: 'text-teal-600',
    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/10 hover:shadow-teal-500/25'
  },
  {
    city: 'Uttarakhand',
    status: 'Active Coverage',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    students: '3,100+',
    teachers: '180+',
    accentColor: 'border-l-amber-500',
    desc: 'Enabling high-quality personal home coaching in mountainous and plain regions alike.',
    statsLabel1: 'Students Matched',
    statsLabel2: 'Expert Tutors',
    actionText: 'Find Tutor in Uttarakhand',
    link: '/demo-booking',
    cities: ['Dehradun', 'Haldwani', 'Haridwar', 'Roorkee', 'Rudrapur', 'Rishikesh', 'Kashipur'],
    textColor: 'text-amber-600',
    btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10 hover:shadow-amber-500/25'
  },
  {
    city: 'Punjab',
    status: 'Expanding Daily',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-100',
    students: '5,600+',
    teachers: '310+',
    accentColor: 'border-l-rose-500',
    desc: 'Expanding presence with dedicated subject mentors providing personalized board and competitive exam preparation.',
    statsLabel1: 'Active Learners',
    statsLabel2: 'Tutors Onboarded',
    actionText: 'Find Tutor in Punjab',
    link: '/demo-booking',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Moga'],
    textColor: 'text-rose-600',
    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10 hover:shadow-rose-500/25'
  }
];

const STATE_NODES = [
  // Delhi NCR
  [
    { name: 'Delhi', x: 190, y: 150, color: '#3b82f6' },
    { name: 'Noida', x: 260, y: 165, color: '#3b82f6' },
    { name: 'Gurugram', x: 130, y: 185, color: '#3b82f6' },
    { name: 'Faridabad', x: 180, y: 235, color: '#3b82f6' },
    { name: 'Ghaziabad', x: 250, y: 105, color: '#3b82f6' },
    { name: 'Greater Noida', x: 310, y: 190, color: '#3b82f6' },
  ],
  // Uttar Pradesh
  [
    { name: 'Lucknow', x: 250, y: 150, color: '#8b5cf6' },
    { name: 'Meerut', x: 140, y: 70, color: '#8b5cf6' },
    { name: 'Allahabad', x: 320, y: 220, color: '#8b5cf6' },
    { name: 'Agra', x: 90, y: 160, color: '#8b5cf6' },
    { name: 'Varanasi', x: 390, y: 210, color: '#8b5cf6' },
    { name: 'Kanpur', x: 200, y: 180, color: '#8b5cf6' },
  ],
  // Haryana
  [
    { name: 'Gurugram', x: 200, y: 230, color: '#0d9488' },
    { name: 'Ambala', x: 170, y: 70, color: '#0d9488' },
    { name: 'Hisar', x: 90, y: 140, color: '#0d9488' },
    { name: 'Karnal', x: 210, y: 120, color: '#0d9488' },
    { name: 'Rohtak', x: 130, y: 175, color: '#0d9488' },
    { name: 'Panipat', x: 200, y: 150, color: '#0d9488' },
  ],
  // Uttarakhand
  [
    { name: 'Dehradun', x: 140, y: 90, color: '#d97706' },
    { name: 'Haldwani', x: 280, y: 195, color: '#d97706' },
    { name: 'Haridwar', x: 180, y: 120, color: '#d97706' },
    { name: 'Roorkee', x: 160, y: 145, color: '#d97706' },
    { name: 'Rudrapur', x: 300, y: 220, color: '#d97706' },
    { name: 'Rishikesh', x: 210, y: 110, color: '#d97706' },
  ],
  // Punjab
  [
    { name: 'Ludhiana', x: 210, y: 140, color: '#e11d48' },
    { name: 'Amritsar', x: 100, y: 90, color: '#e11d48' },
    { name: 'Jalandhar', x: 160, y: 110, color: '#e11d48' },
    { name: 'Patiala', x: 240, y: 185, color: '#e11d48' },
    { name: 'Bathinda', x: 130, y: 205, color: '#e11d48' },
    { name: 'Mohali', x: 280, y: 160, color: '#e11d48' },
  ]
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
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchBarRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Flatten the cities for fallback local suggestions
  const FLAT_CITIES = CITY_GROUPS.flatMap(g => 
    g.cities.map(c => ({ name: c.name, value: c.value, state: g.label }))
  );

  // Popular cities shown by default when input is empty but focused
  const POPULAR_CITIES = [
    { name: "Delhi NCR", value: "Delhi NCR", state: "Delhi NCR" },
    { name: "Lucknow", value: "Lucknow", state: "Uttar Pradesh" },
    { name: "Meerut", value: "Meerut", state: "Uttar Pradesh" },
    { name: "Allahabad", value: "Allahabad", state: "Uttar Pradesh" },
    { name: "Jaipur", value: "Jaipur", state: "Rajasthan" },
    { name: "Dehradun", value: "Dehradun", state: "Uttarakhand" }
  ];

  // Initialize suggestions with popular cities on mount
  useEffect(() => {
    setSuggestions(POPULAR_CITIES);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (value) => {
    setLocationInput(value);
    
    if (value.trim() === "") {
      setSuggestions(POPULAR_CITIES);
      return;
    }

    if (value.trim().length < 2) {
      return;
    }

    // Debounce the Nominatim Geocoding API request
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setLoadingSuggestions(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=in&addressdetails=1&limit=6`,
          {
            headers: {
              "Accept-Language": "en"
            }
          }
        );
        const data = await res.json();
        
        if (data && data.length > 0) {
          const formatted = data.map(item => {
            const address = item.address || {};
            // Determine name
            const name = address.suburb || address.neighbourhood || address.village || address.city_district || address.city || address.town || item.name;
            
            // Build non-repetitive clean visual representation
            const details = item.display_name.split(",");
            const titleLabel = details[0].trim();
            const subtitleLabel = details.slice(1).map(d => d.trim()).filter(d => d && d !== titleLabel).slice(0, 3).join(", ");

            // Check if this location is in/near one of our served cities
            let matchedCityValue = "All";
            for (const city of FLAT_CITIES) {
              if (
                item.display_name.toLowerCase().includes(city.name.toLowerCase()) || 
                item.display_name.toLowerCase().includes(city.value.toLowerCase())
              ) {
                matchedCityValue = city.value;
                break;
              }
            }

            return {
              name: titleLabel,
              value: matchedCityValue,
              area: name,
              state: subtitleLabel
            };
          });
          setSuggestions(formatted);
        } else {
          // No Nominatim results, fall back to local cities
          const localMatches = FLAT_CITIES.filter(city => 
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.state.toLowerCase().includes(value.toLowerCase())
          ).map(city => ({
            name: city.name,
            value: city.value,
            area: "",
            state: city.state
          }));
          setSuggestions(localMatches);
        }
      } catch (err) {
        console.error("Geocoding lookup failed, using local cities fallback:", err);
        const localMatches = FLAT_CITIES.filter(city => 
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.state.toLowerCase().includes(value.toLowerCase())
        ).map(city => ({
          name: city.name,
          value: city.value,
          area: "",
          state: city.state
        }));
        setSuggestions(localMatches);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (city) => {
    setLocationInput(city.name);
    setShowSuggestions(false);
    // Proceed to search page
    const locParam = city.value || "All";
    const areaParam = city.area || "";
    window.location.href = `/student?location=${encodeURIComponent(locParam)}&area=${encodeURIComponent(areaParam)}`;
  };

  const handleSelectCity = (cityName) => {
    const match = FLAT_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    const locParam = match ? match.value : cityName;
    window.location.href = `/student?location=${encodeURIComponent(locParam)}`;
  };

  const handleSearch = () => {
    const query = locationInput.trim();
    if (!query) return;

    // Check if query matches a local city name exactly
    const matchedCity = FLAT_CITIES.find(c => 
      c.name.toLowerCase() === query.toLowerCase() || 
      c.value.toLowerCase() === query.toLowerCase()
    );

    if (matchedCity) {
      window.location.href = `/student?location=${encodeURIComponent(matchedCity.value)}`;
    } else {
      // Split into city and area if input is "City Area" e.g., "Meerut Shastri Nagar"
      const words = query.split(/\s+/);
      let cityFound = null;
      let areaWords = [];
      
      for (let i = 0; i < words.length; i++) {
        const potentialCity = words.slice(0, i + 1).join(" ");
        const match = FLAT_CITIES.find(c => c.name.toLowerCase() === potentialCity.toLowerCase());
        if (match) {
          cityFound = match;
          areaWords = words.slice(i + 1);
        }
      }

      if (cityFound) {
        window.location.href = `/student?location=${encodeURIComponent(cityFound.value)}&area=${encodeURIComponent(areaWords.join(" "))}`;
      } else {
        // Search globally (location: All, area: input query)
        window.location.href = `/student?location=All&area=${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-neutral-50">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-secondary-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50/30 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Left Side Tree Photo Frame */}
          <div className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-10 z-20 pointer-events-none select-none">
            {/* The decorative vine/branch stem */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200/80 to-transparent" />
            
            {/* Image 1 */}
            <div style={{ animation: 'float 7.2s ease-in-out infinite', animationDelay: '0s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-4 -rotate-6">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Student" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>

            {/* Image 2 */}
            <div style={{ animation: 'float 7.8s ease-in-out infinite', animationDelay: '1.2s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-4 rotate-6">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Books" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>

            {/* Image 3 */}
            <div style={{ animation: 'float 6.9s ease-in-out infinite', animationDelay: '0.6s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-2 -rotate-3">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Group Study" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          </div>

          {/* Right Side Tree Photo Frame */}
          <div className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-10 z-20 pointer-events-none select-none">
            {/* The decorative vine/branch stem */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200/80 to-transparent" />
            
            {/* Image 1 */}
            <div style={{ animation: 'float 7.5s ease-in-out infinite', animationDelay: '0.3s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-4 rotate-6">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Classroom" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>

            {/* Image 2 */}
            <div style={{ animation: 'float 6.7s ease-in-out infinite', animationDelay: '1.5s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:-rotate-1 pointer-events-auto -translate-x-4 -rotate-6">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Teacher" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>

            {/* Image 3 */}
            <div style={{ animation: 'float 7.4s ease-in-out infinite', animationDelay: '0.9s' }}>
              <div className="relative group transition-all duration-500 hover:scale-110 hover:rotate-1 pointer-events-auto translate-x-2 rotate-3">
                <div className="p-1 bg-white rounded-xl shadow-lg border border-neutral-100/60 ring-4 ring-neutral-50/50">
                  <img 
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=240&h=320&q=80" 
                    className="w-28 h-36 rounded-lg object-cover" 
                    alt="Study" 
                  />
                </div>
                {/* Hanging pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-white border rounded-full text-xs sm:text-sm font-semibold mb-3 animate-fade-in animate-badge-glow badge-shimmer-sweep shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
              <span className="text-gradient-shark">Shark Tank India Featured EdTech</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-neutral-900 mb-6 tracking-tight animate-slide-up leading-[1.1]">
              Find a <span className="text-primary-600">Vetted Home Tutor</span><br />
              Matched by a{' '}
              <span className="color-blend-text">Subject Test</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto mb-8 animate-slide-up font-medium leading-relaxed" style={{ animationDelay: '120ms' }}>
              1-on-1 home tuition for Class 1–10 students across Uttar Pradesh, Haryana, Uttarakhand, Punjab, Delhi NCR & nearby states.
            </p>

            <div
              ref={searchBarRef}
              className="max-w-2xl mx-auto bg-white border border-neutral-200/80 rounded-2xl p-2 mb-6 animate-slide-up transition-all duration-300 focus-within:shadow-[0_8px_32px_rgba(37,99,235,0.12)] focus-within:border-primary-300 relative z-30"
              style={{ animationDelay: '220ms', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center flex-1 w-full gap-2 px-3 py-2">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0 animate-pulse" aria-hidden="true" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    placeholder="Enter your city or area (e.g. Noida, Meerut, Shastri Nagar)..."
                    className="w-full text-sm font-semibold placeholder-neutral-400 bg-transparent border-0 outline-none focus:ring-0 p-0 text-neutral-800"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto btn-primary h-11 px-7 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-500/20 active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>Find Tutors</span>
                </button>
              </div>

              {/* Suggestions Dropdown panel */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 mt-3 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 overflow-hidden text-left max-h-72 overflow-y-auto">
                  <div className="px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-slate-50/50 flex items-center justify-between">
                    <span>{locationInput.trim() === "" ? "⚡ Popular Locations" : "📍 Location Matches"}</span>
                    {loadingSuggestions && (
                      <span className="animate-pulse text-[9px] text-primary-500 font-bold">Searching...</span>
                    )}
                  </div>
                  <div className="py-1">
                    {suggestions.map((city, idx) => (
                      <button
                        key={`${city.value}-${idx}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(city)}
                        className="w-full px-4 py-2.5 text-xs text-left transition-colors flex items-center gap-2.5 border-0 hover:bg-slate-50 text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-800">{city.name}</span>
                          <span className="text-[10px] text-neutral-400">{city.state}</span>
                        </div>
                      </button>
                    ))}
                    {locationInput.trim() !== "" && suggestions.length === 0 && !loadingSuggestions && (
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-xs text-left transition-colors flex items-center gap-2.5 border-0 hover:bg-slate-50 text-primary-600 font-semibold cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Search custom area "{locationInput}"</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Social proof / Trust Signals row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '320ms' }}>
              <span className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1 font-semibold text-neutral-700">4.9/5 Parent Rating</span>
              </span>
              <span className="hidden sm:inline-block w-px h-4 bg-neutral-200" />
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-400" /> 2,500+ students matched</span>
              <span className="hidden sm:inline-block w-px h-4 bg-neutral-200" />
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 500+ verified home tutors</span>
              <span className="hidden sm:inline-block w-px h-4 bg-neutral-200" />
              <span className="flex items-center gap-1.5 font-semibold text-neutral-600"><MapPin className="w-4 h-4 text-rose-500" /> Serving Meerut, Allahabad & beyond</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section id="stats-strip" className="py-14 border-y border-neutral-100 bg-white relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              const glows = [
                'linear-gradient(135deg, #2563eb, #60a5fa)',
                'linear-gradient(135deg, #10b981, #34d399)',
                'linear-gradient(135deg, #7c3aed, #a78bfa)',
                'linear-gradient(135deg, #f59e0b, #fbbf24)',
              ];
              return (
                <div
                  key={i}
                  className="reveal-on-scroll glow-card text-center flex flex-col items-center gap-3 p-6 cursor-default"
                  style={{ transitionDelay: `${i * 80}ms`, '--glow-gradient': glows[i] }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg} border ${s.border} relative z-20 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${s.color}`} aria-hidden="true" />
                  </div>
                  <div className="relative z-20">
                    <div className={`text-3xl font-black ${s.color} stat-number`}>{s.value}</div>
                    <div className="text-[12px] text-neutral-500 mt-0.5 font-semibold tracking-tight">{s.label}</div>
                  </div>
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
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">From registration to first lesson in 4 steps</h2>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto text-sm">Our diagnostic subject test is what makes us different — matching your child by actual data, not a sales call.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-violet-200 via-amber-200 to-emerald-200" />

            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Create a free account in 2 minutes — for your child or as a teacher.",
                icon: Users,
                color: "bg-blue-600",
                ring: "ring-blue-100",
                badge: null,
              },
              {
                step: "02",
                title: "Take a Short Subject Test",
                desc: "Your child completes a quick diagnostic test online. This reveals exactly where they are — not just what grade they're in.",
                icon: ClipboardCheck,
                color: "bg-violet-600",
                ring: "ring-violet-100",
                badge: "Our differentiator",
              },
              {
                step: "03",
                title: "Cograd Matches You",
                desc: "We pick a vetted, background-checked tutor whose subject strengths align with your child's test results.",
                icon: UserCheck,
                color: "bg-amber-500",
                ring: "ring-amber-100",
                badge: null,
              },
              {
                step: "04",
                title: "Start Learning at Home",
                desc: "Your tutor arrives at your doorstep. Weekly reports keep parents in the loop.",
                icon: TrendingUp,
                color: "bg-emerald-600",
                ring: "ring-emerald-100",
                badge: null,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="reveal-on-scroll glow-card bg-white p-6 transition-all text-center relative"
                  style={{ 
                    transitionDelay: `${i * 110}ms`,
                    overflow: 'visible',
                    '--glow-gradient': i === 0
                      ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                      : i === 1
                      ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                      : i === 2
                      ? 'linear-gradient(135deg, #f59e0b, #fcd34d)'
                      : 'linear-gradient(135deg, #10b981, #34d399)'
                  }}
                >
                  {item.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-violet-600 text-white text-[9px] font-bold rounded-full tracking-wider uppercase whitespace-nowrap shadow z-20">
                      {item.badge}
                    </div>
                  )}
                  <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ${item.ring} relative z-20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-neutral-300 mb-2 tracking-widest relative z-20">STEP {item.step}</div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-2 relative z-20">{item.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed relative z-20">{item.desc}</p>
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
            <div 
              className="reveal-on-scroll slide-left glow-card bg-white p-6 sm:p-8 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group"
              style={{ '--glow-gradient': 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
            >
              <div className="w-20 h-20 bg-primary-50/50 border border-primary-100/50 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-all duration-300 relative z-20">
                <img src="/learning_3d_icon.png" alt="Student Learning" className="w-16 h-16 object-contain group-hover:rotate-3 transition-transform duration-300" />
              </div>
              <div className="flex-grow flex flex-col h-full relative z-20">
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
            <div 
              className="reveal-on-scroll slide-right glow-card bg-white p-6 sm:p-8 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group"
              style={{ '--glow-gradient': 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}
            >
              <div className="w-20 h-20 bg-secondary-50/50 border border-secondary-100/50 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-all duration-300 relative z-20">
                <img src="/teaching_3d_icon.png" alt="Tutor Mission" className="w-16 h-16 object-contain group-hover:-rotate-3 transition-transform duration-300" />
              </div>
              <div className="flex-grow flex flex-col h-full relative z-20">
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
                  className="reveal-on-scroll glow-card bg-neutral-50 p-6 transition-all duration-300 text-center group"
                  style={{ 
                    transitionDelay: `${i * 90}ms`,
                    '--glow-gradient': 'linear-gradient(135deg, #059669, #34d399)'
                  }}
                >
                  <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:border-primary-200 group-hover:bg-primary-50 transition-all duration-300 shadow-sm relative z-20">
                    <Icon className="w-5.5 h-5.5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2 relative z-20">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed relative z-20">{f.desc}</p>
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
              Currently serving Metro Cities and Tier 2/3 hubs across India.
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
                  {STATE_NODES[selectedDistrict].slice(0, -1).map((node, nIdx) => {
                    const nextNode = STATE_NODES[selectedDistrict][nIdx + 1];
                    return (
                      <path 
                        key={nIdx}
                        d={`M ${node.x} ${node.y} Q ${(node.x + nextNode.x)/2} ${(node.y + nextNode.y)/2 - 15}, ${nextNode.x} ${nextNode.y}`} 
                        stroke="url(#lineGrad)" 
                        className="animate-dash-flow opacity-60" 
                      />
                    );
                  })}
                </g>

                {/* City Nodes */}
                {STATE_NODES[selectedDistrict].map((c) => {
                  const nodeColor = c.color;
                  return (
                    <g 
                      key={c.name} 
                      className="cursor-pointer group/node"
                      onClick={() => handleSelectCity(c.name)}
                    >
                      {/* Pulse effect */}
                      <circle cx={c.x} cy={c.y} r="6" fill={nodeColor} opacity="0.4">
                        <animate attributeName="r" values="6;16" dur="2s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0" dur="2s" begin="0s" repeatCount="indefinite" />
                      </circle>

                      {/* Main Node Point */}
                      <circle 
                        cx={c.x} 
                        cy={c.y} 
                        r="5" 
                        fill={nodeColor} 
                        className="transition-all duration-300 stroke-white stroke-2 group-hover/node:scale-125"
                        style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                      />

                      {/* Node label */}
                      <text 
                        x={c.x} 
                        y={c.y - 12} 
                        textAnchor="middle" 
                        className="text-[9px] select-none font-bold fill-neutral-800 drop-shadow-sm transition-all duration-300 group-hover/node:fill-primary-700"
                        style={{ transformOrigin: `${c.x}px ${c.y - 12}px` }}
                      >
                        {c.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-neutral-200/80 shadow-sm rounded-full text-[9px] font-bold text-neutral-600 tracking-wider uppercase z-20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Interactive state map
              </div>
            </div>

            {/* Right Side: Interactive Details Panel */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              {/* Tab Selector */}
              <div className="flex flex-row overflow-x-auto scrollbar-none sm:flex-nowrap bg-slate-100/85 p-1.5 rounded-xl border border-slate-200/50 gap-1 select-none">
                {DISTRICTS.map((d, index) => (
                  <button
                    key={d.city}
                    onClick={() => setSelectedDistrict(index)}
                    className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer shrink-0 ${
                      selectedDistrict === index
                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/40'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {d.city}
                    <span className="ml-1.5 w-1.5 h-1.5 inline-block bg-emerald-500 rounded-full animate-pulse" />
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
                    <div className={`text-3xl font-extrabold ${DISTRICTS[selectedDistrict].textColor}`}>
                      {DISTRICTS[selectedDistrict].students}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1.5 font-semibold tracking-wide uppercase">
                      {DISTRICTS[selectedDistrict].statsLabel1}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors duration-300">
                    <div className={`text-3xl font-extrabold ${DISTRICTS[selectedDistrict].textColor}`}>
                      {DISTRICTS[selectedDistrict].teachers}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1.5 font-semibold tracking-wide uppercase">
                      {DISTRICTS[selectedDistrict].statsLabel2}
                    </div>
                  </div>
                </div>

                {/* Interactive city tags */}
                <div className="mt-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2">Select a City to Search Tutors:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {DISTRICTS[selectedDistrict].cities.map((city) => (
                      <span 
                        key={city}
                        onClick={() => handleSelectCity(city)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-neutral-600 hover:text-neutral-900 border border-slate-200/60 rounded-full transition-all duration-200 cursor-pointer"
                      >
                        📍 {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call-to-Action */}
              <Link
                to={DISTRICTS[selectedDistrict].link}
                className={`w-full py-3.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 text-center ${DISTRICTS[selectedDistrict].btnClass}`}
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
                Join students across India getting quality education right at home.
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
