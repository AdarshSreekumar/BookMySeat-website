import React, { useEffect, useState } from 'react';
import { getHomeEventsAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Events = () => {
    const [allApprovedEvents, setAllApprovedEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApprovedEvents();
    }, []);

    const fetchApprovedEvents = async () => {
        const result = await getHomeEventsAPI();
        if (result.status === 200) {
            setAllApprovedEvents(result.data);
        }
    };

    // --- UPDATED FLOW LOGIC ---
    const handleBookingRedirect = (eventId) => {
        const token = sessionStorage.getItem("token");

        if (token) {
            // If logged in, go straight to seats
            navigate(`/book-seats/${eventId}`);
        } else {
            // If not logged in:
            // 1. Save where the user WANTED to go
            sessionStorage.setItem("redirectURL", `/book-seats/${eventId}`);
            // 2. Show a message
            toast.info("Please login to continue booking");
            // 3. Send to login
            navigate("/login");
        }
    };

    return (
        <div className="p-10 bg-slate-950 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allApprovedEvents.map(event => (
                    <div key={event._id} className="bg-slate-900 border border-white/10 p-5 rounded-2xl">
                        <h3 className="text-xl font-bold text-teal-400">{event.name}</h3>
                        <p className="text-slate-400 mt-2">{event.auditorium}</p>
                        <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                        
                        <button 
                            // Changed navigate to handleBookingRedirect
                            onClick={() => handleBookingRedirect(event._id)}
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-bold transition-all text-white"
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;