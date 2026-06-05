import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const fmt = d => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    axiosInstance.get("/my-bookings")
      .then(r => setBookings(Array.isArray(r.data) ? r.data : []))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const doCancel = async () => {
    try {
      await axiosInstance.delete(`/bookings/${cancelId}`);
      toast.success("Booking cancelled");
      setBookings(prev => prev.filter(b => b._id !== cancelId));
      setCancelId(null);
    } catch { toast.error("Cancel failed"); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-head-row">
        <div><h1 className="page-title">My Bookings</h1><p className="page-sub">Track and manage your rental reservations</p></div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Explore our fleet and book your first ride</p>
          <a href="/cars" className="btn-primary">Explore Cars</a>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <div className="booking-img-wrap">
                <img src={b.carImage || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400"} alt={b.carName} className="booking-img" onError={e => e.target.src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400"} />
                <span className={`pill pill-${b.status}`}>{b.status}</span>
              </div>
              <div className="booking-body">
                <h3 className="booking-car">{b.carName}</h3>
                <span className="pill pill-type">{b.carType}</span>
                <div className="booking-rows">
                  <div className="booking-row"><span>📅 Dates</span><span>{fmt(b.startDate)} → {fmt(b.endDate)}</span></div>
                  <div className="booking-row"><span>📍 Pickup</span><span>{b.pickupLocation}</span></div>
                  <div className="booking-row"><span>🧑‍✈️ Driver</span><span>{b.driverNeeded === "yes" ? "Included" : "Self-drive"}</span></div>
                  <div className="booking-row"><span>📆 Booked on</span><span>{fmt(b.bookingDate)}</span></div>
                </div>
                {b.specialNote && <p className="booking-note">📝 {b.specialNote}</p>}
                <div className="booking-foot">
                  <div className="booking-total"><span>Total</span><strong>${b.totalPrice}</strong></div>
                  <button className="btn-danger btn-sm" onClick={() => setCancelId(b._id)}>Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelId && (
        <div className="modal-overlay" onClick={() => setCancelId(null)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <h2>Cancel Booking</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setCancelId(null)}>Keep It</button>
              <button className="btn-danger" onClick={doCancel}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyBookings;
