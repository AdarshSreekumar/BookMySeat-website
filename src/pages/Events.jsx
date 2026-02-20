import React, { useEffect, useState } from 'react';
import { getHomeEventsAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import serverURL from '../services/serverURL'; // This is your imported URL variable

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

    const handleBookingRedirect = (eventId) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            navigate(`/book-seats/${eventId}`);
        } else {
            sessionStorage.setItem("redirectURL", `/book-seats/${eventId}`);
            toast.info("Please login to continue booking");
            navigate("/login");
        }
    };

    return (
        <div className="p-10 bg-slate-950 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-8 italic uppercase tracking-tighter">
                Upcoming <span className="text-teal-400">Events</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {allApprovedEvents.map(event => (
                    <div key={event._id} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group hover:border-teal-400/30 transition-all duration-300 shadow-xl">
                        
                        <div className="h-48 w-full overflow-hidden bg-slate-800">
                            <img 
                                // CHANGED: replaced BASE_URL with serverURL
                                src={event.eventImg ? `${serverURL}/uploads/${event.eventImg}` : "https://via.placeholder.com/400x200?text=No+Image"} 
                                alt={event.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{event.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-slate-400">
                                <span className="text-xs font-bold uppercase tracking-widest text-teal-500">{event.auditorium}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 font-medium">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            
                            <button 
                                onClick={() => handleBookingRedirect(event._id)}
                                className="w-full mt-6 bg-teal-500 hover:bg-teal-400 text-slate-950 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-teal-500/10"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {allApprovedEvents.length === 0 && (
                <div className="text-center py-20 text-slate-600 font-bold uppercase tracking-widest">
                    No approved events found.
                </div>
            )}
        </div>
    );
};

export default Events;