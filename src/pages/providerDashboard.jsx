
import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function ProviderDashboard({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/provider/bookings");
      setBookings(response.data);
    } catch (err) {
      console.error("Provider bookings error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please log in with your provider account."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (id, status) => {
    const action = status === "ACCEPTED" ? "accept" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
      return;
    }

    setUpdatingId(id);
    setError("");
    setMessage("");

    try {
      await API.put(`/provider/bookings/${id}/status`, { status });

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? { ...booking, status }
            : booking
        )
      );

      setMessage(`Booking #${id} ${action}ed successfully.`);
    } catch (err) {
      console.error("Update booking error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update this booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "ACCEPTED"
  ).length;

  return (
    <main className="provider-dashboard">
      <div className="provider-dashboard-container">
        <button
          className="back-home"
          onClick={() => onNavigate("home")}
        >
          ← Back to Home
        </button>

        <div className="provider-dashboard-heading">
          <div>
            <p className="hero-tagline">PROVIDER PORTAL</p>
            <h1>Provider Dashboard</h1>
            <p className="bookings-description">
              Manage requests for your services.
            </p>
          </div>

          <button
            className="provider-refresh-btn"
            onClick={loadBookings}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="provider-stats">
          <div className="provider-stat-card">
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </div>

          <div className="provider-stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="provider-stat-card">
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
          </div>
        </div>

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading && <p>Loading booking requests...</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-bookings">
            <h3>No booking requests yet</h3>
            <p>
              New requests for your services will appear here.
            </p>
          </div>
        )}

        <div className="booking-list">
          {!loading &&
            bookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card-header">
                  <div>
                    <h3>{booking.serviceName}</h3>
                    <p>Booking #{booking.id}</p>
                  </div>

                  <span
                    className={`booking-status ${
                      booking.status === "CANCELLED" ||
                      booking.status === "REJECTED"
                        ? "cancelled"
                        : booking.status === "ACCEPTED"
                          ? "accepted"
                          : "pending"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p>
                  <strong>Category:</strong> {booking.category}
                </p>
                <p>
                  <strong>Price:</strong> ₹{booking.price}
                </p>
                <p>
                  <strong>Date:</strong> {booking.bookingDate}
                </p>
                <p>
                  <strong>Time:</strong> {booking.bookingTime}
                </p>
                <p>
                  <strong>Customer:</strong> {booking.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {booking.customerEmail}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {booking.customerPhone || "Not provided"}
                </p>
                <p>
                  <strong>Address:</strong> {booking.address}
                </p>

                {booking.notes && (
                  <p>
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}

                {booking.status === "PENDING" && (
                  <div className="provider-action-buttons">
                    <button
                      className="accept-booking-btn"
                      disabled={updatingId === booking.id}
                      onClick={() =>
                        updateStatus(booking.id, "ACCEPTED")
                      }
                    >
                      {updatingId === booking.id
                        ? "Updating..."
                        : "Accept Booking"}
                    </button>

                    <button
                      className="reject-booking-btn"
                      disabled={updatingId === booking.id}
                      onClick={() =>
                        updateStatus(booking.id, "REJECTED")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
        </div>
      </div>
    </main>
  );
}

export default ProviderDashboard;
