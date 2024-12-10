import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (token) {
      setIsConnected(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isConnected ? <Navigate to="/notes" /> : <Login setIsConnected={setIsConnected} />}
        />
        <Route path="/notes" element={<NotesPage setIsConnected={setIsConnected} />} />
      </Routes>
    </Router>
  );
}

export default App;
