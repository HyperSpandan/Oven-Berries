import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Coffee, Pizza, Cake, Instagram, MapPin, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const showcaseRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: showcaseScroll } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  const textParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const showcaseY = useTransform(showcaseScroll, [0, 1], [100, -100]);

  return (
    <div className="relative bg-cream">
      <Helmet>
        <title>Oven Berries | Speciality Coffee, Wood-fired Pizzeria & Artisanal Bakehouse</title>
        <meta name="description" content="Experience the aesthetic of fine dining in Nanded at Oven Berries. Speciality coffee, wood-fired pizzas, and artisanal bakes in a minimal, modern setting." />
      </Helmet>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-cream">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            <source src="/OvenBerries.mp4" type="video/mp4" />
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000"
              alt="Oven Berries Interior"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-berry/20 via-transparent to-cream" />
        </motion.div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            style={{ y: textParallax }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-berry/10 text-[10px] font-bold uppercase tracking-[0.3em] text-berry mb-8">
              Est. 2025 • Nanded
            </span>
            <h1 className="text-[18vw] md:text-[12vw] font-display italic font-black leading-[0.85] tracking-[-0.04em] mb-12 text-berry mix-blend-multiply">
              Oven <br /> Berries
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12">
              <MagneticButton>
                <Link
                  to="/menu"
                  className="group relative px-10 py-5 bg-berry text-white rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden flex items-center gap-3 shadow-xl shadow-berry/20"
                >
                  <span className="relative z-10">Explore Menu</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </MagneticButton>
              
              <Link
                to="/booking"
                className="text-sm font-bold uppercase tracking-widest text-berry/60 hover:text-berry transition-colors flex items-center gap-2 group"
              >
                Book a Table <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aesthetic Showcase */}
      <section ref={showcaseRef} className="py-32 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-display italic font-bold leading-tight mb-8 text-berry">
                  Crafted for <br /> the <span className="text-oven">Aesthetic</span> <br /> Soul.
                </h2>
                <p className="text-xl text-sage font-medium leading-relaxed mb-12">
                  A sanctuary where minimal design meets artisanal excellence. We've curated every corner to be your perfect backdrop.
                </p>
                <div className="flex gap-12">
                  <div>
                    <span className="text-4xl font-bold block mb-1 text-berry">8am</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sage/60">Opening</span>
                  </div>
                  <div>
                    <span className="text-4xl font-bold block mb-1 text-berry">11:30pm</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sage/60">Closing</span>
                  </div>
                  <div>
                    <span className="text-4xl font-bold block mb-1 text-berry">4.9</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sage/60">Rating</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 perspective-1000">
              <motion.div
                style={{ y: showcaseY }}
                whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
                className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl transform-gpu transition-all duration-500 border-4 border-white"
              >
                <img src="/oven_berries.webp" className="w-full h-full object-cover transition-all duration-700" referrerPolicy="no-referrer" />
              </motion.div>
              <motion.div
                style={{ y: useTransform(showcaseScroll, [0, 1], [-100, 100]) }}
                whileHover={{ rotateY: 10, rotateX: -5, scale: 1.02 }}
                className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl mt-12 transform-gpu transition-all duration-500 border-4 border-white"
              >
                <img src="/oven_berries2.webp" className="w-full h-full object-cover transition-all duration-700" referrerPolicy="no-referrer" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Brewing Video Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 block">The Art of Brewing</span>
            <h2 className="text-4xl md:text-8xl font-display italic font-bold tracking-tighter leading-none">Manual Craftsmanship.</h2>
          </motion.div>
          
          <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl bg-berry/5 group">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/brewing.mp4" type="video/mp4" />
              <div className="absolute inset-0 flex items-center justify-center text-berry/20 font-display italic text-4xl">
                Brewing Excellence...
              </div>
            </video>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center">
                <Coffee size={40} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Menu Preview */}
      <section className="py-32 bg-berry text-white rounded-[4rem] mx-4 my-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-6 block"
            >
              The Collection
            </motion.span>
            <h2 className="text-5xl md:text-8xl font-display italic font-bold tracking-tighter">Signature Flavors</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[800px]">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 bg-oven/20 backdrop-blur-md border border-white/10 rounded-[3rem] p-12 flex flex-col justify-end relative overflow-hidden group"
            >
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className="relative z-10">
                <Pizza size={40} className="mb-6 text-oven" />
                <h3 className="text-4xl font-bold mb-4">Wood-Fired Pizzeria</h3>
                <p className="text-white/80 mb-8 max-w-xs">Authentic Italian flavors, baked to perfection in our traditional stone oven.</p>
                <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group/btn bg-white text-berry px-6 py-3 rounded-full">
                  View Menu <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 flex items-center gap-8 group overflow-hidden"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-all" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Speciality Coffee</h3>
                <p className="text-white/60 text-sm">Ethically sourced, expertly roasted.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="rounded-[3rem] p-10 flex flex-col justify-center items-center text-center group relative overflow-hidden bg-black"
            >
              <img 
                src="/bakehouse.webp" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" 
                referrerPolicy="no-referrer" 
              />
              <div className="relative z-10">
                <Cake size={32} className="mb-4 text-white group-hover:scale-110 transition-transform mx-auto" />
                <h3 className="text-xl font-bold text-white">Bakehouse</h3>
              </div>
            </motion.div>

            <motion.a 
              href="https://www.instagram.com/oven_berries_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 0.98 }}
              className="rounded-[3rem] p-10 flex flex-col justify-center items-center text-center group relative overflow-hidden bg-black cursor-pointer"
            >
              <img 
                src="/aesthetics.webp" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" 
                referrerPolicy="no-referrer" 
              />
              <div className="relative z-10">
                <Instagram size={32} className="mb-4 text-white group-hover:scale-110 transition-transform mx-auto" />
                <h3 className="text-xl font-bold text-white">Aesthetic Vibe</h3>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Coffee Beans Shop Preview */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 block">The Shop</span>
              <h2 className="text-5xl md:text-6xl font-display italic font-bold tracking-tighter leading-none">Take the <br /> Experience Home.</h2>
            </div>
            <MagneticButton>
              <Link to="/shop" className="px-10 py-5 border border-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Shop All Beans
              </Link>
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 mb-8 relative">
                  <img 
                    src="/coffee_beans.png" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <ArrowRight size={24} className="text-black" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Cottage Blend No. {i}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Medium Roast • 250g</p>
                <span className="text-xl font-bold">₹450</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Location */}
      <section className="py-32 bg-[#fafafa] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h2 className="text-5xl md:text-6xl font-display italic font-bold tracking-tighter mb-12">Visit Us</h2>
              <div className="space-y-12">
                <div className="flex gap-8">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Location</h4>
                    <p className="text-xl font-medium max-w-xs">ANAND NAGAR, NANDED, MAHARASTRA</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Hours</h4>
                    <p className="text-xl font-medium">8:00 AM – 11:30 PM <br /> <span className="text-gray-400">Open Everyday</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-berry/5 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative aspect-video rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps?q=Oven+Berries+Nanded&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
