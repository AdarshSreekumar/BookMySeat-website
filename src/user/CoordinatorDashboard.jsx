import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaClock, FaCheckCircle, FaCalendarAlt, FaArrowLeft, 
  FaTag, FaMapMarkerAlt, FaUserCircle, FaChevronDown, FaSignOutAlt,
  FaInfoCircle, FaEnvelope, FaIdCard, FaThLarge, FaUpload, FaTicketAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { addEventAPI, getCoordinatorEventsAPI, getAllBookingsAPI } from '../services/allAPI'; 
import { toast, ToastContainer } from 'react-toastify';
import serverURL from '../services/serverURL';

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]); // New state for bookings
  const [showForm, setShowForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setView] = useState('dashboard'); 
  const [preview, setPreview] = useState(""); 
  
  const [newEvent, setNewEvent] = useState({
    name: '', date: '', time: '', auditorium: '', eventImg: "" 
  });

  const navigate = useNavigate();
  const loggedUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (newEvent.eventImg) {
      setPreview(URL.createObjectURL(newEvent.eventImg));
    }
  }, [newEvent.eventImg]);

  useEffect(() => {
    fetchMyEvents();
    if (view === 'bookings') {
      fetchBookings();
    }
  }, [view]);

  const fetchMyEvents = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      const result = await getCoordinatorEventsAPI(reqHeader);
      if (result.status === 200) {
        setEvents(result.data);
      }
    }
  };

  // New function to fetch all customer bookings
  const fetchBookings = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      try {
        const result = await getAllBookingsAPI(reqHeader);
        if (result.status === 200) {
          setBookings(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, date, time, auditorium, eventImg } = newEvent;

    if (!name || !date || !time || !auditorium || !eventImg) {
      toast.info("Please fill the form completely and upload a poster");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("name", name);
    reqBody.append("date", date);
    reqBody.append("time", time);
    reqBody.append("auditorium", auditorium);
    reqBody.append("eventImg", eventImg);

    const token = sessionStorage.getItem("token");
    const reqHeader = { 
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}` 
    };

    const result = await addEventAPI(reqBody, reqHeader);
    if (result.status === 200) {
      toast.success("Event submitted for Admin approval!");
      setShowForm(false);
      setNewEvent({ name: '', date: '', time: '', auditorium: '', eventImg: "" }); 
      setPreview("");
      fetchMyEvents(); 
    } else {
      toast.error("Failed to submit event");
    }
  };

  // --- RENDERING FUNCTIONS ---

  const renderBookings = () => (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase italic">Customer <span className="text-teal-400">Bookings</span></h2>
        <div className="bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-teal-400 tracking-widest">
           {/* Total Revenue: ₹{bookings.reduce((acc, curr) => acc + curr.totalAmount, 0)} */}
        </div>
      </div>

      <div className="bg-[#0f172a]/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase font-black text-slate-500">
            <tr>
              <th className="px-8 py-5">Customer Email</th>
              <th className="px-8 py-5">Seats</th>
              <th className="px-8 py-5">Amount Paid</th>
              <th className="px-8 py-5">Booking Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.length > 0 ? bookings.map((book) => (
              <tr key={book._id} className="hover:bg-white/5 transition-all">
                <td className="px-8 py-6 font-bold text-slate-200">{book.userEmail}</td>
                <td className="px-8 py-6">
                  <div className="flex gap-1 flex-wrap">
                    {book.seats?.map(s => (
                      <span key={s.seatNumber} className="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-[10px] font-black border border-teal-500/20">
                        {s.seatNumber}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 font-black text-teal-400">₹{book.totalAmount}</td>
                <td className="px-8 py-6 text-xs text-slate-500">
                  {new Date(book.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center py-20 text-slate-600 font-black uppercase text-xs">No bookings recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h2 className="text-3xl font-black uppercase italic mb-8">My <span className="text-teal-400">Profile</span></h2>
      <div className="bg-[#0f172a]/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center border-2 border-teal-400/50">
                {/* <FaUserCircle className="text-6xl text-teal-400" /> */}
            </div>
            <div className="text-center w-full space-y-4">
                <ProfileItem label="Username" value={loggedUser?.username} />
                <ProfileItem label="Email" value={loggedUser?.email || "N/A"} />
                <ProfileItem label="Access" value="Coordinator" />
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-teal-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#020617] hidden md:flex flex-col sticky top-0 h-screen p-6">
        <div className="text-[18px] font-black tracking-widest flex items-center gap-2 mb-12 px-4 italic uppercase">
          <span className="text-teal-400">Coord</span> Panel
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarLink label="Dashboard" active={view === 'dashboard'} onClick={() => {setView('dashboard'); setShowForm(false);}} />
          <SidebarLink  label="All Bookings" active={view === 'bookings'} onClick={() => {setView('bookings'); setShowForm(false);}} />
          <SidebarLink label="My Profile" active={view === 'profile'} onClick={() => {setView('profile'); setShowForm(false);}} />
          <div className="my-6 border-t border-white/5 pt-6">
            <SidebarLink label="About" active={view === 'about'} onClick={() => {setView('about'); setShowForm(false);}} />
            <SidebarLink  label="Contact" active={view === 'contact'} onClick={() => {setView('contact'); setShowForm(false);}} />
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full font-bold text-xs uppercase tracking-widest group">
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-5 flex justify-end items-center bg-[#020617]/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-slate-800/40 p-1.5 pr-4 rounded-full border border-white/5 hover:bg-slate-800 transition-all">
                <div className=" p-1.5 rounded-full"></div>
                <span className="text-xs font-bold uppercase tracking-widest">{loggedUser?.username}</span>
                <FaChevronDown className={`text-[10px] ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl py-2 z-[200]">
                  <button onClick={() => {setView('profile'); setIsDropdownOpen(false);}} className="w-full text-left px-5 py-3 text-slate-300 text-[11px] font-black uppercase hover:bg-white/5">Profile</button>
                  <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-red-400 text-[11px] font-black uppercase hover:bg-red-500/10 border-t border-white/5">Logout</button>
                </div>
              )}
            </div>
        </header>

        <main className="p-8 md:p-12 overflow-y-auto">
          {view === 'dashboard' && (
            !showForm ? (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your event lifecycle</p>
                  </div>
                  <button onClick={() => setShowForm(true)} className="bg-teal-500 hover:bg-teal-400 text-[#020617] px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
                    <FaPlus /> New Event
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <StatCard icon={<FaClock />} label="Pending Approval" count={events.filter(e => e.status === 'pending').length} />
                  <StatCard icon={<FaCheckCircle />} label="Live Events" count={events.filter(e => e.status === 'approved').length} />
                  <StatCard icon={<FaCalendarAlt />} label="Total Submitted" count={events.length} />
                </div>

                <div className="bg-[#0f172a]/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase font-black text-slate-500">
                      <tr>
                        <th className="px-8 py-5">Poster</th>
                        <th className="px-8 py-5">Event Name</th>
                        <th className="px-8 py-5">Auditorium</th>
                        <th className="px-8 py-5">Schedule</th>
                        <th className="px-8 py-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {events.length > 0 ? events.map((ev) => (
                        <tr key={ev._id} className="hover:bg-white/5 group">
                          <td className="px-8 py-4">
                            <img 
                              src={ev.eventImg ? `${serverURL}/uploads/${ev.eventImg}` : "https://via.placeholder.com/150"} 
                              alt="event" className="w-16 h-10 object-cover rounded-lg border border-white/10 shadow-lg"
                            />
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-200">{ev.name}</td>
                          <td className="px-8 py-6 text-slate-400">{ev.auditorium}</td>
                          <td className="px-8 py-6 text-sm">
                            <div className="font-medium text-slate-300">{new Date(ev.date).toLocaleDateString()}</div>
                            <div className="text-teal-400 text-xs mt-1">{ev.time}</div>
                          </td>
                          <td className="px-8 py-6"><StatusBadge status={ev.status} /></td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-center py-20 text-slate-600 font-black uppercase text-xs">No events found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-10">
                <button onClick={() => setShowForm(false)} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white font-bold uppercase text-xs">
                  <FaArrowLeft /> Back
                </button>
                <div className="bg-[#0f172a]/50 border border-white/10 p-10 rounded-[2.5rem]">
                  <h2 className="text-2xl font-black uppercase mb-8 italic">Propose <span className="text-teal-400">Event</span></h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center mb-4">
                      <label className="cursor-pointer group">
                        <input type="file" style={{ display: 'none' }} onChange={e => setNewEvent({...newEvent, eventImg: e.target.files[0]})} />
                        <div className="w-64 h-40 rounded-3xl border-2  border-white/10 bg-[#020617]/50 flex flex-col items-center justify-center overflow-hidden group-hover:border-teal-400/50 transition-all">
                          {preview ? (
                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <FaUpload className="mx-auto text-3xl text-slate-600 mb-2" />
                              <p className="text-[10px] font-black uppercase">Upload Poster</p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-1">Title</label>
                      <input type="text" placeholder="Event Name" value={newEvent.name} className="w-full bg-[#020617]/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none focus:border-teal-400" onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-1">Auditorium</label>
                      <input type="text" placeholder="Location" value={newEvent.auditorium} className="w-full bg-[#020617]/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none focus:border-teal-400" onChange={e => setNewEvent({...newEvent, auditorium: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <input type="date" value={newEvent.date} className="w-full bg-[#020617]/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none [color-scheme:dark]" onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                      <input type="time" value={newEvent.time} className="w-full bg-[#020617]/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none [color-scheme:dark]" onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                    </div>
                    <button type="submit" className="mt-4 bg-teal-500 hover:bg-teal-400 text-[#020617] py-4 rounded-2xl font-black uppercase shadow-xl shadow-teal-500/20 active:scale-95 transition-all">Submit Proposal</button>
                  </form>
                </div>
              </div>
            )
          )}

          {view === 'bookings' && renderBookings()}
          {view === 'profile' && renderProfile()}
        </main>
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest w-full ${active ? 'bg-teal-500 text-[#020617]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
        <span className="text-lg">{icon}</span> {label}
    </button>
);

const StatCard = ({ icon, label, count }) => (
  <div className="bg-[#0f172a]/50 p-6 rounded-[2rem] border border-white/10 hover:bg-white/5 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-3xl font-black tracking-tighter italic">{count}</span>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

const ProfileItem = ({ label, value }) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center mb-2 w-full">
        <span className="text-[9px] font-black text-slate-500 uppercase">{label}</span>
        <span className="text-sm font-bold text-teal-400">{value}</span>
    </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: " text-yellow-500 yellow-500/20",
    approved: " text-green-500  green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default CoordinatorDashboard;