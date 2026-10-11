
import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function MyBookings({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/bookings/my");
      setBookings(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingId(id);
    setError("");
    setMessage("");

    try {
      await API.put(`/bookings/${id}/cancel`);
      setMessage("Booking cancelled successfully.");

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel this booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="bookings-page">
      <div className="bookings-container">
        <button
          className="back-home"
          onClick={() => onNavigate("home")}
        >
          ← Back to Home
        </button>

        <h1>My Bookings</h1>
        <p className="bookings-description">
          View and manage your service bookings.
        </p>

        {loading && <p>Loading your bookings...</p>}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-bookings">
            <h3>No bookings yet</h3>
            <p>Search for a service and book your first appointment.</p>
            <button
              className="auth-submit"
              onClick={() => onNavigate("home")}
            >
              Find Services
            </button>
          </div>
        )}

        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <h3>
                  {booking.service?.serviceName || "Service"}
                </h3>
                <span
                  className={
                    booking.status === "CANCELLED"
                      ? "booking-status cancelled"
                      : "booking-status pending"
                  }
                >
                  {booking.status}
                </span>
              </div>

              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Date:</strong> {booking.bookingDate}</p>
              <p><strong>Time:</strong> {booking.bookingTime}</p>
              <p><strong>Address:</strong> {booking.address}</p>

              {booking.notes && (
                <p><strong>Notes:</strong> {booking.notes}</p>
              )}

              {booking.service?.provider && (
                <p>
                  <strong>Provider:</strong>{" "}
                  {booking.service.provider.name}
                </p>
              )}

              {booking.status === "PENDING" && (
                <button
                  className="cancel-booking-btn"
                  disabled={cancellingId === booking.id}
                  onClick={() => cancelBooking(booking.id)}
                >
                  {cancellingId === booking.id
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default MyBookings;
