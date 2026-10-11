
import { useEffect, useState } from "react";

import Home from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Booking from "./pages/booking.jsx";
import MyBookings from "./pages/myBookings.jsx";
import ProviderDashboard from "./pages/providerDashboard.jsx";

import API from "./services/api";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check existing login session
  useEffect(() => {
    API.get("/auth/me")
      .then((response) => {
        const userData = response.data;
        setUser(userData);

        if (userData.role === "WORKER") {
          setPage("providerDashboard");
        } else {
          setPage("home");
        }
      })
      .catch(() => {
        setUser(null);
        setPage("home");
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  // Navigate between pages
  const navigate = (newPage) => {
    if (newPage === "login" || newPage === "register") {
      setPage(newPage);
      return;
    }

    // Allow everyone to view Home
    if (newPage === "home") {
      setPage("home");
      return;
    }

    // Require login for other pages
    if (!user) {
      setPage("login");
      return;
    }

    // Workers can access only their dashboard
    // or the Home page
    if (user.role === "WORKER") {
      setPage(
        newPage === "providerDashboard"
          ? "providerDashboard"
          : "home"
      );
      return;
    }

    // Customers can access booking pages
    if (user.role === "USER") {
      if (
        newPage === "booking" ||
        newPage === "myBookings"
      ) {
        setPage(newPage);
      } else {
        setPage("home");
      }
      return;
    }

    setPage("login");
  };

  // Handle booking a service
  const handleBookService = (service) => {
    if (!user) {
      setSelectedService(service);
      setPage("login");
      return;
    }

    if (user.role !== "USER") {
      alert("Only customers can book services.");
      return;
    }

    setSelectedService(service);
    setPage("booking");
  };

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);

    if (userData.role === "WORKER") {
      setSelectedService(null);
      setPage("providerDashboard");
    } else if (userData.role === "USER") {
      setPage(selectedService ? "booking" : "home");
    } else {
      setUser(null);
      setPage("login");
      alert("Your account role is missing or invalid.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      setUser(null);
      setSelectedService(null);
      setPage("home");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out. Please try again.");
    }
  };

  if (checkingSession) {
    return (
      <div className="app-loading">
        Loading Local Service Finder...
      </div>
    );
  }

  // Registration page
  if (page === "register") {
    return (
      <Register
        onNavigate={navigate}
        onLogin={() => navigate("login")}
      />
    );
  }

  // Login page
  if (page === "login") {
    return (
      <Login
        onNavigate={navigate}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Provider Dashboard
  if (
    page === "providerDashboard" &&
    user?.role === "WORKER"
  ) {
    return (
      <ProviderDashboard
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  // Customer Booking page
  if (page === "booking" && user?.role === "USER") {
    return (
      <Booking
        service={selectedService}
        onNavigate={(newPage) => {
          if (newPage === "home") {
            setSelectedService(null);
          }

          navigate(newPage);
        }}
      />
    );
  }

  // Customer My Bookings page
  if (page === "myBookings" && user?.role === "USER") {
    return <MyBookings onNavigate={navigate} />;
  }

  // Home page for visitors, customers, and workers
  return (
    <Home
      user={user}
      onNavigate={navigate}
      onLogout={handleLogout}
      onBookService={handleBookService}
    />
  );
}

export default App;
