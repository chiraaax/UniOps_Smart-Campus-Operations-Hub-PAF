import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { QRCodeSVG } from 'qrcode.react';

const StudentBookings = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation(); 
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedQrBooking, setSelectedQrBooking] = useState(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    
    const [highlightedBookingId, setHighlightedBookingId] = useState(null);
    const bookingRefs = useRef({}); 

    useEffect(() => {
        if (user && user.id) {
            loadMyBookings();
        }
    }, [user]);

    useEffect(() => {
        if (!loading && location.state?.highlightId && bookingRefs.current[location.state.highlightId]) {
            const id = location.state.highlightId;
            setHighlightedBookingId(id);
            
            bookingRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                setHighlightedBookingId(null);
            }, 3000);
        }
    }, [loading, location.state, bookings]);

    const loadMyBookings = async () => {
        try {
            const data = await bookingService.getUserBookings(user.id);
            data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch my bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await bookingService.updateBookingStatus(id, 'CANCELLED');
                loadMyBookings(); 
            } catch (error) {
                alert("Failed to cancel booking.");
            }
        }
    };

    const handleCheckIn = async (bookingId) => {
        setCheckInLoading(true);
        try {
            await bookingService.checkInBooking(bookingId);
            alert("Check-in Successful!");
            setSelectedQrBooking(null);
            loadMyBookings();
        } catch (error) {
            alert(error.response?.data || "Check-in failed");
        } finally {
            setCheckInLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            
            {/* HERO SECTION */}
            <div className="relative text-white pb-32 pt-16 px-6 shadow-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #084298 0%, #0d6efd 100%)' }}>
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto max-w-4xl relative z-10 flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-xl opacity-60"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">My Bookings</h1>
                        <p className="text-blue-200/80 text-lg font-medium">Track and manage your resource requests.</p>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="container mx-auto max-w-4xl -mt-20 px-4 relative z-20">
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 text-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Bookings Yet</h3>
                        <p className="text-slate-500 mb-8">You haven't requested any resources from the Uni Ops.</p>
                        <button onClick={() => navigate('/facilities')} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                            Browse Facilities Directory
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {bookings.map(booking => {
                            const isHighlighted = highlightedBookingId === booking.id;
                            const isApproved = booking.status === 'APPROVED';
                            const isRejected = booking.status === 'REJECTED' || booking.status === 'CANCELLED';
                            const isPending = booking.status === 'PENDING';
                            
                            const statusBg = isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isRejected ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200';

                            return (
                                <div 
                                    key={booking.id} 
                                    ref={(el) => (bookingRefs.current[booking.id] = el)}
                                    className={`bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center transition-all duration-500 ${isHighlighted ? 'ring-4 ring-blue-500/50 shadow-2xl scale-[1.02] border-blue-200' : 'shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-blue-100'}`}
                                >
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-extrabold text-slate-900 m-0 flex items-center gap-3">
                                                {booking.facilityName}
                                                {booking.checkedIn && (
                                                    <span className="bg-emerald-500 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                        Checked In
                                                    </span>
                                                )}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purpose</div>
                                                    <div className="font-semibold text-slate-700">{booking.purpose}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Schedule</div>
                                                    <div className="font-semibold text-slate-700 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {isPending && (
                                                <button 
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    Cancel Request
                                                </button>
                                            )}

                                            {isApproved && (
                                                <>
                                                    {!booking.checkedIn && (
                                                        <button 
                                                            onClick={() => setSelectedQrBooking(booking)}
                                                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all transform active:scale-95 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                            Check-in Pass
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => navigate('/incidents/new?resourceId=' + booking.facilityId)}
                                                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold transition-colors"
                                                    >
                                                        Report Issue
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge (Right Side Desktop) */}
                                    <div className="w-full md:w-auto flex justify-end shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                        <div className={`px-5 py-2.5 rounded-xl border font-extrabold text-[13px] uppercase tracking-wider flex items-center gap-2 ${statusBg}`}>
                                            <div className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* QR CODE MODAL (Glassmorphism Digital Pass) */}
            {selectedQrBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100">
                        
                        <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                            </div>
                            <div className="relative z-10 text-white font-extrabold text-xl tracking-wider uppercase mb-1">Digital Pass</div>
                            <div className="relative z-10 text-blue-200 text-sm font-medium">{selectedQrBooking.facilityName}</div>
                        </div>

                        <div className="p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMSIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg==')]">
                            <div className="inline-block p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm mb-6">
                                <QRCodeSVG value={`smartcampus://checkin/${selectedQrBooking.id}`} size={200} level={"H"} />
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-6 px-4">Show this QR code to the facility administrator to check in.</p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => handleCheckIn(selectedQrBooking.id)} 
                                    disabled={checkInLoading} 
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-green-500/30 transition-all transform active:scale-95 disabled:opacity-70"
                                >
                                    {checkInLoading ? 'Processing...' : 'Manual Check IN Now'}
                                </button>
                                <button 
                                    onClick={() => setSelectedQrBooking(null)} 
                                    className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-colors"
                                >
                                    Close Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentBookings;