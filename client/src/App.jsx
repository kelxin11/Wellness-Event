import { useState, useEffect } from "react";
import Login from "./pages/login";
import HRDashboard from "./pages/HRDashboard";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div style={{ minHeight: "100vh", width: "100vw", margin: 0, padding: 0 }}>
      {!user ? (
        <Login onLoginSuccess={setUser} />
      ) : user.role === "HR" ? (
        <HRDashboard user={user} />
      ) : (
        <VendorDashboard user={user} />
      )}
    </div>
  );
}

export default App;
