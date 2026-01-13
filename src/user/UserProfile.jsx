import React, { useEffect, useState } from "react";
import { getUserBookingsAPI } from "../services/allAPI";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bookings: []
  });

  useEffect(() => {
    fetchUserContent();
  }, []);

  const fetchUserContent = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      try {
        const result = await getUserBookingsAPI(reqHeader);
        console.log("Frontend received data:", result.data); // DEBUG LOG

        if (result.status === 200) {
          // If backend sends { bookings: [...] }, we use result.data
          // If backend sends only the array, we use { ...userData, bookings: result.data }
          setUserData(result.data?.bookings ? result.data : { ...userData, bookings: result.data });
        }
      } catch (err) {
        console.log("Error fetching profile:", err);
      }
    }
  };

  const styles = {
    container: { backgroundColor: "#0B0E14", minHeight: "100vh", color: "#FFFFFF", display: "flex", padding: "40px" },
    sidebar: { flex: "0.8", borderRight: "1px solid rgba(255, 255, 255, 0.1)", paddingRight: "40px", display: "flex", flexDirection: "column", alignItems: "center" },
    avatar: { width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px" },
    content: { flex: "3", paddingLeft: "60px" },
    ticketCard: { background: "rgba(255, 255, 255, 0.03)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", marginBottom: "25px", overflow: "hidden" },
    leftStub: { padding: "30px", flex: "2" },
    statusBadge: { padding: "4px 12px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "10px", display: "inline-block" },
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.avatar}>
          {userData?.username ? userData.username.charAt(0).toUpperCase() : "U"}
        </div>
        <h2 style={{ margin: "0" }}>{userData?.username || "User"}</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{userData?.email}</p>

        <nav style={{ width: "100%", marginTop: "40px" }}>
          <div style={{ padding: "15px", borderRadius: "12px", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#818cf8", fontWeight: "600" }}>🎟 My Bookings</div>
          <div style={{ padding: "15px", color: "#64748b" }}>⚙️ Settings</div>
          <div style={{ padding: "15px", color: "#64748b" }}>🚪 Logout</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.content}>
        <h1 style={{ marginBottom: "40px", fontSize: "2rem" }}>My Bookings</h1>

        {userData?.bookings?.length > 0 ? (
          userData.bookings.map((item) => (
            <div key={item._id} style={styles.ticketCard}>
              <div style={styles.leftStub}>
                <span style={{ ...styles.statusBadge, backgroundColor: item.status === "booked" ? "#10b981" : "#6366f1" }}>
                  {item.status || "Confirmed"}
                </span>
                
                {/* FIX: Checks both .name and .title */}
                <h3 style={{ fontSize: "1.5rem", margin: "10px 0", color: "#818cf8" }}>
                  {item.eventId?.name || item.eventId?.title || "Event Name"}
                </h3>
                
                <p style={{ color: "#94a3b8", margin: "5px 0" }}>
                 📍 {item.eventId?.auditorium || item.eventId?.location || "Venue"}
                </p>

                <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
                  <div>
                    <p style={{ color: "#475569", fontSize: "0.7rem", fontWeight: "800" }}>DATE</p>
                    <p style={{ margin: "0", fontWeight: "600" }}>
                      {item.eventId?.date ? new Date(item.eventId.date).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569", fontSize: "0.7rem", fontWeight: "800" }}>SEATS</p>
                    <p style={{ margin: "0", fontWeight: "600", color: "#FFFFFF" }}>
                      {/* FIX: Checks if seats is array of objects or strings */}
                      {item.seats?.map(s => typeof s === 'object' ? s.seatNumber : s).join(", ")}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569", fontSize: "0.7rem", fontWeight: "800" }}>TOTAL</p>
                    <p style={{ margin: "0", fontWeight: "600" }}>₹{item.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "20px" }}>
            <p style={{ color: "#64748b" }}>You have no active bookings.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;