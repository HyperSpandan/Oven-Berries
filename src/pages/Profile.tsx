import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Users, ChevronRight, LogOut, User as UserIcon, ShoppingBag, Package } from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  userId: string;
  createdAt: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      setBookings(bookingsData);
      setBookingsLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setBookingsLoading(false);
    });

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
      setOrdersLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setOrdersLoading(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeOrders();
    };
  }, [user]);

  if (loading) return (
    <div className="pt-40 flex items-center justify-center min-h-screen bg-cream">
      <div className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-berry/40 animate-pulse">
        Initializing Session...
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered": return "bg-green-500/10 text-green-600";
      case "cancelled": return "bg-red-500/10 text-red-600";
      case "shipped":
      case "processing": return "bg-blue-500/10 text-blue-600";
      default: return "bg-amber-500/10 text-amber-600";
    }
  };

  return (
    <div className="pt-40 pb-24 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl shadow-berry/5 border border-berry/5"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-berry/10 rounded-full blur-2xl group-hover:bg-berry/20 transition-all duration-500" />
              <img
                src={user.photoURL || ""}
                alt={user.displayName || ""}
                className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-3 block">Member Profile</span>
              <h2 className="text-5xl md:text-6xl font-display italic font-bold text-berry tracking-tighter mb-4">
                {user.displayName}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sage text-sm font-medium">
                <span className="flex items-center gap-2">
                  <UserIcon size={14} className="text-berry/30" />
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="group flex items-center gap-3 px-8 py-4 bg-cream text-berry/60 rounded-2xl font-bold uppercase tracking-widest hover:bg-berry hover:text-white transition-all text-[10px] shadow-sm"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-12 p-2 bg-cream/50 rounded-[2rem] w-fit">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "bookings" ? "bg-berry text-white" : "text-berry/40 hover:bg-white"}`}
            >
              Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-berry text-white" : "text-berry/40 hover:bg-white"}`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {/* Content Section */}
          <div className="space-y-10">
            <AnimatePresence mode="wait">
              {activeTab === "bookings" ? (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-display italic font-bold text-berry tracking-tight">Your Reservations</h3>
                      <p className="text-sage text-sm mt-1">Manage your upcoming and past visits.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {bookingsLoading ? (
                      <div className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-berry/10 border-t-berry rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40">Loading Bookings...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="py-20 text-center bg-cream/30 rounded-[3rem] border border-dashed border-berry/10">
                        <Calendar size={40} className="mx-auto text-berry/10 mb-6" />
                        <p className="text-sage font-medium mb-8">You haven't made any reservations yet.</p>
                        <a href="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-berry text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-berry-light transition-all">
                          Book a Table <ChevronRight size={14} />
                        </a>
                      </div>
                    ) : (
                      bookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative bg-cream/30 hover:bg-white hover:shadow-xl hover:shadow-berry/5 transition-all duration-500 rounded-[2.5rem] p-8 border border-berry/5 flex flex-col md:flex-row md:items-center gap-8"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                <Calendar size={18} className="text-berry" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Date</p>
                                <p className="font-bold text-berry">{new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                <Clock size={18} className="text-berry" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Time</p>
                                <p className="font-bold text-berry">{booking.time}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                <Users size={18} className="text-berry" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Guests</p>
                                <p className="font-bold text-berry">{booking.guests} People</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-6 md:pt-0 border-berry/5">
                            <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-display italic font-bold text-berry tracking-tight">Your Orders</h3>
                      <p className="text-sage text-sm mt-1">Track your coffee bean purchases.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {ordersLoading ? (
                      <div className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-berry/10 border-t-berry rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40">Loading Orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-20 text-center bg-cream/30 rounded-[3rem] border border-dashed border-berry/10">
                        <ShoppingBag size={40} className="mx-auto text-berry/10 mb-6" />
                        <p className="text-sage font-medium mb-8">You haven't placed any orders yet.</p>
                        <a href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-berry text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-berry-light transition-all">
                          Browse Shop <ChevronRight size={14} />
                        </a>
                      </div>
                    ) : (
                      orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative bg-cream/30 hover:bg-white hover:shadow-xl hover:shadow-berry/5 transition-all duration-500 rounded-[2.5rem] p-8 border border-berry/5"
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6 pb-6 border-b border-berry/5">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                  <Package size={18} className="text-berry" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Order ID</p>
                                  <p className="font-bold text-berry">#{order.id.slice(-6).toUpperCase()}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                  <Calendar size={18} className="text-berry" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Date</p>
                                  <p className="font-bold text-berry">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-berry/5">
                                  <ShoppingBag size={18} className="text-berry" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-1">Total</p>
                                  <p className="font-bold text-berry">₹{order.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                            <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest self-start md:self-center ${getStatusColor(order.status)}`}>
                              {order.status}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {order.items.map((item, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-white rounded-xl text-berry/60 border border-berry/5">
                                {item.name} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
