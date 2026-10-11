
import { useState } from "react";
import API from "../services/api";
import "../App.css";

function Booking({ service, onNavigate }) {
  const [form, setForm] = useState({
    bookingDate: "",
    bookingTime: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/bookings", {
        serviceId: service.id,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        address: form.address.trim(),
        notes: form.notes.trim(),
      });

      setSuccess("Booking created successfully!");
      setForm({
        bookingDate: "",
        bookingTime: "",
        address: "",
        notes: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create booking."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h2>No service selected</h2>
          <button
            className="auth-submit"
            onClick={() => onNavigate("home")}
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <button
        className="back-home"
        onClick={() => onNavigate("home")}
      >
        ← Back to Home
      </button>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">LocalServiceFinder</div>
        <h1>Book a Service</h1>
        <p className="auth-subtitle">
          Fill in your details to request a booking.
        </p>

        <div className="booking-service-summary">
          <h3>{service.serviceName}</h3>
          <p>Category: {service.category}</p>
          <p>Location: {service.location}</p>
          <p>Price: ₹{service.price}</p>
          {service.provider && (
            <p>Provider: {service.provider.name}</p>
          )}
        </div>

        <label htmlFor="booking-date">Booking Date</label>
        <input
          id="booking-date"
          type="date"
          name="bookingDate"
          min={localToday}
          value={form.bookingDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-time">Booking Time</label>
        <input
          id="booking-time"
          type="time"
          name="bookingTime"
          value={form.bookingTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-address">Service Address</label>
        <input
          id="booking-address"
          type="text"
          name="address"
          placeholder="Enter your full address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-notes">Additional Notes</label>
        <textarea
          id="booking-notes"
          name="notes"
          placeholder="Describe the problem (optional)"
          value={form.notes}
          onChange={handleChange}
          rows={3}
        />

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading || Boolean(success)}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

        {success && (
          <button
            type="button"
            className="auth-submit"
            onClick={() => onNavigate("myBookings")}
          >
            View My Bookings
          </button>
        )}
      </form>
    </main>
  );
}

export default Booking;
