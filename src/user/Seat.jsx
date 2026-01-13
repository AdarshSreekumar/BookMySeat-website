import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { getAllSeatsAPI, getEventSeatsAPI } from "../services/allAPI"; 
import { bookingContext } from "../ContextShare";
import { FaUserCircle, FaTag, FaSignOutAlt, FaChevronDown, FaHistory } from "react-icons/fa";

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-4">
    <div className={`w-5 h-5 rounded-md border ${color}`}></div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label}
    </span>
  </div>
);

const Seat = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [seats, setSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown State

  const { setBookingDetails } = useContext(bookingContext);

  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem("user"));
    if (loggedUser) setUser(loggedUser);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allSeatsResult = await getAllSeatsAPI(); 
      const occupiedResult = await getEventSeatsAPI(id); 

      if (allSeatsResult.status === 200) setSeats(allSeatsResult.data);
      if (occupiedResult.status === 200) setOccupiedSeats(occupiedResult.data); 
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load seat layout.");
    } finally {
      setLoading(false);
    }
  };

  const isSeatOccupied = (seatId) => occupiedSeats.includes(seatId);

  const handleSeatClick = (seat) => {
    if (isSeatOccupied(seat._id)) return;
    const isAlreadySelected = selectedSeats.find((s) => s._id === seat._id);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s._id !== seat._id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleConfirmBooking = () => {
    const token = sessionStorage.getItem("token");
    const sessionData = sessionStorage.getItem("user");
    if (!token || !sessionData) {
      toast.warning("Please login to proceed");
      navigate("/login");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.info("Please select at least one seat");
      return;
    }
    // const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const loggedUser = JSON.parse(sessionData);

    setBookingDetails({
      selectedSeats: selectedSeats,
      userEmail: loggedUser.email || loggedUser.username,
      eventId: id 
    });
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    navigate('/review', { 
      state: { selectedSeats, eventId: id, totalAmount: total } 
    });
  };

  const vipSeats = seats.filter(s => s.type === "VIP");
  const standardSeats = seats.filter(s => s.type === "Standard");
  const rowLabels = [...new Set(standardSeats.map(s => s.row))].sort();

  const baseSeatStyles = "w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all duration-300";
  const vipSeatStyles = "w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <nav className="sticky top-0 z-[100] px-4 md:px-12 py-5 flex justify-between items-center bg-[#020617] text-white border-b border-white/10 backdrop-blur-md">
        <div className="text-[18px] font-black tracking-widest flex items-center gap-2">
           <span className="text-teal-500 uppercase">Seat Selection</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/events" className="text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Change Event
          </Link>

          {user && (
            <div className="relative">
              {/* Dropdown Trigger */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-700 transition-all"
              >
                <div className="bg-teal-500/20 p-1.5 rounded-full">
                  <FaUserCircle className="text-xl text-teal-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                  {user.username}
                </span>
                <FaChevronDown className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Account</p>
                      <p className="text-xs font-bold truncate text-teal-400">{user.email || user.username}</p>
                    </div>
                    
                    <button 
                      onClick={() => navigate('/userprofile')}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-[11px] font-bold uppercase tracking-widest text-slate-300"
                    >
                      <FaHistory className="text-teal-500" /> My Bookings
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 transition-colors text-[11px] font-bold uppercase tracking-widest text-red-400 border-t border-white/5"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center bg-white rounded-t-[3.5rem] shadow-2xl relative z-20 pb-44 mt-10">
        <div className="w-full max-w-5xl relative mb-20 mt-12 px-10">
          <div className="h-2 bg-slate-200 rounded-full w-full shadow-inner"></div>
          <p className="text-center text-slate-400 text-[10px] font-black tracking-[1.5em] mt-4 uppercase">Screen / Stage</p>
        </div>

        {loading ? (
           <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
             <div className="text-teal-600 font-bold">Syncing Event Availability...</div>
           </div>
        ) : (
          <div className="w-full px-6 flex flex-col items-center gap-16">
            {/* VIP SECTION */}
            <section className="w-full max-w-4xl">
              <h2 className="text-center text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8">VIP Section</h2>
              <div className="flex gap-4 flex-wrap justify-center">
                {vipSeats.map((seat) => {
                  const occupied = isSeatOccupied(seat._id);
                  const selected = selectedSeats.find(s => s._id === seat._id);
                  return (
                    <div
                      key={seat._id}
                      onClick={() => handleSeatClick(seat)}
                      className={`${vipSeatStyles} cursor-pointer
                        ${occupied ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" :
                          selected ? "bg-green-500 text-white border-green-600 scale-110 shadow-lg" :
                          "bg-amber-50 border-amber-200 text-amber-700 hover:scale-110"
                        }`}
                    >
                      {seat.seatNumber}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STANDARD SECTION */}
            <section className="w-full max-w-5xl">
              <h2 className="text-center text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-8">Standard Section</h2>
              <div className="grid gap-3">
                {rowLabels.map((rowLabel) => (
                  <div key={rowLabel} className="flex gap-3 items-center justify-center">
                    <span className="w-6 text-slate-300 font-black text-[10px]">{rowLabel}</span>
                    <div className="flex gap-2">
                      {standardSeats.filter(s => s.row === rowLabel).map((seat) => {
                        const occupied = isSeatOccupied(seat._id);
                        const selected = selectedSeats.find(s => s._id === seat._id);
                        return (
                          <div
                            key={seat._id}
                            onClick={() => handleSeatClick(seat)}
                            className={`${baseSeatStyles} cursor-pointer
                              ${occupied ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" :
                                selected ? "bg-teal-500 text-white border-teal-600" :
                                "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600"
                              }`}
                          >
                            {seat.seatNumber.replace(rowLabel, "")}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-10 mt-20">
          <LegendItem color="bg-white border-slate-200" label="Available" />
          <LegendItem color="bg-teal-500" label="Selected" />
          <LegendItem color="bg-slate-100" label="Sold Out" />
        </div>
      </main>

      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-6 flex justify-around items-center border-t border-white/10 z-[200] animate-in slide-in-from-bottom-full duration-300">
          <div className="text-white">
            <span className="text-slate-400 text-[10px] block uppercase font-black">Booking Summary</span>
            <span className="text-xl font-bold">{selectedSeats.length} Seats • ₹{selectedSeats.reduce((t, s) => t + s.price, 0)}</span>
          </div>
          <button 
            onClick={handleConfirmBooking}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-10 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-teal-500/20"
          >
            Review & Pay
          </button>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
};

export default Seat;