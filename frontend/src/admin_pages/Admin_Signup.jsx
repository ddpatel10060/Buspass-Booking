

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Admin_Signup = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    secretkey: "",
    name: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API Call
      const res = await axios.post(`${BASE_URL}/admin/signup`, formData, { withCredentials: true });

      // --- YE SABSE ZARURI PART HAI ---
      // 1. Token save karein taaki Guard allow kare
      localStorage.setItem("adminToken", res.data.token);
      
      // 2. User info save karein (Optional but recommended)
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 3. Redux store update karein
      dispatch(addUser(res.data.user));

      alert("Signup successful! Redirecting to Dashboard...");
      
      // Dashboard par bhejein
      navigate("/admin/home");
      
    } catch (error) {
      setError(error.response?.data?.message || "Error signing up. Check Secret Key.");
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Admin Signup</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Admin ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter Admin ID"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Secret Key</label>
            <input
              type="text"
              name="secretkey"
              value={formData.secretkey}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Enter Company Secret Key"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading ? "bg-gray-400" : "bg-gray-800 hover:bg-black shadow-md"
            }`}
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="text-blue-600 text-center mt-6 cursor-pointer hover:underline" onClick={() => navigate("/admin/login")}>
          Already have an account? Login here
        </p>
      </div>
    </div>
  );
};

export default Admin_Signup;
//dhruv

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../utils/constants";

// const Admin_Signup = () => {
//   const [formData, setFormData] = useState({
//     id: "",
//     password: "",
//     secretkey: "",
//     name: ""
//   });
  
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${BASE_URL}/admin/signup`, formData, { withCredentials: true });
//       alert("Signup successful");
//       navigate("/admin/home");
//     } catch (error) {
//       setError(error.response?.data?.message || "Error signing up");
//       console.error("Signup Error:", error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-[40%]">
//         <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Admin Signup</h2>
//         <form onSubmit={handleSubmit}>
//           <label className="block text-gray-700 font-semibold">Admin ID</label>
//           <input
//             type="text"
//             name="id"
//             value={formData.id}
//             onChange={handleChange}
//             className="w-full px-4 py-2 mb-3 border rounded-lg"
//             required
//           />

//           <label className="block text-gray-700 font-semibold">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 mb-3 border rounded-lg"
//             required
//           />

//           <label className="block text-gray-700 font-semibold">Secret Key</label>
//           <input
//             type="text"
//             name="secretkey"
//             value={formData.secretkey}
//             onChange={handleChange}
//             className="w-full px-4 py-2 mb-3 border rounded-lg"
//             required
//           />

//           <label className="block text-gray-700 font-semibold">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 mb-3 border rounded-lg"
//             required
//           />

//           {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//           <button
//             type="submit"
//             className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
//           >
//             Signup
//           </button>
//         </form>
//         <p className="text-blue-600 text-center mt-4 cursor-pointer" onClick={() => navigate("/admin/login")}>
//           Already have an account? Login here
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Admin_Signup;




// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import { BASE_URL } from "../utils/constants";

// // const Admin_Signup = () => {
// //   const [formData, setFormData] = useState({
// //     id: "",
// //     password: "",
// //     secretkey: "",
// //     name: ""
// //   });

// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post(`${BASE_URL}/admin/signup`, formData, {withCredentials:true});

// //       alert("Signup successful");
// //       navigate("/admin/home");
// //     } catch (error) {
// //       setError(error.response?.data?.message || "Error signing up");
// //       console.log(error)
// //       console.log(formData)
// //     }
// //   };

// //   return (
// //     <div className="flex justify-center items-center h-screen bg-gray-100">
// //       <div className="bg-white p-8 rounded-2xl shadow-lg w-[40%]">
// //         <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Admin Signup</h2>
// //         <form onSubmit={handleSubmit}>
// //           <label className="block text-gray-700 font-semibold">Admin ID</label>
// //           <input
// //             type="text"
// //             name="id"
// //             value={formData.id}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 mb-3 border rounded-lg"
// //             required
// //           />

// //           <label className="block text-gray-700 font-semibold">Password</label>
// //           <input
// //             type="password"
// //             name="password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 mb-3 border rounded-lg"
// //             required
// //           />

// //           <label className="block text-gray-700 font-semibold">Secret Key</label>
// //           <input
// //             type="text"
// //             name="secretkey"
// //             value={formData.secretkey}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 mb-3 border rounded-lg"
// //             required
// //           />

// //           <label className="block text-gray-700 font-semibold">Name</label>
// //           <input
// //             type="text"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 mb-3 border rounded-lg"
// //             required
// //           />

// //           {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

// //           <button
// //             type="submit"
// //             className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
// //           >
// //             Signup
// //           </button>
// //         </form>
// //         <p className="text-blue-600 text-center mt-4 cursor-pointer" onClick={() => navigate("/admin/login")}>
// //           Already have an account? Login here
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Admin_Signup;




// // // // import React from 'react'

// // // // export default function Signup() {
// // // //   return (
// // // //     <div>
// // // //       signup-finel
// // // //     </div>
// // // //   )
// // // // }

// // // // git remote add origin https://github.com/Alok8138/cmapus-Commute.git



// // // import React, { useState } from "react";
// // // import axios from "axios";
// // // import {
// // //   BrowserRouter as Router,
// // //   Routes,
// // //   Route,
// // //   Link,
// // //   useNavigate,
// // // } from "react-router-dom";

// // // const Signup = () => {
// // //   const [formData, setFormData] = useState({
// // //     secretkey: "",
// // //     id: "",
// // //     name: "",
// // //     password: "",
// // //   });
// // //   const navigate = useNavigate();

// // //   const handleChange = (e) => {
// // //     setFormData({ ...formData, [e.target.name]: e.target.value });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       const res = await axios.post(
// // //         "http://localhost:3000/api/signup",
// // //         // "http://localhost:3000/signup",
// // //         formData
// // //       );
// // //       alert("Signup successful");
// // //       navigate("/login");
// // //     } catch (error) {
// // //       alert("Error signing up");
// // //     }
// // //   };

  
// // //   return (
// // //     <div>
// // //       <h2>Signup</h2>
// // //       <form onSubmit={handleSubmit}>
// // //         <input
// // //           type="text"
// // //           name="secretkey"
// // //           placeholder="Secret Key"
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //                 <input
// // //           type="text"
// // //           name="id"
// // //           placeholder="Id"
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="name"
// // //           placeholder="name"
// // //           onChange={handleChange}
// // //           required
// // //         />

// // //         <input
// // //           type="password"
// // //           name="password"
// // //           placeholder="Password"
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //         <button type="submit">Signup</button>
// // //       </form>
// // //       <Link to="/login">Already have an account? Login</Link>
// // //     </div>
// // //   );
// // // };


// // // export default Signup;