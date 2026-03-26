import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Floating3DElements from "./components/Floating3DElements";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-berry/5 border border-berry/10 rounded-full pointer-events-none z-[99999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-berry rounded-full pointer-events-none z-[99999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}

function Login() {
  const [user, loading] = useAuthState(auth);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (loading) return <div className="pt-40 text-center font-mono text-[10px] uppercase tracking-widest">Loading...</div>;
  if (user) return <Navigate to="/profile" />;

  return (
    <div className="pt-40 pb-24 min-h-screen flex items-center justify-center bg-cream">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-16 rounded-[4rem] shadow-2xl border border-gray-100 max-w-md w-full text-center"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-6 block">Access</span>
        <h2 className="text-5xl font-display italic font-bold text-berry mb-8 tracking-tighter">Welcome <br /> <span className="text-berry/30">Back.</span></h2>
        <p className="text-sage mb-12 text-sm leading-relaxed">Sign in to manage your bookings and orders.</p>
        <button
          onClick={handleLogin}
          className="w-full py-5 bg-berry text-white rounded-3xl font-bold uppercase tracking-[0.2em] hover:bg-berry-light transition-all flex items-center justify-center gap-4 text-xs shadow-2xl shadow-berry/20"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 invert" alt="Google" />
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}

function EntranceEffect({ children }: { children: React.ReactNode }) {
  const [showCurtain, setShowCurtain] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCurtain(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key="curtain"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
            className="fixed inset-0 bg-berry z-[10000] origin-top flex items-center justify-center overflow-hidden"
          >
            <Floating3DElements />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
              transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
              className="text-white text-center relative z-10"
            >
              <h1 className="text-6xl font-display italic font-bold tracking-tighter">Oven Berries</h1>
              <p className="text-[10px] uppercase tracking-[0.5em] mt-4 opacity-50">Artisanal Bakery</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-berry origin-left z-[10001]"
      style={{ scaleX }}
    />
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <ScrollProgress />
        <EntranceEffect>
          <div className="relative min-h-screen bg-cream">
            <div className="noise" />
            <CustomCursor />
            <Navbar />
            <main>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors />
          </div>
        </EntranceEffect>
      </Router>
    </HelmetProvider>
  );
}
