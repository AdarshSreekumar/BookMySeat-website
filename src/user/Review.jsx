import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingContext } from '../ContextShare';
import { bookSeatsAPI } from '../services/allAPI'; 
import { ToastContainer, toast } from 'react-toastify';

const Review = () => {
    const { bookingDetails } = useContext(bookingContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Destructure data from Context
    const { selectedSeats, userEmail } = bookingDetails;

    const eventId = location.state?.eventId || selectedSeats?.[0]?.eventId;
    const totalAmount = location.state?.totalAmount || selectedSeats?.reduce((total, seat) => total + seat.price, 0);
    const totalPriceDisplay = selectedSeats?.reduce((total, seat) => total + seat.price, 0);

    const handleFinalPayment = async () => {
    const token = sessionStorage.getItem("token");

    // 1. DATA goes here (The Body)
    const bookingData = {
        eventId: eventId,
        seats: selectedSeats, 
        totalAmount: totalAmount
    };

    // 2. HEADERS go here (Only Token and Type)
    const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
        // REMOVE eventId from here if it's currently here!
    };

    setLoading(true);
    try {
        const result = await bookSeatsAPI(bookingData, reqHeader);
        
        // Use optional chaining (?.) to prevent the "Cannot read properties of undefined" error
        if (result?.status === 200 || result?.status === 201) {
            toast.success("Booking Confirmed!");
            navigate('/userprofile');
        } else {
            const errorMessage = result?.data || "Unauthorized";
            toast.error(`Error: ${errorMessage}`);
        }
    } catch (err) {
        console.error("Connection Error:", err);
    } finally {
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
        <div className="min-h-screen bg-slate-950 py-20 px-6">
            <div className="max-w-xl mx-auto bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white italic uppercase">Review <span className="text-slate-500">Booking</span></h1>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-2xl">
                    <h3 className="text-white text-lg font-bold">{userEmail || "User Account"}</h3>
                </div>

                <div className="space-y-4 mb-10">
                    {selectedSeats.map((seat) => (
                        <div key={seat._id} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl">
                            <p className="text-white font-bold">{seat.seatNumber}</p>
                            <p className="text-teal-400 font-black">₹{seat.price}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-end mb-10">
                    <p className="text-4xl font-black text-white">₹{totalPriceDisplay}</p>
                </div>

                <button onClick={handleFinalPayment} disabled={loading} className="w-full p-5 rounded-2xl bg-teal-500 text-black font-black uppercase tracking-widest hover:bg-teal-400 disabled:bg-slate-700">
                    {loading ? "Processing..." : "Pay & Confirm"}
                </button>
            </div>
            <ToastContainer position="top-center" autoClose={2000} theme="colored" />
        </div>
    );
};

export default Review;