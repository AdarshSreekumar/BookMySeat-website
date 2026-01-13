import React, { useEffect, useState } from 'react';
import { getAllUserAPI, deleteUserAPI, getAllBookingsAPI, deleteBookingAPI, approveEventAPI, getAllEventsAdminAPI } from '../services/allAPI';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]); 
    const [view, setView] = useState('users'); 

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };
        
        try {
            if (view === 'users') {
                const result = await getAllUserAPI(reqHeader);
                if (result.status === 200) setUsers(result.data);
            } else if (view === 'bookings') {
                const result = await getAllBookingsAPI(reqHeader);
                if (result.status === 200) {
                    // This will now handle the data including populated event names and seat numbers
                    setBookings(result.data);
                }
            } else if (view === 'events') {
                const result = await getAllEventsAdminAPI(reqHeader);
                if (result.status === 200) {
                    const sortedEvents = result.data.sort((a, b) => (a.status === 'pending' ? -1 : 1));
                    setEvents(sortedEvents);
                }
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to fetch data");
        }
    };

    const handleApproveEvent = async (id) => {
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };
        try {
            const result = await approveEventAPI(id, reqHeader);
            if (result.status === 200) {
                toast.success("Event Approved!");
                fetchData(); 
            }
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    const handleDeleteBooking = async (id) => {
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };
        if(window.confirm("Cancel this booking?")) {
            try {
                const result = await deleteBookingAPI(id, reqHeader);
                if(result.status === 200) {
                    toast.warning("Booking Cancelled");
                    fetchData();
                }
            } catch (err) {
                toast.error("Deletion failed");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10">
            <h1 className="text-4xl font-black mb-10 text-center uppercase italic">
                Admin <span className="text-teal-400">Panel</span>
            </h1>
            
            <div className="flex justify-center gap-4 mb-10">
                <button onClick={() => setView('users')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'users' ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : 'bg-slate-800 text-slate-400'}`}>Users</button>
                <button onClick={() => setView('bookings')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'bookings' ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : 'bg-slate-800 text-slate-400'}`}>Bookings</button>
                <button onClick={() => setView('events')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'events' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-400'}`}>Approvals</button>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                
                {/* BOOKINGS VIEW - THE UPDATED SECTION */}
                {view === 'bookings' && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 uppercase text-xs border-b border-white/10">
                                <th className="pb-4">User</th>
                                <th className="pb-4">Event Name</th>
                                <th className="pb-4">Seat Numbers</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b._id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 text-sm">{b.userId?.email || "Guest"}</td>
                                    
                                    {/* 1. Show Event Name */}
                                    <td className="font-bold text-indigo-300">
                                        {b.eventId?.name || "Deleted Event"}
                                    </td>
                                    
                                    {/* 2. Show Seat Numbers (A1, B2, etc.) */}
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {b.seats && b.seats.length > 0 ? (
                                                b.seats.map((s, index) => (
                                                    <span key={index} className="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-500/20">
                                                        {s.seatNumber || s.name || s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-600 italic text-xs">No seats</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="text-teal-400 font-black">₹{b.totalAmount}</td>
                                    <td className="text-right">
                                        <button onClick={() => handleDeleteBooking(b._id)} className="text-red-400 text-xs font-bold hover:bg-red-500/10 px-3 py-1 rounded-lg transition-all">Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* USERS VIEW */}
                {view === 'users' && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 uppercase text-xs border-b border-white/10">
                                <th className="pb-4">Username</th>
                                <th className="pb-4">Email</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 font-bold">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td className="text-right">
                                        <button onClick={() => deleteUserAPI(u._id)} className="text-red-500 font-bold hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* EVENTS VIEW */}
                {view === 'events' && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 uppercase text-xs border-b border-white/10">
                                <th className="pb-4">Event Name</th>
                                <th className="pb-4">Auditorium</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(ev => (
                                <tr key={ev._id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 font-bold text-indigo-300">{ev.name}</td>
                                    <td className="text-slate-400">{ev.auditorium}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ev.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {ev.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        {ev.status === 'pending' ? (
                                            <button onClick={() => handleApproveEvent(ev._id)} className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-1 rounded-lg text-xs font-black transition-all">Approve</button>
                                        ) : (
                                            <span className="text-slate-600 text-xs italic">Live</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;