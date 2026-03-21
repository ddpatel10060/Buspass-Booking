

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

// const BASE_URL = BASE_URL || "http://localhost:3000";


const Signup = () => {
  const [formData, setFormData] = useState({
    enrollment: "",
    email: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gnuEmailRegex = /^[a-zA-Z0-9._%+-]+@gnu\.ac\.in$/;
    const emailDomain = "@gnu.ac.in";
  if (!gnuEmailRegex.test(formData.email.toLowerCase())) {
    alert("Strict Access: Sirf @gnu.ac.in domain allowed hai. Gmail ya dusre emails block hain.");
    return; // Yahin se wapas bhej dega, signup stop ho jayega
  }
  if (!formData.email.endsWith(emailDomain)) {
    alert("Access Denied: You must use a @gnu.ac.in email address.");
    return; // This prevents the axios request from sending
  }
    
    try {
      const res = await axios.post(
        `${BASE_URL}/api/signup`,
        // "http://localhost:3000/signup",
        formData
      );
      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert("Error signing up");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="enrollment"
          placeholder="Enrollment No"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enrollment@gnu.ac.in"
         
          
          value={formData.email}
          onChange={handleChange}
           required
          pattern=".+@gnu\.ac\.in"
          title="Please use your university email ending in @gnu.ac.in"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};


export default Signup;