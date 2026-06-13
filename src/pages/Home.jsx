import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle, 
  MapPin, 
  Users, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  Star
} from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen relative overflow-hidden bg-grid-subtle">
      
      {/* Decorative Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100 rounded-full opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Main Hero Side-by-Side Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto pt-10 items-stretch">
          
          {/* Card 1: Find Your Perfect Home Teacher */}
          <div className="animate-slide-in-left flex flex-col">
            <div className="card card-float p-8 bg-white border border-blue-100/60 rounded-3xl flex-1 flex flex-col items-center relative pt-14 shadow-lg hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)] transition-shadow duration-300">
              
              {/* Badge/Icon top center offset */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg z-20">
                <BookOpen className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  Find Your Perfect <span className="color-blend-blue">Home Teacher</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Connect with verified, experienced teachers at your doorstep
                </p>
              </div>

              {/* List items - Left aligned but centered container */}
              <div className="w-full max-w-xs space-y-4 mb-8 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Vetted & Qualified Teachers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <GraduationCap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Home Tuition Convenience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Weekly Progress Reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <Clock className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Flexible Home Scheduling</span>
                </div>
              </div>

              {/* Buttons and Stats at bottom */}
              <div className="w-full mt-auto">
                <div className="flex gap-4 mb-6">
                  <Link to="/student" className="flex-1 btn-primary py-3 btn-shimmer">
                    Find Tutors
                  </Link>
                  <Link to="/demo-booking" className="flex-1 btn-outline-primary py-3 btn-shimmer">
                    Book Free Demo
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-700">4.9/5 Rating</span>
                  </div>
                  <span>•</span>
                  <span>10,000+ Students</span>
                  <span>•</span>
                  <span>500+ Tutors</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Join Cograd's Mission */}
          <div className="animate-slide-in-right flex flex-col">
            <div className="card card-float-delayed-1 p-8 bg-white border border-purple-100/60 rounded-3xl flex-1 flex flex-col items-center relative pt-14 shadow-lg hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] transition-shadow duration-300">
              
              {/* Badge/Icon top center offset */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg z-20">
                <GraduationCap className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  Join <span className="color-blend-purple">Cograd's Mission</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Help bridge the educational gap in rural areas
                </p>
              </div>

              {/* List items - Left aligned but centered container */}
              <div className="w-full max-w-xs space-y-4 mb-8 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <DollarSign className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">20-30% Higher Pay</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <Clock className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Flexible Home Schedule</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Cograd Brand Value</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center shadow">
                    <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Experience Letters</span>
                </div>
              </div>

              {/* Buttons and Stats at bottom */}
              <div className="w-full mt-auto">
                <div className="flex gap-4 mb-6">
                  <Link to="/teacher" className="flex-1 btn-secondary py-3 btn-shimmer">
                    Join as Teacher
                  </Link>
                  <Link to="/register/teacher" className="flex-1 btn-outline-secondary py-3 btn-shimmer">
                    Apply Now
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Avg $40/hr</span>
                  </div>
                  <span>•</span>
                  <span>Weekly Payments</span>
                  <span>•</span>
                  <span>24/7 Support</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic Ready Banner */}
        <div className="text-center mt-12 bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Ready to Bridge the Rural Education Gap?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join <strong className="font-extrabold text-gray-900">Cograd's</strong> mission to bring quality education to Tier 3 districts and rural areas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link to="/student" className="btn-primary btn-shimmer">I'm a Student</Link>
            <Link to="/teacher" className="btn-secondary btn-shimmer">I'm a Teacher</Link>
            <Link to="/demo-booking" className="btn-outline-accent btn-shimmer">Book Free Demo</Link>
          </div>
        </div>

      </div>

      {/* Target Districts & Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-t border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-5 py-2 rounded-full mb-6 shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold">Shark Tank Featured Company</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              <span className="font-black color-blend-text">Cograd's</span> Mission: <span className="text-primary-500">Bridging Rural Education</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're bringing quality home education to the doorsteps of students in Tier 3 districts and rural areas. Our experienced, vetted teachers provide personalized learning with regular progress tracking and skill assessments.
            </p>
          </div>

          {/* Grid Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="reveal-on-scroll flex flex-col" style={{ transitionDelay: '0ms' }}>
              <div className="card-float text-center bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex-1 flex flex-col justify-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">8</div>
                <div className="text-gray-600 text-sm font-semibold">Rural Schools Opened</div>
              </div>
            </div>

            <div className="reveal-on-scroll flex flex-col" style={{ transitionDelay: '100ms' }}>
              <div className="card-float-delayed-1 text-center bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex-1 flex flex-col justify-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-extrabold text-green-600 mb-1">125</div>
                <div className="text-gray-600 text-sm font-semibold">Students Impacted</div>
              </div>
            </div>

            <div className="reveal-on-scroll flex flex-col" style={{ transitionDelay: '200ms' }}>
              <div className="card-float-delayed-2 text-center bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex-1 flex flex-col justify-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-600 mb-1">25</div>
                <div className="text-gray-600 text-sm font-semibold">Qualified Teachers</div>
              </div>
            </div>

            <div className="reveal-on-scroll flex flex-col" style={{ transitionDelay: '300ms' }}>
              <div className="card-float-delayed-3 text-center bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex-1 flex flex-col justify-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-yellow-600" />
                </div>
                <div className="text-3xl font-extrabold text-yellow-600 mb-1">95%</div>
                <div className="text-gray-600 text-sm font-semibold">Parent Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Target Districts Comparison */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Target Districts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              <div className="reveal-on-scroll slide-left flex flex-col">
                <div className="card-float-delayed-1 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">Meerut</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wider">Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-extrabold text-primary-500">30,000+</div>
                      <div className="text-xs text-gray-500 font-bold uppercase mt-1">Students</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-extrabold text-secondary-500">50+</div>
                      <div className="text-xs text-gray-500 font-bold uppercase mt-1">Teachers</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal-on-scroll slide-right flex flex-col">
                <div className="card-float-delayed-2 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-300 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">Allahabad</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 uppercase tracking-wider">Launching Soon</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-extrabold text-primary-500">25,000+</div>
                      <div className="text-xs text-gray-500 font-bold uppercase mt-1">Students</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-extrabold text-secondary-500">40+</div>
                      <div className="text-xs text-gray-500 font-bold uppercase mt-1">Teachers</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Progress & Impact Interactive Panel */}
          <div className="reveal-on-scroll bg-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border border-gray-100/50">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Progress & Impact</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="text-center flex flex-col justify-between items-center h-full p-4 hover:bg-slate-50 rounded-2xl transition-colors duration-200">
                <div className="w-44 h-44 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative group cursor-pointer">
                  <BookOpen className="w-16 h-16 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -bottom-2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">Assessments</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Student Progress Distribution</h4>
                  <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                    Weekly skill assessments and monthly progress reports allow parents and teachers to track development closely.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col justify-between items-center h-full p-4 hover:bg-slate-50 rounded-2xl transition-colors duration-200">
                <div className="w-44 h-44 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative group cursor-pointer">
                  <TrendingUp className="w-16 h-16 text-accent-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -bottom-2 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold">Performance</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Teacher Performance Metrics</h4>
                  <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                    Regular reviews, feedback from parents, and curriculum adherence logs ensure highest educational standards.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Mission Section */}
          <div className="reveal-on-scroll mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-extrabold mb-4">Join Our Mission Today</h3>
              <p className="text-lg lg:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Help us bring quality education to rural areas. Whether you're a teacher looking to make an impact or a parent seeking quality home tuition, we're here to connect you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link to="/student" className="btn-slide-white px-8 py-3 btn-shimmer">
                  Find Home Teacher
                </Link>
                <Link to="/teacher" className="btn-outline-white px-8 py-3 btn-shimmer">
                  Join as Teacher
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick About Overview */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 border-t border-gray-100 relative overflow-hidden bg-dot-subtle">
        
        {/* Decorative blur blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            
            <div className="reveal-on-scroll inline-flex items-center space-x-2 bg-slate-100 text-slate-800 px-4 py-1.5 rounded-full mb-6 border border-slate-200/50 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">About Our Platform</span>
            </div>

            <h2 className="reveal-on-scroll text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              About <span className="font-black pb-0.5 color-blend-text">Cograd Pathshala</span>
            </h2>

            <p className="reveal-on-scroll text-base sm:text-lg text-gray-600 leading-relaxed font-medium" style={{ transitionDelay: '100ms' }}>
              <strong className="font-extrabold text-gray-900"><span className="pb-0.5 color-blend-text">Cograd Pathshala</span></strong> is a strategic initiative by <strong className="font-extrabold text-gray-900">Cograd</strong>, an EdTech company focused on providing quality education in rural and Tier 3 districts. We're bridging the educational gap by connecting qualified, vetted teachers with students in select districts (starting with Meerut and Allahabad) for both home tuitions and school placements.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: For Teachers */}
            <div className="reveal-on-scroll slide-left flex flex-col" style={{ transitionDelay: '200ms' }}>
              <div className="card text-center p-8 bg-white border border-gray-100 hover:border-primary-200 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex-1 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-50 text-primary-500 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/40">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Teachers</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  Higher remuneration, <strong className="font-bold text-gray-800">Cograd</strong> brand credibility, formal experience letters, and professional growth opportunities.
                </p>
                <div className="w-full border-t border-slate-100 pt-4 mt-6">
                  <Link to="/teacher" className="text-xs font-bold text-primary-500 hover:text-primary-600 inline-flex items-center space-x-1 cursor-pointer">
                    <span>Explore opportunities</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: For Students */}
            <div className="reveal-on-scroll flex flex-col" style={{ transitionDelay: '300ms' }}>
              <div className="card text-center p-8 bg-white border border-gray-100 hover:border-secondary-200 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex-1 flex flex-col items-center">
                <div className="w-14 h-14 bg-purple-50 text-secondary-500 rounded-2xl flex items-center justify-center mb-6 border border-purple-100/40">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Students & Parents</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  High-quality education through experienced teachers, home tuition convenience, and regular progress tracking.
                </p>
                <div className="w-full border-t border-slate-100 pt-4 mt-6">
                  <Link to="/student" className="text-xs font-bold text-secondary-500 hover:text-secondary-600 inline-flex items-center space-x-1 cursor-pointer">
                    <span>Find home tutor</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: For Cograd */}
            <div className="reveal-on-scroll slide-right flex flex-col" style={{ transitionDelay: '400ms' }}>
              <div className="card text-center p-8 bg-white border border-gray-100 hover:border-accent-200 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex-1 flex flex-col items-center">
                <div className="w-14 h-14 bg-green-50 text-accent-500 rounded-2xl flex items-center justify-center mb-6 border border-green-100/40">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Cograd</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  Building a sustainable model for localized, high-quality educational services where they're needed most.
                </p>
                <div className="w-full border-t border-slate-100 pt-4 mt-6">
                  <Link to="/demo-booking" className="text-xs font-bold text-accent-500 hover:text-accent-600 inline-flex items-center space-x-1 cursor-pointer">
                    <span>Book free demo</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
