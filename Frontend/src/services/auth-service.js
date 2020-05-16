import axios from "axios";

const API_URL = "http://localhost:8080/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "login", {
                username,
                password
            })
            .then(response => {
                console.log(response.headers.authorization);
                if (response.headers.authorization) {
                    localStorage.setItem("foodTrackerUser", JSON.stringify(response.headers.authorization));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("foodTrackerUser");
        window.location.href = '/login';
    }

    register(username, password) {
        return axios.post(API_URL + "users/sign-up", {
            username,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('foodTrackerUser'));;
    }
}

export default new AuthService();
