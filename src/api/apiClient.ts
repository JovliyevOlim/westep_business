import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api.example.com",
    withCredentials: true,
});

// Access tokenni headerga qo‘shish
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Token refresh logikasi
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return Promise.reject(error);

            try {
                const { data } = await axios.post("https://api.example.com/auth/refresh", {
                    refreshToken,
                });

                localStorage.setItem("accessToken", data.accessToken);
                apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;