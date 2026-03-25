import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Navigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Users, CheckCircle, XCircle, Trash2, Package, ShoppingBag, ChevronRight } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { toast } from "sonner";

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

export default function Admin() {
  const { isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[]);
    });

    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeOrders();
    };
  }, [isAdmin]);

  if (loading) return (
    <div className="pt-40 flex items-center justify-center min-h-screen bg-cream">
      <div className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-berry/40 animate-pulse">
        Verifying Admin Access...
      </div>
    </div>
  );

  if (!isAdmin) return <Navigate to="/" />;

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      toast.success(`Booking ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      toast.success(`Order ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast.success("Booking deleted");
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-3 block">Management</span>
            <h1 className="text-5xl md:text-6xl font-display italic font-bold text-berry tracking-tighter">Admin <br /> <span className="text-berry/30">Dashboard.</span></h1>
          </div>
          
          <div className="flex p-2 bg-white rounded-[2rem] shadow-xl border border-berry/5">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "bookings" ? "bg-berry text-white" : "text-berry/40 hover:bg-cream"}`}
            >
              Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-berry text-white" : "text-berry/40 hover:bg-cream"}`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "bookings" ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6"
            >
              {bookings.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[4rem] border border-berry/5">
                  <Calendar size={40} className="mx-auto text-berry/10 mb-6" />
                  <p className="text-sage font-medium">No bookings found.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-berry/5 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Customer</p>
                        <p className="font-bold text-berry">{booking.customerName}</p>
                        <p className="text-xs text-sage">{booking.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Schedule</p>
                        <p className="font-bold text-berry">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="text-xs text-sage">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Guests</p>
                        <div className="flex items-center gap-2 font-bold text-berry">
                          <Users size={14} /> {booking.guests}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Status</p>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600' :
                          booking.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-6 md:pt-0 border-berry/5">
                      <button 
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        className="p-4 bg-green-500/10 text-green-600 rounded-2xl hover:bg-green-500 hover:text-white transition-all"
                        title="Confirm"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                        className="p-4 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                        title="Cancel"
                      >
                        <XCircle size={20} />
                      </button>
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-4 bg-berry/5 text-berry/40 rounded-2xl hover:bg-berry hover:text-white transition-all"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6"
            >
              {orders.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[4rem] border border-berry/5">
                  <ShoppingBag size={40} className="mx-auto text-berry/10 mb-6" />
                  <p className="text-sage font-medium">No orders found.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-berry/5">
                    <div className="flex flex-col md:flex-row md:items-center gap-10 mb-8 pb-8 border-b border-berry/5">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Order ID</p>
                          <p className="font-bold text-berry">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-sage">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Customer</p>
                          <p className="font-bold text-berry">{order.customerName}</p>
                          <p className="text-xs text-sage">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-500/10 text-green-600' :
                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {["processing", "shipped", "delivered", "cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status as any)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                              order.status === status ? 'bg-berry text-white' : 'bg-cream text-berry/40 hover:bg-berry/5'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-berry/40">Items</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-berry font-medium">{item.name} <span className="text-sage">x{item.quantity}</span></span>
                          <span className="font-bold text-berry">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t border-berry/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-berry">Total Amount</span>
                        <span className="text-2xl font-display italic font-bold text-berry">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
