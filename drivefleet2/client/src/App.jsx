import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ExploreCars from "./pages/ExploreCars";
import CarDetails from "./pages/CarDetails";
import AddCar from "./pages/AddCar";
import MyCars from "./pages/MyCars";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "cars", element: <ExploreCars /> },
      { path: "cars/:id", element: <CarDetails /> },
      { path: "add-car", element: <PrivateRoute><AddCar /></PrivateRoute> },
      { path: "my-cars", element: <PrivateRoute><MyCars /></PrivateRoute> },
      { path: "my-bookings", element: <PrivateRoute><MyBookings /></PrivateRoute> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
