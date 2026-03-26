import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Calendar, Users, Clock, Phone, Mail, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Invalid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  guests: z.number().min(1).max(20),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [user] = useAuthState(auth);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 2,
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...data,
        status: "pending",
        userId: user?.uid || "anonymous",
        createdAt: new Date().toISOString(),
      });
      toast.success("Booking request sent! We'll confirm shortly.");
      reset();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <Helmet>
        <title>Book a Table | Oven Berries Nanded</title>
        <meta name="description" content="Reserve your spot at Oven Berries. Secure a table for an intimate date or group celebration in our aesthetic Nanded cafe." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry/40 mb-6 block">Reservations</span>
            <h1 className="text-5xl md:text-8xl font-display italic font-bold tracking-tighter leading-[0.8] mb-12 text-berry">
              Secure <br /> <span className="text-berry/30">Your Spot.</span>
            </h1>
            <p className="text-xl text-sage font-medium leading-relaxed mb-16 max-w-md">
              From intimate dates to group celebrations, we've curated the perfect aesthetic for your next memory.
            </p>

            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shrink-0 shadow-xl border border-berry/5">
                  <Clock size={24} className="text-berry" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Availability</h4>
                  <p className="text-xl font-medium text-berry">8:00 AM – 11:30 PM <br /> <span className="text-berry/40">Open Everyday</span></p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shrink-0 shadow-xl border border-berry/5">
                  <Phone size={24} className="text-berry" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-berry/40 mb-2">Concierge</h4>
                  <p className="text-xl font-medium text-berry">+91 9890603946</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl shadow-berry/5 border border-berry/5"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      {...register("customerName")}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.customerName && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.customerName.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      {...register("customerEmail")}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.customerEmail && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.customerEmail.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      {...register("customerPhone")}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                      placeholder="+91 9890603946"
                    />
                  </div>
                  {errors.customerPhone && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.customerPhone.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      type="number"
                      {...register("guests", { valueAsNumber: true })}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                    />
                  </div>
                  {errors.guests && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.guests.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      type="date"
                      {...register("date")}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.date.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-berry/40 uppercase tracking-widest ml-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-berry/20" size={18} />
                    <input
                      type="time"
                      {...register("time")}
                      className="w-full pl-14 pr-6 py-5 bg-cream/30 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-berry transition-all"
                    />
                  </div>
                  {errors.time && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.time.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-berry text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] hover:bg-berry-light transition-all disabled:opacity-50 flex items-center justify-center gap-3 group shadow-2xl shadow-berry/20"
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    Confirm Reservation <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
