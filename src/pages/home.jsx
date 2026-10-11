
import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function Home({ user, onNavigate, onLogout, onBookService }) {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/services");

      setServices(
        Array.isArray(response.data)
          ? response.data
          : response.data?.content || []
      );
    } catch (err) {
      console.error("Error loading services:", err);
      setError("Unable to load services. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "Electrical",
      icon: "⚡",
      description: "Electrical repairs",
    },
    {
      name: "Plumbing",
      icon: "🔧",
      description: "Plumbing services",
    },
    {
      name: "Carpentry",
      icon: "🪚",
      description: "Furniture and woodwork",
    },
    {
      name: "Cleaning",
      icon: "🧹",
      description: "Home cleaning",
    },
    {
      name: "AC Repair",
      icon: "❄️",
      description: "AC installation and repair",
    },
    {
      name: "Painting",
      icon: "🎨",
      description: "Home painting",
    },
  ];

  const filteredServices = services.filter((service) => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      service.serviceName?.toLowerCase().includes(searchText) ||
      service.category?.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText) ||
      service.provider?.name?.toLowerCase().includes(searchText);

    const matchesLocation =
      !locationText ||
      service.location?.toLowerCase().includes(locationText) ||
      service.provider?.location?.toLowerCase().includes(locationText);

    return matchesSearch && matchesLocation;
  });

  const searchCategory = (category) => {
    setSearch(category);

    document
      .getElementById("available-services")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const getServiceIcon = (category = "") => {
    const value = category.toLowerCase();

    if (value.includes("electric")) return "⚡";
    if (value.includes("plumb")) return "🔧";
    if (value.includes("clean")) return "🧹";
    if (value.includes("carpent")) return "🪚";
    if (value.includes("ac")) return "❄️";
    if (value.includes("paint")) return "🎨";

    return "🛠️";
  };

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => onNavigate("home")}
          style={{ cursor: "pointer" }}
        >
          🏠 Local Service Finder
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#available-services">Services</a>
        </div>

        <div className="nav-buttons">
          {user ? (
            <>
              <span className="welcome-user">
                Hi, {user.name || "User"}
              </span>

              {user.role === "USER" && (
                <button
                  className="nav-btn"
                  onClick={() => onNavigate("myBookings")}
                >
                  My Bookings
                </button>
              )}

              <button className="nav-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-btn"
                onClick={() => onNavigate("login")}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => onNavigate("register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="hero-tag">YOUR HOME, OUR PRIORITY</p>

          <h1>
            Find Trusted Home
            <br />
            Services Near You
          </h1>

          <p className="hero-description">
            Find reliable electricians, plumbers, cleaners, and other
            professionals for your everyday needs.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="What service do you need?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button
              onClick={() =>
                document
                  .getElementById("available-services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories">
        <div className="section-heading">
          <p className="section-subtitle">WHAT DO YOU NEED?</p>
          <h2>Popular Categories</h2>
          <p>Choose a category to find the service you need.</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.name}
              onClick={() => searchCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Available Services */}
      <section
        className="services-section"
        id="available-services"
      >
        <div className="section-heading">
          <p className="section-subtitle">OUR SERVICES</p>
          <h2>Available Home Services</h2>
          <p>Choose a service and book a professional.</p>
        </div>

        {loading ? (
          <p className="services-message">Loading services...</p>
        ) : error ? (
          <div className="services-message">
            <p>{error}</p>
            <button className="book-btn" onClick={fetchServices}>
              Try Again
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="services-message">
            <p>
              {services.length === 0
                ? "No services have been added yet."
                : "No matching services found. Try another search."}
            </p>

            {(search || location) && (
              <button
                className="book-btn"
                onClick={() => {
                  setSearch("");
                  setLocation("");
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <article
                className="service-card"
                key={service.id}
              >
                <div className="service-card-icon">
                  {getServiceIcon(service.category)}
                </div>

                <span className="service-category">
                  {service.category || "Home Service"}
                </span>

                <h3>{service.serviceName}</h3>

                <p className="service-description">
                  {service.description ||
                    "Professional home service."}
                </p>

                <p className="service-location">
                  📍{" "}
                  {service.location ||
                    service.provider?.location ||
                    "Location not specified"}
                </p>

                <p className="service-provider">
                  <strong>Provider:</strong>{" "}
                  {service.provider?.name ||
                    "Service Professional"}
                </p>

                <div className="service-card-footer">
                  <span className="service-price">
                    ₹{service.price ?? "Contact provider"}
                  </span>

                  <button
                    className="book-btn"
                    onClick={() => {
                      if (!user) {
                        onNavigate("login");
                      } else {
                        onBookService(service);
                      }
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="section-heading">
          <p className="section-subtitle">WHY CHOOSE US?</p>
          <h2>Services Made Simple</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span>👨‍🔧</span>
            <h3>Skilled Professionals</h3>
            <p>Find service providers for your home needs.</p>
          </div>

          <div className="feature-card">
            <span>📅</span>
            <h3>Easy Booking</h3>
            <p>Choose a service and request an appointment.</p>
          </div>

          <div className="feature-card">
            <span>📍</span>
            <h3>Local Services</h3>
            <p>Search for services in your preferred location.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <h3>🏠 Local Service Finder</h3>
        <p>Making everyday home services easier to find.</p>
        <p>
          © {new Date().getFullYear()} Local Service Finder
        </p>
      </footer>
    </div>
  );
}

export default Home;
