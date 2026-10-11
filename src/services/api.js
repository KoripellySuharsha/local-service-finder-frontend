
import axios from "axios";

const API = axios.create({
  baseURL: "https://local-service-finder-backend-1-vmge.onrender.com/api",
  withCredentials: true,
});

export default API;
