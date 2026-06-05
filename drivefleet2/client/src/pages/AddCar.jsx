import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const TYPES = ["Sedan","SUV","Hatchback","Luxury","Electric","Truck","Van"];

const AddCar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ carName:"", dailyRentPrice:"", carType:"Sedan", imageURL:"", seatCapacity:"", pickupLocation:"", description:"", availabilityStatus:"available" });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await axiosInstance.post("/cars", { ...form, dailyRentPrice: Number(form.dailyRentPrice), seatCapacity: Number(form.seatCapacity) });
      toast.success("Car listed successfully! 🚗");
      navigate("/my-cars");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add car"); }
    finally { setBusy(false); }
  };

  return (
    <div className="page-container">
      <div className="form-page-header">
        <h1 className="page-title">List Your Car</h1>
        <p className="page-sub">Share your vehicle and start earning</p>
      </div>
      <div className="form-card">
        <form onSubmit={submit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Car Name *</label>
              <input type="text" value={form.carName} onChange={e => set("carName", e.target.value)} className="form-input" placeholder="e.g. Toyota Corolla 2023" required />
            </div>
            <div className="form-group">
              <label className="form-label">Daily Rent Price (USD) *</label>
              <input type="number" value={form.dailyRentPrice} onChange={e => set("dailyRentPrice", e.target.value)} className="form-input" placeholder="e.g. 75" min="1" required />
            </div>
            <div className="form-group">
              <label className="form-label">Car Type</label>
              <select value={form.carType} onChange={e => set("carType", e.target.value)} className="form-input">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Seat Capacity</label>
              <input type="number" value={form.seatCapacity} onChange={e => set("seatCapacity", e.target.value)} className="form-input" placeholder="e.g. 5" min="1" max="20" />
            </div>
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <input type="text" value={form.pickupLocation} onChange={e => set("pickupLocation", e.target.value)} className="form-input" placeholder="e.g. Dhaka Airport" />
            </div>
            <div className="form-group">
              <label className="form-label">Availability</label>
              <select value={form.availabilityStatus} onChange={e => set("availabilityStatus", e.target.value)} className="form-input">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input type="url" value={form.imageURL} onChange={e => set("imageURL", e.target.value)} className="form-input" placeholder="https://i.ibb.co/your-image" required />
            {form.imageURL && <img src={form.imageURL} alt="preview" className="img-preview" onError={e => e.target.style.display="none"} />}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} className="form-input form-textarea" placeholder="Describe your car's features and condition…" rows={4} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Listing…" : "List My Car"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddCar;
