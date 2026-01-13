import React from "react";

const BookingAndPayment = () => {
  const styles = {
    page: {
      backgroundColor: "#0B0E14",
      minHeight: "100vh",
      color: "#FFFFFF",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      padding: "40px",
      gap: "40px"
    },
    // --- SEAT SELECTION SIDE ---
    leftSection: { flex: "2" },
    stageGlow: {
      height: "8px",
      width: "70%",
      margin: "0 auto 60px",
      background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
      boxShadow: "0 15px 40px rgba(99, 102, 241, 0.6)",
      borderRadius: "100px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: "12px",
      justifyContent: "center",
      maxWidth: "600px",
      margin: "0 auto"
    },
    seatBase: {
      width: "35px",
      height: "35px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.1)",
      cursor: "pointer",
      transition: "0.3s"
    },
    // --- PAYMENT SIDEBAR ---
    sidebar: {
      flex: "1",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "32px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      height: "fit-content",
      position: "sticky",
      top: "40px"
    },
    inputField: {
      width: "100%",
      backgroundColor: "rgba(0,0,0,0.2)",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: "14px",
      borderRadius: "12px",
      color: "#fff",
      marginTop: "8px",
      marginBottom: "20px"
    },
    payButton: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      border: "none",
      borderRadius: "14px",
      color: "#fff",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "10px",
      boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)"
    }
  };

  return (
    <div style={styles.page}>
      
      {/* SEAT SELECTION AREA */}
      <div style={styles.leftSection}>
        <h2 style={{ textAlign: "center", letterSpacing: "4px", marginBottom: "10px" }}>GRAND HALL</h2>
        <div style={styles.stageGlow}></div>
        
        <div style={styles.grid}>
          {[...Array(60)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                ...styles.seatBase, 
                backgroundColor: i === 14 || i === 15 ? "#6366f1" : "rgba(255,255,255,0.05)",
                borderColor: i === 14 || i === 15 ? "#818cf8" : "rgba(255,255,255,0.1)"
              }} 
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "50px" }}>
          <Legend color="rgba(255,255,255,0.05)" label="Ready" />
          <Legend color="#6366f1" label="Selected" />
          <Legend color="#1e293b" label="Sold Out" />
        </div>
      </div>

      {/* PAYMENT SUMMARY AREA */}
      <div style={styles.sidebar}>
        <h3 style={{ marginBottom: "24px", fontSize: "1.4rem" }}>Checkout</h3>
        
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0" }}>SELECTED SEATS</p>
          <p style={{ fontWeight: "600" }}>Row B: Seat 14, 15</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", padding: "20px", backgroundColor: "rgba(99, 102, 241, 0.1)", borderRadius: "16px" }}>
          <span style={{ fontWeight: "500" }}>Total Amount</span>
          <span style={{ fontWeight: "800", color: "#818cf8", fontSize: "1.2rem" }}>$45.00</span>
        </div>

        <label style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>CARDHOLDER NAME</label>
        <input style={styles.inputField} placeholder="Enter your name" />

        <label style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>CARD NUMBER</label>
        <input style={styles.inputField} placeholder="0000 0000 0000 0000" />

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8" }}>EXPIRY</label>
            <input style={styles.inputField} placeholder="MM/YY" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8" }}>CVC</label>
            <input style={styles.inputField} placeholder="***" />
          </div>
        </div>

        <button style={styles.payButton}>Pay Now</button>
        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#475569", marginTop: "20px" }}>
          Payment processed via SecurePort 2.0
        </p>
      </div>

    </div>
  );
};

const Legend = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ width: "12px", height: "12px", borderRadius: "4px", backgroundColor: color, border: "1px solid rgba(255,255,255,0.1)" }}></div>
    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{label}</span>
  </div>
);

export default BookingAndPayment;