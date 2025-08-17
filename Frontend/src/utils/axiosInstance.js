import axios from "axios";

const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true // <-- important for sending cookies
});

export default API;
