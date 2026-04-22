import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, MapPin, Clock, Phone, Mail, Globe, MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-surface-100/50 backdrop-blur-sm mt-20">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white heading-elegant">APOORVA</h3>
                <p className="text-[10px] text-brand-400 tracking-[0.2em]">RESTAURANT</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Fine dining experience. Where tradition meets excellence to create unforgettable flavors.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/menu", label: "Our Menu" },
                { to: "/feedbacks", label: "Customer Feedback" },
                { to: "/reservations", label: "Reservations" },
                { to: "/orders", label: "Track Orders" },
                { to: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 hover:text-brand-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                Apoorva's Restaurant, Nehru chawk, Lokandvala, Maharashtra
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                7207852172
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                info@apoorvarestaurant.com
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 font-medium">Mon – Fri</p>
                  <p>11:00 AM – 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 font-medium">Sat – Sun</p>
                  <p>10:00 AM – 12:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Apoorva Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
