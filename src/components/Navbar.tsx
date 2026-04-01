import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, User, X, Coffee, Pizza, Cake, ShoppingBag, Calendar, ArrowRight } from "lucide-react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { useAdmin } from "../hooks/useAdmin";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Menu", path: "/menu", icon: Coffee },
    { name: "Book Table", path: "/booking", icon: Calendar },
    { name: "Shop Beans", path: "/shop", icon: ShoppingBag },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto glass rounded-full px-6 md:px-8 py-4 flex justify-between items-center pointer-events-auto shadow-2xl shadow-berry/5 border border-berry/5">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" color="var(--color-berry)" />
            <span className="text-xl font-display italic font-black tracking-tighter text-berry">OVEN BERRIES</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry/60 hover:text-berry transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry font-black hover:text-berry-light transition-colors">Admin</Link>
            )}
            <div className="h-4 w-px bg-berry/10 mx-2" />
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-berry/5 flex items-center justify-center group-hover:bg-berry transition-colors">
                  <User size={14} className="text-berry group-hover:text-white transition-colors" />
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full bg-berry text-white hover:bg-berry-light transition-all">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to="/profile" className="w-8 h-8 rounded-full bg-berry/5 flex items-center justify-center">
                <User size={14} className="text-berry" />
              </Link>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-berry hover:bg-berry/5 rounded-full transition-colors"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream/95 backdrop-blur-xl md:hidden flex flex-col pt-32 px-8"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-berry/5 flex items-center justify-center group-hover:bg-berry group-hover:text-white transition-all">
                      <link.icon size={20} />
                    </div>
                    <div>
                      <span className="text-3xl font-display italic font-bold text-berry block">
                        {link.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-berry/40">
                        Explore Our {link.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/admin" className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-berry/5 flex items-center justify-center group-hover:bg-berry group-hover:text-white transition-all">
                      <User size={20} />
                    </div>
                    <span className="text-3xl font-display italic font-bold text-berry">Admin Panel</span>
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="mt-auto mb-12">
              {!user ? (
                <Link 
                  to="/login"
                  className="w-full py-6 bg-berry text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-berry/20"
                >
                  Login to Account <ArrowRight size={18} />
                </Link>
              ) : (
                <Link 
                  to="/profile"
                  className="w-full py-6 border-2 border-berry/10 text-berry rounded-[2rem] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  View Profile <User size={18} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
