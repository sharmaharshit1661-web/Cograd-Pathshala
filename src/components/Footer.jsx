import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center text-white">
              <span className="text-2xl font-black tracking-tight pb-0.5 logo-shimmer">
                Cograd Pathshala
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging the educational gap in Tier 3 districts and rural areas. Connecting qualified, vetted home teachers with students for quality education at their doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/student" className="hover:text-primary-400 transition-colors">Find Home Teachers</Link>
              </li>
              <li>
                <Link to="/teacher" className="hover:text-primary-400 transition-colors">Join as a Teacher</Link>
              </li>
              <li>
                <Link to="/demo-booking" className="hover:text-primary-400 transition-colors">Book a Free Demo</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">About Our Mission</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">Get in Touch</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>contact@cogradpathshala.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                <span>Serving Meerut & Allahabad districts, Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>

          {/* Core Values / Features */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Our Values</h3>
            <p className="text-sm text-slate-400 mb-2 leading-relaxed">
              We believe in empathy, technology-led innovation, community growth, and maintaining high excellence standards.
            </p>
            <div className="inline-flex items-center space-x-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
              <span>Shark Tank Featured Company</span>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Cograd Pathshala. All rights reserved.</p>
          <p className="flex items-center">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-current" /> to bridge the educational gap.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
