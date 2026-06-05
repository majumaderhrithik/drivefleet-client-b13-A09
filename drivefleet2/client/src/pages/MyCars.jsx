import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const TYPES = ["Sedan","SUV","Hatchback","Luxury","Electric","Truck","Van"];

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    axiosInstance.get("/my-cars")
      .then(r => setCars(Array.isArray(r.data) ? r.data : []))
      .catch(() => toast.error("Failed to load cars"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/cars/${deleteId}`);
      toast.success("Car deleted");
      setCars(prev => prev.filter(c => c._id !== deleteId));
      setDeleteId(null);
    } catch { toast.error("Delete failed"); }
  };

  const openEdit = (car) => {
    setEditId(car._id);
    setEditForm({ carName: car.carName, dailyRentPrice: car.dailyRentPrice, carType: car.carType, imageURL: car.imageURL, seatCapacity: car.seatCapacity, pickupLocation: car.pickupLocation, description: car.description, availabilityStatus: car.availabilityStatus });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/cars/${editId}`, { ...editForm, dailyRentPrice: Number(editForm.dailyRentPrice), seatCapacity: Number(editForm.seatCapacity) });
      toast.success("Car updated!");
      setEditId(null);
      load();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-head-row">
        <div><h1 className="page-title">My Added Cars</h1><p className="page-sub">Manage your listed vehicles</p></div>
        <Link to="/add-car" className="btn-primary">+ Add New Car</Link>
      </div>

      {cars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No cars listed yet</h3>
          <p>Start earning by listing your first vehicle</p>
          <Link to="/add-car" className="btn-primary">List a Car</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr>
              <th>Car</th><th>Type</th><th>Price/Day</th><th>Seats</th><th>Status</th><th>Bookings</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {cars.map(car => (
                <tr key={car._id}>
                  <td>
                    <div className="table-car">
                      <img src={car.imageURL || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=80"} alt={car.carName} className="table-thumb" onError={e => e.target.style.display="none"} />
                      <span>{car.carName}</span>
                    </div>
                  </td>
                  <td><span className="pill pill-type">{car.carType}</span></td>
                  <td><strong>${car.dailyRentPrice}</strong></td>
                  <td>{car.seatCapacity}</td>
                  <td><span className={`pill ${car.availabilityStatus === "available" ? "pill-green" : "pill-red"}`}>{car.availabilityStatus}</span></td>
                  <td>{car.bookingCount || 0}</td>
                  <td>
                    <div className="row-actions">
                      <button className="action-btn edit-btn" onClick={() => openEdit(car)}>✏️ Edit</button>
                      <button className="action-btn del-btn" onClick={() => setDeleteId(car._id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <h2>Delete Car</h2>
            <p>Are you sure you want to delete this listing? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editId && (
        <div className="modal-overlay" onClick={() => setEditId(null)}>
          <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Update Car</h2>
              <button className="modal-close" onClick={() => setEditId(null)}>✕</button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="form-grid-2">
                <div className="form-group"><label className="form-label">Car Name</label><input type="text" value={editForm.carName} onChange={e => setEditForm({...editForm, carName: e.target.value})} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Price/Day</label><input type="number" value={editForm.dailyRentPrice} onChange={e => setEditForm({...editForm, dailyRentPrice: e.target.value})} className="form-input" min="1" /></div>
                <div className="form-group"><label className="form-label">Type</label><select value={editForm.carType} onChange={e => setEditForm({...editForm, carType: e.target.value})} className="form-input">{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Availability</label><select value={editForm.availabilityStatus} onChange={e => setEditForm({...editForm, availabilityStatus: e.target.value})} className="form-input"><option value="available">Available</option><option value="unavailable">Unavailable</option></select></div>
                <div className="form-group"><label className="form-label">Location</label><input type="text" value={editForm.pickupLocation} onChange={e => setEditForm({...editForm, pickupLocation: e.target.value})} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Image URL</label><input type="url" value={editForm.imageURL} onChange={e => setEditForm({...editForm, imageURL: e.target.value})} className="form-input" /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="form-input form-textarea" rows={3} /></div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setEditId(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "✓ Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyCars;
