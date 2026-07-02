import { Link } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    to: '/register/student',
    icon: GraduationCap,
    heading: 'I am a Student',
    subtext: 'I want to find a home tutor for myself',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    border: 'border-blue-100 hover:border-blue-400',
    shadow: 'hover:shadow-blue-100/50',
    arrow: 'text-blue-400 group-hover:text-blue-600',
  },
  {
    id: 'parent',
    to: '/register/parent',
    icon: Users,
    heading: 'I am a Parent / Guardian',
    subtext: 'I want to find a home tutor for my child',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100 hover:border-amber-400',
    shadow: 'hover:shadow-amber-100/50',
    arrow: 'text-amber-400 group-hover:text-amber-600',
  },
  {
    id: 'teacher',
    to: '/register/teacher',
    icon: BookOpen,
    heading: 'I am a Teacher',
    subtext: 'I want to teach students and grow my tutoring career',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-purple-100 hover:border-purple-400',
    shadow: 'hover:shadow-purple-100/50',
    arrow: 'text-purple-400 group-hover:text-purple-600',
  },
];

const RoleSelector = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Join Cograd Pathshala</h1>
          <p className="text-slate-500 text-sm">Who are you registering as?</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {ROLES.map(({ id, to, icon: Icon, heading, subtext, color, iconColor, border, shadow, arrow }) => (
            <Link
              key={id}
              to={to}
              className={`group relative flex flex-col items-start p-6 sm:p-8 bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer no-glass ${border} ${shadow} hover:shadow-xl hover:-translate-y-0.5`}
              style={{ textDecoration: 'none' }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1.5">{heading}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{subtext}</p>
              <div className={`mt-auto flex items-center gap-1.5 text-sm font-semibold ${arrow} transition-all`}>
                Continue
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-800 hover:underline">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RoleSelector;
