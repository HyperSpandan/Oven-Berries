import { Link } from "react-router-dom";
import { Menu as MenuIcon, User } from "lucide-react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import { useAdmin } from "../hooks/useAdmin";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const { isAdmin } = useAdmin();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto glass rounded-full px-8 py-4 flex justify-between items-center pointer-events-auto shadow-2xl shadow-berry/5 border border-berry/5">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" color="var(--color-berry)" />
          <span className="text-xl font-display italic font-black tracking-tighter text-berry">OVEN BERRIES</span>
        </Link>

        <div className="hidden md:flex space-x-10 items-center">
          <Link to="/menu" className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry/60 hover:text-berry transition-colors">Menu</Link>
          <Link to="/booking" className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry/60 hover:text-berry transition-colors">Book Table</Link>
          <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry/60 hover:text-berry transition-colors">Shop Beans</Link>
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

        <div className="md:hidden flex items-center">
          <button className="p-2 text-berry">
            <MenuIcon size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
