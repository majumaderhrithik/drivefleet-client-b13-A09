import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import axiosInstance from "../utils/axios";

const TYPES = ["all","SUV","Sedan","Hatchback","Luxury","Electric","Truck","Van"];

const ExploreCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetch = (s = search, t = type, so = sort) => {
    setLoading(true);
    const p = new URLSearchParams();
    if (s) p.append("search", s);
    if (t !== "all") p.append("type", t);
    if (so) p.append("sort", so);
    axiosInstance.get(`/cars?${p}`)
      .then(r => setCars(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [type, sort]);

  return (
    <div className="page-container">
      <div className="page-hero">
        <h1 className="page-title">Explore Cars</h1>
        <p className="page-sub">Find your perfect ride from our premium fleet</p>
      </div>

      <div className="filter-bar">
        <form className="search-form" onSubmit={e => { e.preventDefault(); fetch(); }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by car name…" className="form-input search-inp" />
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="filter-controls">
          <select value={type} onChange={e => setType(e.target.value)} className="form-input">
            {TYPES.map(t => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="form-input">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {!loading && <p className="results-count">Showing <strong>{cars.length}</strong> {cars.length === 1 ? "car" : "cars"}</p>}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : cars.length > 0 ? (
        <div className="cars-grid">{cars.map(c => <CarCard key={c._id} car={c} />)}</div>
      ) : (
        <div className="empty-state"><h3>No cars found</h3><p>Try adjusting your search or filters.</p></div>
      )}
    </div>
  );
};
export default ExploreCars;
