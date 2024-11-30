import axios from "axios";
import Swal from "sweetalert2";

const ApiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // timeout: 0000,
});

// Set token if it exists in local storage
const token = localStorage.getItem("Token");
if (token) {
  ApiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Add response interceptor
// Handling Token Expiry and Navigate back to Login
export const addResponseInterceptor = (navigate) => {
  ApiService.interceptors.response.use(
    (response) => {
      // Do something with response data
      return response;
    },
    (error) => {
      // Handle token expiration
      console.log("error", error);
      if (
        (error.response &&
          error.response.status === 401 &&
          error?.response?.data?.Message == "Invalid token") ||
        error?.response?.data?.error?.name == "Token empty" ||
        error?.response?.data?.error?.name == "Unauthorized User"
      ) {
        // Show a popup or notification indicating token expiration
        let timerInterval;
        let remainingTime = 5;
        Swal.fire({
          title: "Unauthorized",
          icon: "error",
          html: "Session Expired ,will Navigate to Login Page in <b></b>sec .",
          timer: remainingTime * 1000,
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              if (timer) {
                timer.textContent = remainingTime--;
              }
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          navigate("/");
          localStorage.clear();
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });
        return;
      }

      // Do something with response error
      return Promise.reject(error);
    }
  );
};

export default ApiService;
