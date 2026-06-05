import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
  const { _id, carName, carType, dailyRentPrice, imageURL, seatCapacity, pickupLocation, availabilityStatus, bookingCount } = car;
  return (
    <div className="car-card">
      <div className="car-card-img-wrap">
        <img
          src={imageURL || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=75"}
          alt={carName}
          className="car-card-img"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=75"; }}
        />
        <span className={`badge-status ${availabilityStatus === "available" ? "avail" : "unavail"}`}>
          {availabilityStatus === "available" ? "Available" : "Unavailable"}
        </span>
        <span className="badge-type">{carType}</span>
      </div>
      <div className="car-card-body">
        <h3 className="car-name">{carName}</h3>
        <div className="car-meta">
          <span>👥 {seatCapacity} seats</span>
          <span>📍 {pickupLocation}</span>
          {bookingCount > 0 && <span>⭐ {bookingCount} bookings</span>}
        </div>
        <div className="car-card-foot">
          <div className="car-price"><span className="price-val">${dailyRentPrice}</span><span className="price-per">/day</span></div>
          <Link to={`/cars/${_id}`} className="btn-primary">View Details</Link>
        </div>
      </div>
    </div>
  );
};
export default CarCard;
