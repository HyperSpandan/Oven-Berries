import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Search, Coffee, Pizza, Cake, Beer, ArrowRight, Star } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All", icon: null },
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "pizzeria", name: "Pizzeria", icon: Pizza },
  { id: "bakery", name: "Bakery", icon: Cake },
  { id: "beverages", name: "Beverages", icon: Beer },
];

const MOCK_MENU = [
  { id: 1, name: "Classic Espresso", price: 180, category: "coffee", description: "Rich and bold double shot espresso.", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Margherita Pizza", price: 450, category: "pizzeria", description: "Wood-fired with fresh basil and mozzarella.", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Almond Croissant", price: 220, category: "bakery", description: "Flaky pastry filled with almond cream.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Iced Caramel Latte", price: 280, category: "coffee", description: "Smooth espresso with caramel and cold milk.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Pepperoni Feast", price: 550, category: "pizzeria", description: "Loaded with spicy pepperoni and cheese.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Blueberry Muffin", price: 150, category: "bakery", description: "Soft muffin bursting with fresh berries.", image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?auto=format&fit=crop&q=80&w=400" },
];

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <div className={`relative overflow-hidden block ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const FloatingElement = ({ emoji, delay = 0, x = "0%", y = "0%", speed = 1 }: { emoji: string; delay?: number; x?: string; y?: string; speed?: number }) => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);

  return (
    <motion.div
      style={{ left: x, top: y, y: yParallax }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.15,
        scale: 1,
        rotate: [0, 10, -10, 0]
      }}
      transition={{ 
        opacity: { duration: 2, delay },
        scale: { duration: 1, delay },
        rotate: { duration: 10, repeat: Infinity, ease: "linear" }
      }}
      className="absolute text-6xl pointer-events-none z-0 select-none filter blur-[1px]"
    >
      {emoji}
    </motion.div>
  );
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream relative overflow-hidden">
      <Helmet>
        <title>Menu | Oven Berries - Coffee, Pizza & Bakery</title>
        <meta name="description" content="Explore the Oven Berries menu. From speciality coffee and wood-fired pizzas to artisanal bakes and refreshing beverages." />
      </Helmet>

      {/* Floating Background Elements with Parallax */}
      <FloatingElement emoji="☕" x="5%" y="15%" speed={0.5} delay={0.2} />
      <FloatingElement emoji="🍕" x="85%" y="25%" speed={0.8} delay={0.4} />
      <FloatingElement emoji="🥐" x="15%" y="45%" speed={0.3} delay={0.6} />
      <FloatingElement emoji="🧁" x="75%" y="65%" speed={0.6} delay={0.8} />
      <FloatingElement emoji="🍩" x="10%" y="85%" speed={0.4} delay={1.0} />
      <FloatingElement emoji="🥤" x="90%" y="10%" speed={0.7} delay={1.2} />
      <FloatingElement emoji="🥨" x="45%" y="35%" speed={0.2} delay={1.4} />
      <FloatingElement emoji="🍪" x="65%" y="75%" speed={0.9} delay={1.6} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-xl">
              <Reveal delay={0.2}>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-6 block">Our Menu</span>
              </Reveal>
              <h1 className="text-5xl md:text-8xl font-display italic font-bold tracking-tighter leading-none text-berry">
                <Reveal delay={0.4}>Curated</Reveal>
                <Reveal delay={0.6} className="text-berry/30">Flavors.</Reveal>
              </h1>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative w-full md:w-80"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-berry/40" size={18} />
              <input
                type="text"
                placeholder="Search flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-berry transition-all shadow-sm"
              />
            </motion.div>
          </div>
        </header>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 mb-20 overflow-x-auto pb-4 scrollbar-hide"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-berry text-white shadow-xl shadow-berry/20"
                  : "bg-white text-berry/40 hover:bg-berry/5"
              }`}
            >
              {cat.icon && <cat.icon size={14} />}
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-1000">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ 
                  duration: 0.6, 
                  delay: (index % 3) * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: -2,
                  translateZ: 20
                }}
                className="group cursor-pointer preserve-3d"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] mb-8 bg-white shadow-lg border border-berry/5 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-berry/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 glass px-6 py-3 rounded-full text-sm font-bold text-berry shadow-sm flex items-center gap-2">
                    <Star size={12} className="fill-berry" />
                    ₹{item.price}
                  </div>
                  <div className="absolute inset-0 bg-berry/0 group-hover:bg-berry/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                      <ArrowRight size={24} className="text-berry" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-3xl font-bold text-berry tracking-tighter group-hover:text-berry-light transition-colors">{item.name}</h3>
                </div>
                <p className="text-sage text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 bg-berry/5 rounded-full text-[10px] font-bold text-berry/60 uppercase tracking-[0.2em]">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-32">
            <p className="text-berry/40 text-xl font-display italic">No flavors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
