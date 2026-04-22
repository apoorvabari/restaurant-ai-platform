import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMenu } from "./features/menu/menuSlice";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import AppRoutes from "./router/Routes";

function App() {
  const dispatch = useDispatch();

  // Pre-fetch menu data for the whole app
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CartSidebar />

        <main className="flex-1">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;