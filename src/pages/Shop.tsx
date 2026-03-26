import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Star, ChevronRight, X, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PRODUCTS = [
  { id: "1", name: "Cottage Dark Roast", price: 480, weight: "250g", origin: "Chikmagalur", roast: "Dark", description: "Bold notes of dark chocolate and roasted nuts.", image: "/coffee_beans.png" },
  { id: "2", name: "Berry Blend Medium", price: 520, weight: "250g", origin: "Coorg", roast: "Medium", description: "Fruity acidity with a smooth caramel finish.", image: "/coffee_beans.png" },
  { id: "3", name: "Morning Mist Light", price: 450, weight: "250g", origin: "Nilgiris", roast: "Light", description: "Floral aroma with bright citrus notes.", image: "/coffee_beans.png" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Shop() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: user.displayName || "Anonymous",
        customerEmail: user.email,
        items: cart,
        totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      toast.success("Order placed successfully!");
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <Helmet>
        <title>Shop Coffee Beans | Oven Berries Nanded</title>
        <meta name="description" content="Bring the Oven Berries experience home. Shop our curated selection of speciality coffee beans, from dark roasts to light blends." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-6 block">The Collection</span>
              <h1 className="text-6xl md:text-9xl font-display italic font-bold tracking-tighter leading-[0.8] text-berry">
                Take the <br /> <span className="text-berry/30">Roast</span> Home.
              </h1>
            </motion.div>
            <div className="flex flex-col gap-8">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sage max-w-sm text-xl leading-relaxed"
              >
                Ethically sourced, expertly roasted in small batches. Our beans bring the Oven Berries aesthetic to your kitchen.
              </motion.p>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-4 px-8 py-4 bg-berry text-white rounded-full font-bold text-[10px] uppercase tracking-widest self-start shadow-2xl shadow-berry/20"
              >
                <ShoppingBag size={16} /> View Cart ({cart.length})
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-oven text-white rounded-full flex items-center justify-center text-[10px]">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-white mb-10 shadow-2xl shadow-berry/5 border border-berry/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-berry/0 group-hover:bg-berry/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-white text-berry px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 shadow-2xl"
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-berry mb-2 tracking-tighter">{product.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-berry/40 uppercase tracking-widest">{product.origin}</span>
                    <div className="w-1 h-1 rounded-full bg-berry/10" />
                    <span className="text-[10px] font-bold text-berry/40 uppercase tracking-widest">{product.roast} Roast</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-berry tracking-tighter">₹{product.price}</span>
              </div>

              <p className="text-sage text-sm leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-berry/10">
                <span className="text-[10px] font-bold text-berry/40 uppercase tracking-widest">{product.weight}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className="fill-oven text-oven" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-berry">4.9</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-berry/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-4xl font-display italic font-bold text-berry tracking-tighter">Your Cart</h2>
                  <p className="text-sage text-sm uppercase tracking-widest font-bold mt-1">{cart.length} Items</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-4 bg-cream rounded-full text-berry/40 hover:text-berry transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <ShoppingBag size={40} className="mx-auto text-berry/10 mb-6" />
                    <p className="text-sage font-medium">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-berry mb-1">{item.name}</h4>
                        <p className="text-sage text-sm font-medium">₹{item.price} <span className="text-berry/20">×</span> {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xl font-bold text-berry">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-berry/20 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-12 border-t border-berry/5 mt-auto">
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40">Total Amount</span>
                    <span className="text-4xl font-display italic font-bold text-berry">₹{totalAmount}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-6 bg-berry text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] hover:bg-berry-light transition-all shadow-2xl shadow-berry/20 flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isCheckingOut ? "Processing..." : (
                      <>
                        Complete Order <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
