import { Link } from "react-router-dom";
const NotFound = () => (
  <div className="notfound-page">
    <div className="notfound-num">404</div>
    <h1 className="notfound-title">Road Not Found</h1>
    <p className="notfound-sub">Looks like you've taken a wrong turn. This page doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary btn-lg">Back to Home</Link>
  </div>
);
export default NotFound;
