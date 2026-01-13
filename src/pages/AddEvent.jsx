import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addEventAPI } from '../services/allAPI';

const AddEvent = ({ onEventAdded }) => {
    const [show, setShow] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        name: "", auditorium: "", date: "", time: ""
    });

    const handleClose = () => {
        setShow(false);
        setEventDetails({ name: "", auditorium: "", date: "", time: "" });
    };
    const handleShow = () => setShow(true);

    const handleAdd = async () => {
        const { name, auditorium, date, time } = eventDetails;

        if (!name || !auditorium || !date || !time) {
            toast.warning("Please fill the form completely!");
        } else {
            const token = sessionStorage.getItem("token");
            if (token) {
                const reqHeader = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };

                try {
                    const result = await addEventAPI(eventDetails, reqHeader);
                    if (result.status === 200) {
                        toast.success(`${result.data.name} submitted for approval!`);
                        handleClose();
                        // Trigger refresh in the parent dashboard
                        onEventAdded();
                    } else {
                        toast.error(result.response.data);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    return (
        <>
            <button onClick={handleShow} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
                + New Event Proposal
            </button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="bg-slate-900 border-white/10 text-white">
                    <Modal.Title className="font-black">SUBMIT NEW EVENT</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-slate-900 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-3">
                            <label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Event Name</label>
                            <input type="text" value={eventDetails.name} onChange={e => setEventDetails({ ...eventDetails, name: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-teal-500" placeholder="e.g. Inception Screening" />
                        </div>
                        <div className="mb-3">
                            <label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Auditorium</label>
                            <input type="text" value={eventDetails.auditorium} onChange={e => setEventDetails({ ...eventDetails, auditorium: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-teal-500" placeholder="e.g. Hall A" />
                        </div>
                        <div className="mb-3">
                            <label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Date</label>
                            <input type="date" value={eventDetails.date} onChange={e => setEventDetails({ ...eventDetails, date: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-teal-500" />
                        </div>
                        <div className="mb-3">
                            <label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Start Time</label>
                            <input type="time" value={eventDetails.time} onChange={e => setEventDetails({ ...eventDetails, time: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-teal-500" />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-slate-900 border-white/10">
                    <Button variant="secondary" onClick={handleClose} className="rounded-xl px-6">Cancel</Button>
                    <Button variant="primary" onClick={handleAdd} className="bg-teal-500 border-none text-black font-bold rounded-xl px-6">Submit Proposal</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddEvent;