import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Heart
} from 'lucide-react';

const JOURNEY_TIMELINE = [
  {
    year: '2020',
    title: 'Cograd Founded',
    desc: 'Started with a vision to democratize quality education across non-metropolitan districts in India.',
    icon: Compass
  },
  {
    year: '2021',
    title: 'First Rural School',
    desc: 'Partnered with local administrators to open our first physical school placement in rural Uttar Pradesh.',
    icon: MapPin
  },
  {
    year: '2022',
    title: 'Shark Tank Success',
    desc: 'Featured on Shark Tank India, securing strategic investments and national credibility.',
    icon: Award
  },
  {
    year: '2023',
    title: '50+ Schools Milestone',
    desc: 'Expanded school placements to 50+ rural campuses, training and deploying local educators.',
    icon: Users
  },
  {
    year: '2024',
    title: 'Pathshala Launch',
    desc: 'Launched Cograd Pathshala to bridge local home tuition demands in Meerut and Allahabad.',
    icon: GraduationCap
  }
];

const VALUES = [
  {
    title: 'Empathy',
    desc: 'Understanding the unique socio-economic and logistical challenges of rural communities.',
    icon: Heart,
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Innovation',
    desc: 'Using technology to bridge educational divides and build interactive, simple learning tools.',
    icon: Sparkles,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Community',
    desc: 'Building sustainable micro-economies by recruiting, training, and paying local teachers.',
    icon: Users,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Excellence',
    desc: 'Maintaining high curriculum standards, vetting cycles, and progress reports.',
    icon: ShieldCheck,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50'
  }
];

const TEAM = [
  {
    name: 'Rahul Kumar',
    role: 'Founder & CEO',
    desc: 'Former teacher with 15+ years experience in rural education management and policy.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Operations',
    desc: 'Operations specialist focusing on local coordinator networks and tutor vetting frameworks.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Amit Patel',
    role: 'Technology Lead',
    desc: 'EdTech software architect creating remote-first testing grids and assessment systems.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1.5 rounded-full mb-6 shadow-md animate-fade-in">
              <Award className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Shark Tank Featured Company</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-slide-up">
              About <span className="color-blend-text">Cograd</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed animate-slide-up" style={{ animationDelay: '150ms' }}>
              We are on a mission to bridge the educational gap in rural India. Through localized coordination, verified doorstep teachers, and progress-tracking frameworks, we bring premium home tuitions to Tier 3 districts.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight reveal-on-scroll">
                Our <span className="text-primary-500">Mission</span>
              </h2>
              <p className="text-gray-600 leading-relaxed reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
                To democratize quality education by making it accessible, affordable, and highly effective for every student, regardless of their geographical location or economic background.
              </p>
              <p className="text-gray-600 leading-relaxed reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
                We believe that every child deserves access to excellent teachers and structured mentoring, starting in the areas where schools and resources are needed most.
              </p>
              <div className="flex items-center space-x-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/30 reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">Rural First Approach</h4>
                  <p className="text-xs text-gray-500 font-semibold">We initiate where development challenges are greatest</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 border border-primary-100/20 reveal-on-scroll slide-right">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Our Vision</h3>
              <div className="space-y-4">
                {[
                  'Transform rural educational landscapes through localized technology frameworks.',
                  'Create sustainable livelihoods for qualified local teachers, ensuring higher pay.',
                  'Build a replicable, high-impact model for community development in tier 3 districts.',
                  'Empower families with detailed, transparent metrics of student improvements.'
                ].map((vis, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">{vis}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight reveal-on-scroll">Our Journey</h2>
            <p className="text-gray-600 text-sm reveal-on-scroll" style={{ transitionDelay: '100ms' }}>From a small startup to a recognized name in rural education</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200 hidden md:block reveal-on-scroll" style={{ transitionDuration: '2s' }}></div>

            <div className="space-y-12">
              {JOURNEY_TIMELINE.map((item, idx) => {
                const IconComp = item.icon;
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    
                    {/* Circle Node */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-500 rounded-full border-4 border-white shadow hidden md:block z-10 reveal-on-scroll timeline-node-reveal"
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    ></div>
                    
                    {/* Left/Right content wrappers */}
                    <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8 text-right' : 'md:pl-8 text-left'}`}>
                      <div 
                        className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 reveal-on-scroll ${isEven ? 'slide-left' : 'slide-right'}`}
                        style={{ transitionDelay: `${idx * 100}ms` }}
                      >
                        <div className={`flex items-center space-x-3 mb-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
                          {isEven && <span className="text-2xl font-black text-primary-500">{item.year}</span>}
                          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 shadow-inner">
                            <IconComp className="w-5 h-5 animate-pulse" />
                          </div>
                          {!isEven && <span className="text-2xl font-black text-primary-500">{item.year}</span>}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Spacer for non-desktop layouts */}
                    <div className="w-full md:w-5/12 hidden md:block"></div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 reveal-on-scroll">Our Core Values</h2>
            <p className="text-gray-600 text-sm reveal-on-scroll" style={{ transitionDelay: '100ms' }}>The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div 
                  key={idx} 
                  className="text-center p-6 bg-slate-50 border border-gray-100 rounded-3xl hover:shadow-md transition-shadow reveal-on-scroll"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-18 h-18 bg-gradient-to-br ${val.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-md`}>
                    <IconComp className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Team Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 reveal-on-scroll">Meet Our Team</h2>
            <p className="text-gray-600 text-sm reveal-on-scroll" style={{ transitionDelay: '100ms' }}>The passionate individuals driving our mission forward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 shadow border border-gray-100 hover:shadow-xl transition-all duration-300 text-center flex flex-col justify-between reveal-on-scroll"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-primary-500 shadow"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-500 font-bold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner & Call to Actions */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Join Our Mission Today</h2>
            <p className="text-base lg:text-lg opacity-90 leading-relaxed">
              Whether you are a teacher looking to make an impact or a parent seeking quality education for your child, we are here to support you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link to="/register/teacher" className="btn-slide-white px-8 py-3">
              Join as Teacher
            </Link>
            <Link to="/register/student" className="btn-outline-white px-8 py-3">
              Find Teachers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
