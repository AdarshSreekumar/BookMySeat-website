import React, { useState, useEffect } from 'react';
import { FaPlus, FaClock, FaCheckCircle, FaCalendarAlt, FaArrowLeft, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { addEventAPI, getCoordinatorEventsAPI } from '../services/allAPI';
import { toast } from 'react-toastify';

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false); // Changed from showModal to showForm
  const [newEvent, setNewEvent] = useState({
    name: '', date: '', time: '', auditorium: '' 
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, date, time, auditorium } = newEvent;

    if (!name || !date || !time || !auditorium) {
      toast.info("Please fill the form completely");
      return;
    }

    const token = sessionStorage.getItem("token");
    const reqHeader = { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    };

    const result = await addEventAPI(newEvent, reqHeader);
    if (result.status === 200) {
      toast.success("Event submitted for Admin approval!");
      setShowForm(false); // Close form view
      setNewEvent({ name: '', date: '', time: '', auditorium: '' }); 
      fetchMyEvents(); 
    } else {
      toast.error("Failed to submit event");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-8 font-sans transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* LANDING VIEW: Only shows when showForm is false */}
        {!showForm ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Coordinator <span className="text-indigo-500">Panel</span></h1>
                <p className="text-slate-400 text-sm">Submit and manage your event proposals</p>
              </div>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                <FaPlus /> New Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard icon={<FaClock className="text-yellow-400"/>} label="Pending Approval" count={events.filter(e => e.status === 'pending').length} />
              <StatCard icon={<FaCheckCircle className="text-green-400"/>} label="Live Events" count={events.filter(e => e.status === 'approved').length} />
              <StatCard icon={<FaCalendarAlt className="text-indigo-400"/>} label="Total Submitted" count={events.length} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Auditorium</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.length > 0 ? events.map((ev) => (
                    <tr key={ev._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-6 font-bold">{ev.name}</td>
                      <td className="px-6 py-6 text-slate-400">{ev.auditorium}</td>
                      <td className="px-6 py-6 text-sm">
                        <div>{new Date(ev.date).toLocaleDateString()}</div>
                        <div className="text-indigo-400 font-mono text-xs">{ev.time}</div>
                      </td>
                      <td className="px-6 py-6">
                        <StatusBadge status={ev.status} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan="4" className="text-center py-10 text-slate-500 font-bold">No events submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          /* NEW DESIGN: Propose Event Form View */
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-500">
            <button 
              onClick={() => setShowForm(false)}
              className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full"></div>
              
              <h2 className="text-2xl font-black uppercase mb-8">Propose <span className="text-indigo-500">Event</span></h2>

              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Event Title</label>
                  <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-2xl focus-within:border-indigo-500 transition-all">
                    <FaTag className="ml-4 text-slate-500" />
                    <input 
                      type="text" placeholder="e.g. Workshop" value={newEvent.name}
                      className="w-full bg-transparent p-4 text-white focus:outline-none"
                      onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Auditorium</label>
                  <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-2xl focus-within:border-indigo-500 transition-all">
                    <FaMapMarkerAlt className="ml-4 text-slate-500" />
                    <input 
                      type="text" placeholder="e.g. Hall B" value={newEvent.auditorium}
                      className="w-full bg-transparent p-4 text-white focus:outline-none"
                      onChange={e => setNewEvent({...newEvent, auditorium: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                    <input 
                      type="date" value={newEvent.date}
                      className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Time</label>
                    <input 
                      type="time" value={newEvent.time}
                      className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  <FaPlus /> Submit Proposal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ icon, label, count }) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
      <span className="text-3xl font-black">{count}</span>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default CoordinatorDashboard;