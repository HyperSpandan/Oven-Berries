import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Search, Coffee, Pizza, Cake, Beer, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All", icon: null },
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "pizzeria", name: "Pizzeria", icon: Pizza },
  { id: "bakery", name: "Bakery", icon: Cake },
  { id: "beverages", name: "Beverages", icon: Beer },
];

const MOCK_MENU = [
  { id: 1, name: "Classic Espresso", price: 180, category: "coffee", description: "Rich and bold double shot espresso.", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "Margherita Pizza", price: 450, category: "pizzeria", description: "Wood-fired with fresh basil and mozzarella.", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "Almond Croissant", price: 220, category: "bakery", description: "Flaky pastry filled with almond cream.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500" },
  { id: 4, name: "Iced Caramel Latte", price: 280, category: "coffee", description: "Smooth espresso with caramel and cold milk.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=500" },
  { id: 5, name: "Pepperoni Feast", price: 550, category: "pizzeria", description: "Loaded with spicy pepperoni and cheese.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500" },
  { id: 6, name: "Blueberry Muffin", price: 150, category: "bakery", description: "Soft muffin bursting with fresh berries.", image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?auto=format&fit=crop&q=80&w=500" },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <Helmet>
        <title>Menu | Oven Berries - Coffee, Pizza & Bakery</title>
        <meta name="description" content="Explore the Oven Berries menu. From speciality coffee and wood-fired pizzas to artisanal bakes and refreshing beverages." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-8"
          >
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-6 block">Our Menu</span>
              <h1 className="text-5xl md:text-8xl font-display italic font-bold tracking-tighter leading-none text-berry">
                Curated <br /> <span className="text-berry/30">Flavors.</span>
              </h1>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-berry/40" size={18} />
              <input
                type="text"
                placeholder="Search flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-berry transition-all shadow-sm"
              />
            </div>
          </motion.div>
        </header>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-20 overflow-x-auto pb-4 scrollbar-hide">
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
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] mb-8 bg-white shadow-lg border border-berry/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 glass px-6 py-3 rounded-full text-sm font-bold text-berry shadow-sm">
                    ₹{item.price}
                  </div>
                  <div className="absolute inset-0 bg-berry/0 group-hover:bg-berry/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                      <ArrowRight size={24} className="text-berry" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-3xl font-bold text-berry tracking-tighter">{item.name}</h3>
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
        </motion.div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-32">
            <p className="text-berry/40 text-xl font-display italic">No flavors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
