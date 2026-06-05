import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";
import axiosInstance from "../utils/axios";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/cars/recent")
      .then(r => setCars(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: "🛡️", title: "Fully Insured", desc: "Every vehicle comes with comprehensive insurance coverage for your peace of mind on every trip." },
    { icon: "🕐", title: "24/7 Support", desc: "Our dedicated team is always on standby to assist you wherever you are, any time of day." },
    { icon: "🏆", title: "Premium Fleet", desc: "Curated selection of top-rated vehicles maintained to the highest quality standards." },
    { icon: "📍", title: "Flexible Pickup", desc: "Multiple pickup locations across the city — pick up and drop off where it suits you." },
  ];

  const testimonials = [
    { name: "Sarah K.", role: "Business Traveler", text: "DriveFleet made my business trip seamless. The car was spotless and booking took just minutes.", stars: 5 },
    { name: "Marcus T.", role: "Weekend Explorer", text: "Finally a rental service that feels premium. Beautiful cars, fair prices and incredible support.", stars: 5 },
    { name: "Priya M.", role: "Family Vacationer", text: "Rented an SUV for our family road trip. Spacious, clean, and exactly what we needed!", stars: 5 },
  ];

  return (
    <div>
      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 500+ Cars Available Now</div>
          <h1 className="hero-title">Drive Your <span className="accent">Perfect</span><br />Journey Today</h1>
          <p className="hero-sub">Discover premium vehicles at unbeatable prices. From city commutes to cross-country adventures — we have your ideal ride waiting.</p>
          <div className="hero-btns">
            <Link to="/cars" className="btn-primary btn-lg">Explore Cars</Link>
            <Link to="/add-car" className="btn-outline btn-lg">List Your Car</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Vehicles</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>10K+</strong><span>Happy Renters</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>50+</strong><span>Locations</span></div>
          </div>
        </div>
        <div className="hero-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1617814076229-45bf0d36cc05?w=680&q=80"
            alt="Premium car"
            className="hero-img"
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
      </section>

      {/* ── AVAILABLE CARS ──────────────────────────── */}
      <section className="section">
        <div className="section-head">
          <span className="section-label">Our Fleet</span>
          <h2 className="section-title">Available Cars</h2>
          <p className="section-sub">Hand-picked vehicles ready for your next adventure</p>
        </div>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : cars.length > 0 ? (
          <>
            <div className="cars-grid">{cars.map(c => <CarCard key={c._id} car={c} />)}</div>
            <div className="section-cta"><Link to="/cars" className="btn-outline btn-lg">View All Cars</Link></div>
          </>
        ) : (
          <div className="empty-state">
            <p>No cars yet. Start the server and add some!</p>
            <Link to="/add-car" className="btn-primary">Add First Car</Link>
          </div>
        )}
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────── */}
      <section className="section bg-alt">
        <div className="section-head">
          <span className="section-label">Why DriveFleet</span>
          <h2 className="section-title">Built Around You</h2>
          <p className="section-sub">Everything you need for a stress-free rental experience</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="section">
        <div className="section-head">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Our Drivers Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="t-stars">{"★".repeat(t.stars)}</div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-author">
                <div className="t-avatar">{t.name[0]}</div>
                <div><strong>{t.name}</strong><small>{t.role}</small></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Hit the Road?</h2>
        <p className="cta-sub">Join thousands of satisfied customers and book your perfect car today.</p>
        <Link to="/cars" className="btn-white btn-lg">Browse All Cars</Link>
      </section>
    </div>
  );
};
export default Home;
