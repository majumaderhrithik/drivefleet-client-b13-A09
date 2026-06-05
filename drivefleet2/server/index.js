require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "drivefleet_secret_key_2024";

// ── IMPORTANT: URI fallback hardcoded so it works even if .env fails ──
const MONGODB_URI = process.env.MONGODB_URI ||
  "mongodb+srv://api_access_19v:Labu1175@cluster0.nvp4mwm.mongodb.net/drivefleet?retryWrites=true&w=majority&appName=Cluster0";

console.log("Starting DriveFleet server...");
console.log("MongoDB URI loaded:", MONGODB_URI ? "YES ✅" : "NO ❌");

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── JWT Verify Middleware ───────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: "Forbidden: invalid token" });
  }
};

// ── MongoDB ─────────────────────────────────────────────────────────────────
async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db("drivefleet");
    const cars = db.collection("cars");
    const bookings = db.collection("bookings");
    const users = db.collection("users");

    // ── Health ──────────────────────────────────────────────────────────────
    app.get("/", (req, res) => res.json({ status: "DriveFleet API running ✅" }));

    // ── AUTH ────────────────────────────────────────────────────────────────
    app.post("/jwt", (req, res) => {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email required" });
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }).json({ success: true });
    });

    app.post("/logout", (req, res) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }).json({ success: true });
    });

    app.post("/users", async (req, res) => {
      const { email, name, photoURL } = req.body;
      if (!email) return res.status(400).json({ message: "Email required" });
      const exists = await users.findOne({ email });
      if (exists) return res.json({ message: "exists" });
      await users.insertOne({ email, name, photoURL, createdAt: new Date() });
      res.status(201).json({ success: true });
    });

    // ── CARS (public) ───────────────────────────────────────────────────────
    app.get("/cars/recent", async (req, res) => {
      try {
        const result = await cars
          .find({ availabilityStatus: "available" })
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();
        res.json(result);
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.get("/cars", async (req, res) => {
      try {
        const { search, type, sort } = req.query;
        const query = {};
        if (search) query.carName = { $regex: search, $options: "i" };
        if (type && type !== "all") query.carType = { $in: [type] };
        let sortOpt = { createdAt: -1 };
        if (sort === "price_asc") sortOpt = { dailyRentPrice: 1 };
        if (sort === "price_desc") sortOpt = { dailyRentPrice: -1 };
        if (sort === "oldest") sortOpt = { createdAt: 1 };
        const result = await cars.find(query).sort(sortOpt).toArray();
        res.json(result);
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.get("/cars/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        const car = await cars.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).json({ message: "Not found" });
        res.json(car);
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    // ── CARS (private) ──────────────────────────────────────────────────────
    app.post("/cars", verifyToken, async (req, res) => {
      try {
        const doc = {
          ...req.body,
          ownerEmail: req.user.email,
          bookingCount: 0,
          createdAt: new Date(),
        };
        const result = await cars.insertOne(doc);
        res.status(201).json({ success: true, result });
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.get("/my-cars", verifyToken, async (req, res) => {
      try {
        const result = await cars
          .find({ ownerEmail: req.user.email })
          .sort({ createdAt: -1 })
          .toArray();
        res.json(result);
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.put("/cars/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        const car = await cars.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).json({ message: "Not found" });
        if (car.ownerEmail !== req.user.email)
          return res.status(403).json({ message: "Forbidden" });
        const update = { ...req.body, updatedAt: new Date() };
        delete update._id;
        const result = await cars.updateOne(
          { _id: new ObjectId(id) },
          { $set: update }
        );
        res.json({ success: true, result });
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.delete("/cars/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        const car = await cars.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).json({ message: "Not found" });
        if (car.ownerEmail !== req.user.email)
          return res.status(403).json({ message: "Forbidden" });
        await cars.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    // ── BOOKINGS ────────────────────────────────────────────────────────────
    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        const { carId, driverNeeded, specialNote, startDate, endDate, totalPrice } = req.body;
        if (!ObjectId.isValid(carId))
          return res.status(400).json({ message: "Invalid car ID" });
        const car = await cars.findOne({ _id: new ObjectId(carId) });
        if (!car) return res.status(404).json({ message: "Car not found" });
        const booking = {
          carId: new ObjectId(carId),
          carName: car.carName,
          carImage: car.imageURL,
          carType: car.carType,
          dailyRentPrice: car.dailyRentPrice,
          pickupLocation: car.pickupLocation,
          userEmail: req.user.email,
          driverNeeded,
          specialNote,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          status: "pending",
          bookingDate: new Date(),
        };
        await bookings.insertOne(booking);
        await cars.updateOne(
          { _id: new ObjectId(carId) },
          { $inc: { bookingCount: 1 } }
        );
        res.status(201).json({ success: true });
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.get("/my-bookings", verifyToken, async (req, res) => {
      try {
        const result = await bookings
          .find({ userEmail: req.user.email })
          .sort({ bookingDate: -1 })
          .toArray();
        res.json(result);
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    app.delete("/bookings/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id))
          return res.status(400).json({ message: "Invalid ID" });
        const booking = await bookings.findOne({ _id: new ObjectId(id) });
        if (!booking) return res.status(404).json({ message: "Not found" });
        if (booking.userEmail !== req.user.email)
          return res.status(403).json({ message: "Forbidden" });
        await bookings.deleteOne({ _id: new ObjectId(id) });
        await cars.updateOne(
          { _id: booking.carId },
          { $inc: { bookingCount: -1 } }
        );
        res.json({ success: true });
      } catch (e) { res.status(500).json({ message: e.message }); }
    });

    // ── Start server ─────────────────────────────────────────────────────────
    app.listen(PORT, () => {
      console.log(`🚀 DriveFleet server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

run();
