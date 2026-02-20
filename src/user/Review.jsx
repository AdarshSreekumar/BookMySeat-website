import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingContext } from '../ContextShare';
import { processPaymentAPI } from '../services/allAPI'; 
import { ToastContainer, toast } from 'react-toastify';
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaHistory, FaArrowLeft } from "react-icons/fa";

const Review = () => {
    const { bookingDetails } = useContext(bookingContext);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { selectedSeats, userEmail } = bookingDetails;
    const loggedUser = JSON.parse(sessionStorage.getItem("user"));

    const eventId = location.state?.eventId || selectedSeats?.[0]?.eventId;
    const eventName = location.state?.eventName || "Event Booking";
    const totalPriceDisplay = selectedSeats?.reduce((total, seat) => total + seat.price, 0);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
        toast.success("Logged out successfully");
    };

    const makePayment = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.warning("Please login to proceed with payment");
            return;
        }

        setLoading(true);

        // Data for the backend/Stripe
        const reqBody = {
            title: `${eventName} - Seats: ${selectedSeats.map(s => s.seatNumber).join(', ')}`,
            price: totalPriceDisplay,
            picture: "https://cdn-icons-png.flaticon.com/512/3114/3114770.png", 
            bookingDetails: {
                eventId,
                userId: loggedUser._id,
                seats: selectedSeats,
                totalAmount: totalPriceDisplay
            }
        };

        const reqHeader = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            // CRITICAL STEP: Store booking data locally before leaving the site
            // This allows the Success page to find this data later
            sessionStorage.setItem("pendingBooking", JSON.stringify(reqBody.bookingDetails));

            const result = await processPaymentAPI(reqBody, reqHeader);

            if (result.status === 200 && result.data.url) {
                toast.info("Redirecting to Secure Payment...");
                window.location.href = result.data.url;
            } else {
                toast.error("Failed to initialize payment session");
                setLoading(false);
            }
        } catch (err) {
            console.error("Payment Error:", err);
            toast.error("Something went wrong with the payment gateway");
            setLoading(false);
        }
    };

    if (!selectedSeats || selectedSeats.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
                <p className="text-slate-400 mb-6 text-lg">No seats found in your session.</p>
                <button onClick={() => navigate(-1)} className="bg-teal-500 text-black px-8 py-3 rounded-full font-bold">Go back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-slate-900">
            <nav className="sticky top-0 z-[100] px-4 md:px-12 py-5 flex justify-between items-center bg-[#020617] text-white border-b border-white/10 backdrop-blur-md">
                <div className="text-[18px] font-black tracking-widest flex items-center gap-2">
                    <span className="text-teal-500 uppercase">Review Order</span>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                        <FaArrowLeft /> Back
                    </button>
                    {loggedUser && (
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-700 transition-all">
                                <div className="bg-teal-500/20 p-1.5 rounded-full"><FaUserCircle className="text-xl text-teal-500" /></div>
                                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">{loggedUser.username}</span>
                                <FaChevronDown className={`text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                                        <button onClick={() => navigate('/userprofile')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-[11px] font-bold uppercase tracking-widest text-slate-300">
                                            <FaHistory className="text-teal-500" /> My Bookings
                                        </button>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 transition-colors text-[11px] font-bold uppercase tracking-widest text-red-400 border-t border-white/5">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <main className="py-20 px-6">
                <div className="max-w-xl mx-auto bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-white italic uppercase">Review <span className="text-slate-500">Booking</span></h1>
                    </div>
                    <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Billing Account</p>
                        <h3 className="text-white text-lg font-bold truncate">{userEmail || loggedUser?.email}</h3>
                    </div>
                    <div className="space-y-4 mb-10">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Selected Seats</p>
                        {selectedSeats.map((seat) => (
                            <div key={seat._id} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_#14b8a6]"></div>
                                    <p className="text-white font-bold">{seat.seatNumber} <span className="text-[10px] text-slate-500 ml-2 uppercase">({seat.type})</span></p>
                                </div>
                                <p className="text-teal-400 font-black">₹{seat.price}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-white/10 mb-10">
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Payable</p>
                            <p className="text-4xl font-black text-white">₹{totalPriceDisplay}</p>
                        </div>
                    </div>
                    <button 
                        onClick={makePayment} 
                        disabled={loading} 
                        className="w-full p-5 rounded-2xl bg-teal-500 text-black font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20"
                    >
                        {loading ? "Processing..." : "Pay & Confirm"}
                    </button>
                </div>
            </main>
            <ToastContainer position="top-center" autoClose={2000} theme="colored" />
        </div>
    );
};

export default Review;