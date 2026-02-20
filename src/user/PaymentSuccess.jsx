import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookSeatsAPI } from '../services/allAPI';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    
    // This ref prevents the API from being called twice in React Strict Mode
    const hasBooked = useRef(false);

    useEffect(() => {
        const finalizeBooking = async () => {
            // If already called, exit
            if (hasBooked.current) return;

            const sessionId = searchParams.get('session_id');
            const pendingData = JSON.parse(sessionStorage.getItem("pendingBooking"));
            const token = sessionStorage.getItem("token");

            // Only proceed if we have all necessary data
            if (sessionId && pendingData && token) {
                try {
                    hasBooked.current = true; // Mark as called immediately
                    
                    const reqHeader = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    };

                    // Add the stripe session ID to your booking data for record keeping
                    const finalBookingBody = { ...pendingData, stripeSessionId: sessionId };

                    const result = await bookSeatsAPI(finalBookingBody, reqHeader);

                    if (result.status === 200) {
                        setStatus('success');
                        toast.success("Payment Verified & Seat Reserved!");
                        
                        // Clear the pending data so refreshes don't re-trigger
                        sessionStorage.removeItem("pendingBooking");
                        
                        // Redirect after a short delay
                        setTimeout(() => navigate('/userprofile'), 3000);
                    } else {
                        throw new Error("Booking failed on server");
                    }
                } catch (error) {
                    console.error("Finalize Booking Error:", error);
                    setStatus('error');
                    hasBooked.current = false; // Allow retry if it actually failed
                    toast.error("Booking failed. Please contact support.");
                }
            } else {
                // If no data found, user might have refreshed an old success page
                setStatus('error');
            }
        };

        finalizeBooking();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-6">
            <div className="max-w-md w-full bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] text-center backdrop-blur-xl shadow-2xl">
                {status === 'processing' && (
                    <>
                        <div className="animate-spin h-14 w-14 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h2 className="text-2xl font-black uppercase italic">Verifying <span className="text-teal-500">Payment</span></h2>
                        <p className="text-slate-400 mt-4 text-sm tracking-widest">Please don't close this window while we secure your seats.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="h-20 w-20 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                            ✓
                        </div>
                        <h2 className="text-3xl font-black uppercase italic">Booking <span className="text-teal-500">Confirmed!</span></h2>
                        <p className="text-slate-400 mt-4 text-sm">Redirecting you to your profile...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="h-20 w-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✕
                        </div>
                        <h2 className="text-2xl font-black uppercase italic text-red-500">Something Went Wrong</h2>
                        <p className="text-slate-400 mt-4 text-sm">We couldn't verify your booking. If money was deducted, please contact support.</p>
                        <button onClick={() => navigate('/')} className="mt-8 text-teal-500 font-bold uppercase tracking-widest text-xs">Return Home</button>
                    </>
                )}
            </div>
        </div>
    );
};

// This fixes the 'does not provide an export named default' error
export default PaymentSuccess;