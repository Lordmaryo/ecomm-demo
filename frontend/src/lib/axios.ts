import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:8000/api`, // add this to the .env file
  withCredentials: true, // sends cookies to the server
});

export default axiosInstance;
 