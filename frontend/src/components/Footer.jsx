import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-neutral-800">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <span className="text-xl font-black tracking-tight logo-shimmer">Cograd Pathshala</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Bridging the educational gap in Tier 3 districts and rural areas — qualified, vetted home teachers at your doorstep.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Shark Tank Featured Company
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neutral-200 font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Find Home Teachers', to: '/student' },
                { label: 'Join as a Teacher', to: '/teacher' },
                { label: 'Book a Free Demo', to: '/demo-booking' },
                { label: 'About Our Mission', to: '/about' },
                { label: 'Get in Touch', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-neutral-200 font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-neutral-500">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-500">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>contact@cogradpathshala.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-500">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Workspace by Innova, B-4, Sector 63 (Near Sector 62 Metro), Noida 201301</span>
              </li>
            </ul>
          </div>

          {/* Values */}
          <div>
            <h4 className="text-neutral-200 font-semibold text-sm mb-4">Our Values</h4>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              Empathy, technology-led innovation, community growth, and uncompromising excellence in every home tuition.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Empathy', 'Innovation', 'Community', 'Excellence'].map((v) => (
                <span key={v} className="text-[11px] font-medium text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-full">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} Cograd Pathshala. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> to bridge the education gap
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
