import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-berry text-white py-32 rounded-t-[4rem] mt-12 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          <div className="md:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-10"
            >
              <Logo className="w-16 h-16" color="var(--color-cream)" />
              <h3 className="text-4xl md:text-6xl font-display italic font-black tracking-tighter">
                OVEN BERRIES
              </h3>
            </motion.div>
            <p className="text-white/60 max-w-sm text-lg leading-relaxed mb-12">
              Speciality Coffee, Wood-fired Pizzeria, and Artisanal Bakehouse. Experience the aesthetic of fine dining in Nanded.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                <MapPin size={20} className="group-hover:text-oven transition-colors" />
                <span className="text-sm font-bold uppercase tracking-widest">ANAND NAGAR, NANDED, MAHARASTRA</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                <Phone size={20} className="group-hover:text-oven transition-colors" />
                <span className="text-sm font-bold uppercase tracking-widest">+91 9890603946</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                <Mail size={20} className="group-hover:text-oven transition-colors" />
                <span className="text-sm font-bold uppercase tracking-widest">hello@ovenberries.com</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-10">Navigation</h4>
            <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
              <li><Link to="/menu" className="hover:text-oven transition-colors">Menu</Link></li>
              <li><Link to="/booking" className="hover:text-oven transition-colors">Book Table</Link></li>
              <li><Link to="/shop" className="hover:text-oven transition-colors">Shop Beans</Link></li>
              <li><Link to="/login" className="hover:text-oven transition-colors">Member Access</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-10">Social</h4>
            <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
              <li><a href="https://www.instagram.com/oven_berries_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-oven transition-colors flex items-center gap-3"><Instagram size={18} /> Instagram</a></li>
              <li><a href="#" className="hover:text-oven transition-colors flex items-center gap-3"><Facebook size={18} /> Facebook</a></li>
              <li><a href="#" className="hover:text-oven transition-colors flex items-center gap-3"><Twitter size={18} /> Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          <p>© 2026 Oven Berries. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
