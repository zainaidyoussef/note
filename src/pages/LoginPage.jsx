import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

const Login = ({ setIsConnected }) => {
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  const StoreData = async () => {
    try {
      const resp = await axios.post("https://notes.devlop.tech/api/login", { cin, password });

      if (resp.data.token) {
      
        localStorage.setItem("token", resp.data.token);
        setIsConnected(true);
        navigate("/notes"); 
      } else {
        console.error("Login failed, token not returned.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <input
            className="input-cin"
            type="text"
            placeholder="Cin"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="input-pwd"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn-login" type="button" onClick={StoreData}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
