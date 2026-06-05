import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [booking, setBooking] = useState({ driverNeeded: "no", specialNote: "", startDate: "", endDate: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/cars/${id}`)
      .then(r => setCar(r.data))
      .catch(() => toast.error("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const days = () => {
    if (!booking.startDate || !booking.endDate) return 0;
    return Math.max(0, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000));
  };
  const total = () => car ? days() * car.dailyRentPrice : 0;

  const openModal = () => {
    if (!user) { toast.error("Please login to book a car"); navigate("/login"); return; }
    setModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (days() === 0) { toast.error("End date must be after start date"); return; }
    setBusy(true);
    try {
      await axiosInstance.post("/bookings", { carId: car._id, ...booking, totalPrice: total() });
      toast.success("Car booked successfully! 🎉");
      setModal(false);
      navigate("/my-bookings");
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed"); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!car) return <div className="empty-state"><h3>Car not found</h3></div>;

  return (
    <div className="page-container">
      <div className="details-layout">
        <div className="details-img-col">
          <img
            src={car.imageURL || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80"}
            alt={car.carName} className="details-img"
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80"; }}
          />
          <div className="details-badges">
            <span className={`badge-status ${car.availabilityStatus === "available" ? "avail" : "unavail"}`}>
              {car.availabilityStatus === "available" ? "Available" : "Unavailable"}
            </span>
            <span className="badge-type">{car.carType}</span>
          </div>
        </div>
        <div className="details-info-col">
          <h1 className="details-car-name">{car.carName}</h1>
          <div className="details-price"><span className="price-val big">${car.dailyRentPrice}</span><span className="price-per">/day</span></div>
          <div className="specs-grid">
            <div className="spec"><span className="spec-label">Seats</span><strong>{car.seatCapacity}</strong></div>
            <div className="spec"><span className="spec-label">Type</span><strong>{car.carType}</strong></div>
            <div className="spec"><span className="spec-label">Pickup</span><strong>{car.pickupLocation}</strong></div>
            <div className="spec"><span className="spec-label">Bookings</span><strong>{car.bookingCount || 0}</strong></div>
          </div>
          <div className="details-desc">
            <h3>About this Car</h3>
            <p>{car.description}</p>
          </div>
          <button className="btn-primary btn-lg btn-block" onClick={openModal}
            disabled={car.availabilityStatus !== "available"}>
            {car.availabilityStatus === "available" ? "Book Now" : "Currently Unavailable"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Book {car.carName}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={submitBooking} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" min={new Date().toISOString().split("T")[0]}
                    value={booking.startDate} onChange={e => setBooking({...booking, startDate: e.target.value})}
                    className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" min={booking.startDate || new Date().toISOString().split("T")[0]}
                    value={booking.endDate} onChange={e => setBooking({...booking, endDate: e.target.value})}
                    className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Driver Needed?</label>
                <select value={booking.driverNeeded} onChange={e => setBooking({...booking, driverNeeded: e.target.value})} className="form-input">
                  <option value="no">No — Self drive</option>
                  <option value="yes">Yes — Include a driver</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Special Note (optional)</label>
                <textarea value={booking.specialNote} onChange={e => setBooking({...booking, specialNote: e.target.value})}
                  className="form-input form-textarea" placeholder="Any special requests…" rows={3} />
              </div>
              {days() > 0 && (
                <div className="booking-summary">
                  <div className="summary-row"><span>Duration</span><strong>{days()} day{days() > 1 ? "s" : ""}</strong></div>
                  <div className="summary-row"><span>Rate</span><strong>${car.dailyRentPrice}/day</strong></div>
                  <div className="summary-row total"><span>Total</span><strong>${total()}</strong></div>
                </div>
              )}
              <button type="submit" className="btn-primary btn-block" disabled={busy}>{busy ? "Booking…" : "✓ Confirm Booking"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CarDetails;
