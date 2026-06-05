import { Link } from "react-router-dom";
const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div>
        <Link to="/" className="footer-logo">
          <span className="logo-mark">D</span>
          <span>DriveFleet</span>
        </Link>
        <p className="footer-desc">Premium car rentals for every journey. Experience freedom on the road with our curated fleet.</p>
        <div className="socials">
          <a href="#" className="social" aria-label="X">𝕏</a>
          <a href="#" className="social" aria-label="Facebook">f</a>
          <a href="#" className="social" aria-label="Instagram">◎</a>
          <a href="#" className="social" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div>
        <h4 className="footer-heading">Quick Links</h4>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cars">Explore Cars</Link></li>
          <li><Link to="/add-car">List Your Car</Link></li>
          <li><Link to="/my-bookings">My Bookings</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="footer-heading">Car Types</h4>
        <ul className="footer-links">
          <li>SUV</li><li>Sedan</li><li>Hatchback</li><li>Luxury</li><li>Electric</li>
        </ul>
      </div>
      <div>
        <h4 className="footer-heading">Contact</h4>
        <ul className="footer-links">
          <li>📍 123 Fleet Street, Dhaka</li>
          <li>📞 +880 1234 567890</li>
          <li>✉ support@drivefleet.com</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} DriveFleet. All rights reserved.</span>
      <div><a href="#">Privacy</a> · <a href="#">Terms</a></div>
    </div>
  </footer>
);
export default Footer;
