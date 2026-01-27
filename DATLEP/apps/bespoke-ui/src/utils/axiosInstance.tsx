import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Handle logout and prevent infinite loop
const handleLogout = () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Add request to queue
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// Run queued requests
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// Handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const res =await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/seller-refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log(res);
        

        isRefreshing = false;
        onRefreshed();

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
