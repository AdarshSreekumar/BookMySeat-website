import React, { useEffect, useState } from 'react';
import { 
    getAllUserAPI, deleteUserAPI, getAllBookingsAPI, 
    deleteBookingAPI, approveEventAPI, getAllEventsAdminAPI,
    deleteEventAPI // 1. IMPORT THE DELETE API
} from '../services/allAPI';
import { 
    FaUsers, FaTicketAlt, FaTrash, 
    FaUserCircle, FaChevronDown, FaSignOutAlt, FaShieldAlt, FaHistory, FaIdCard
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]); 
    const [view, setView] = useState('users'); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const navigate = useNavigate();
    const loggedUser = JSON.parse(sessionStorage.getItem("user"));

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
                if (result.status === 200) setBookings(result.data);
            } else if (view === 'events') {
                const result = await getAllEventsAdminAPI(reqHeader);
                if (result.status === 200) {
                    const sortedEvents = result.data.sort((a, b) => (a.status === 'pending' ? -1 : 1));
                    setEvents(sortedEvents);
                }
            }
        } catch (err) {
            toast.error("Failed to fetch data");
        }
    };

    // 2. ADD THE DELETE LOGIC
    const handleDeleteEvent = async (id) => {
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };
        
        if (window.confirm("Are you sure you want to permanently delete this event? This will also remove associated images.")) {
            try {
                const result = await deleteEventAPI(id, reqHeader);
                if (result.status === 200) {
                    toast.success("Event Deleted Successfully");
                    fetchData(); // Refresh list
                }
            } catch (err) {
                toast.error("Failed to delete event");
            }
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

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
        toast.success("Admin Logged Out");
    };

    const renderAdminProfile = () => (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h2 className="text-3xl font-black uppercase italic mb-8">Admin <span className="text-teal-400">Profile</span></h2>
            <div className="bg-[#0f172a]/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full"></div>
                <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center border-2 border-teal-500/50 relative z-10">
                        <FaShieldAlt className="text-5xl text-teal-400" />
                    </div>
                    <div className="text-center w-full space-y-4 mt-4 relative z-10">
                        <ProfileItem label="Admin Username" value={loggedUser?.username || "SuperAdmin"} />
                        <ProfileItem label="Recovery Email" value={loggedUser?.email} />
                        <ProfileItem label="System Status" value="Active / Master Access" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-teal-500/30">
            <aside className="w-64 border-r border-white/5 bg-[#020617] hidden md:flex flex-col sticky top-0 h-screen p-6">
                <div className="text-xl font-black tracking-widest flex items-center gap-2 mb-12 px-4 italic">
                    <span className="text-teal-400 uppercase">Admin</span>
                    <span className="uppercase tracking-tighter">Core</span>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    <SidebarLink  label="Manage Users" active={view === 'users'} onClick={() => setView('users')} />
                    <SidebarLink  label="All Bookings" active={view === 'bookings'} onClick={() => setView('bookings')} />
                    <SidebarLink  label="Event Approvals" active={view === 'events'} onClick={() => setView('events')} />
                    <div className="my-6 border-t border-white/5 pt-6">
                        <SidebarLink  label="Admin Profile" active={view === 'profile'} onClick={() => setView('profile')} />
                    </div>
                </nav>
                <div className="pt-6 border-t border-white/5 px-2">
                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full font-bold text-xs uppercase tracking-widest group">
                         Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="px-8 py-5 flex justify-end items-center bg-[#020617]/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                    <div className="relative">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-slate-800/40 p-1.5 pr-4 rounded-full border border-white/5 transition-all hover:bg-slate-800">
                            <div className="bg-teal-500/20 p-1.5 rounded-full"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">{loggedUser?.username || "Admin"}</span>
                            {/* <FaChevronDown className={`text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /> */}
                        </button>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className="absolute right-0 mt-3 w-60 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl py-2 z-[200] animate-in fade-in zoom-in duration-200">
                                    <button onClick={() => {setView('profile'); setIsDropdownOpen(false);}} className="w-full text-left px-5 py-3 hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest text-slate-300">View Profile</button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 text-[11px] font-bold uppercase tracking-widest text-red-400 transition-colors border-t border-white/5">
                                        <FaSignOutAlt /> Logout Admin
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <main className="p-8 md:p-12">
                    {view === 'profile' ? renderAdminProfile() : (
                        <>
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                                        {view} <span className="text-teal-400">Management</span>
                                    </h1>
                                    <p className="text-slate-500 text-sm font-medium">System records and administrative control</p>
                                </div>
                                
                            </div>

                            <div className="bg-[#0f172a]/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
                                            <tr>
                                                {view === 'users' && <><th className="px-8 py-5">Username</th><th className="px-8 py-5">Email Address</th><th className="px-8 py-5 text-right">Action</th></>}
                                                {view === 'bookings' && <><th className="px-8 py-5">User</th><th className="px-8 py-5">Event</th><th className="px-8 py-5">Seats</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5 text-right">Control</th></>}
                                                {view === 'events' && <><th className="px-8 py-5">Event Title</th><th className="px-8 py-5">Venue</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Authorization</th></>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {view === 'users' && users.map(u => (
                                                <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-8 py-6 font-bold text-slate-200">{u.username}</td>
                                                    <td className="px-8 py-6 text-slate-400 font-mono text-xs">{u.email}</td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button onClick={() => deleteUserAPI(u._id)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><FaTrash /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {view === 'bookings' && bookings.map(b => (
                                                <tr key={b._id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-8 py-6 text-xs text-slate-300 font-bold">{b.userId?.email || "Guest"}</td>
                                                    <td className="px-8 py-6 font-black text-teal-400 text-sm tracking-tight">{b.eventId?.name || "N/A"}</td>
                                                    <td className="px-8 py-6 flex flex-wrap gap-1">
                                                        {b.seats?.map((s, i) => <span key={i} className="bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-500/20">{s.seatNumber || s}</span>)}
                                                    </td>
                                                    <td className="px-8 py-6 font-black italic text-teal-500">₹{b.totalAmount}</td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button onClick={() => handleDeleteBooking(b._id)} className="text-[10px] font-black uppercase text-red-500/70 hover:text-red-500 hover:underline transition-all">Cancel Booking</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {view === 'events' && events.map(ev => (
                                                <tr key={ev._id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-8 py-6 font-bold text-indigo-300">{ev.name}</td>
                                                    <td className="px-8 py-6 text-slate-400 text-sm">{ev.auditorium}</td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase border ${ev.status === 'approved' ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>{ev.status}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right flex items-center justify-end gap-4">
                                                        {ev.status === 'pending' ? (
                                                            <button 
                                                                onClick={() => handleApproveEvent(ev._id)} 
                                                                className="bg-teal-500 hover:bg-teal-400 text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                                                            >
                                                                Approval
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] italic">Active Live</span>
                                                        )}
                                                        {/* 3. ADD DELETE BUTTON IN EVENT ROW */}
                                                        <button 
                                                            onClick={() => handleDeleteEvent(ev._id)} 
                                                            className="p-2 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
            <ToastContainer position="top-center" autoClose={2000} theme="colored" />
        </div>
    );
};

// --- Sub-components ---
const SidebarLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest group ${active ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
        <span className={`text-lg transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span> {label}
    </button>
);

const ProfileItem = ({ label, value }) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center mb-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-teal-400 tracking-tight">{value}</span>
    </div>
);

export default AdminDashboard;