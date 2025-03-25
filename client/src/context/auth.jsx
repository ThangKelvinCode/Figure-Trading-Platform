import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.js"; // Đảm bảo bạn đã import axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null); // Thêm state cho userId
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("SWD392_isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const storedUsername = sessionStorage.getItem("SWD392_username") || "";
      const storedUserId = sessionStorage.getItem("SWD392_user_id") || null; // Lấy userId từ sessionStorage
      const storedRole = sessionStorage.getItem("SWD392_role");
      const roleToSet = storedRole ? storedRole.toLowerCase().trim() : "user";
      setUsername(storedUsername);
      setUserId(storedUserId); // Cập nhật userId vào state
      setRole(roleToSet);
      console.log("Initial state from sessionStorage:", {
        isLoggedIn: loggedIn,
        username: storedUsername,
        userId: storedUserId,
        role: roleToSet,
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const loginUrl = "http://localhost:3000/user/login";
      const credentials = {
        email,
        password,
      };

      console.log("Login request body:", credentials);
      const loginResponse = await api.post(loginUrl, credentials);

      const { message, user_id, access_token, refresh_token } =
        loginResponse.data;

      if (message === "Login Successfully") {
        const userDetailsUrl = `http://localhost:3000/user/${user_id}`;
        const userResponse = await api.get(userDetailsUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userDetails = userResponse.data;
        const username = userDetails.user.name;

        sessionStorage.setItem("token", access_token);
        sessionStorage.setItem("refresh_token", refresh_token);
        sessionStorage.setItem("SWD392_isLoggedIn", "true");
        sessionStorage.setItem("SWD392_username", username);
        sessionStorage.setItem("SWD392_user_id", user_id); // Lưu userId
        sessionStorage.setItem("SWD392_role", "user");

        setIsLoggedIn(true);
        setUsername(username);
        setUserId(user_id); // Cập nhật userId vào state
        setRole("user");

        console.log("State after login:", {
          isLoggedIn: true,
          username,
          userId: user_id,
          role: "user",
        });

        navigate("/");
        return true;
      } else {
        console.log("Login failed:", message);
        return false;
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("SWD392_isLoggedIn");
    sessionStorage.removeItem("SWD392_username");
    sessionStorage.removeItem("SWD392_user_id");
    sessionStorage.removeItem("SWD392_role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh_token");

    setIsLoggedIn(false);
    setUsername("");
    setUserId(null); // Reset userId
    setRole("user");

    navigate("/authpage");
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      const apiUrl = "http://localhost:3000/user/register";
      const newUser = {
        name: username,
        email,
        password,
        confirmed_password: confirmPassword,
        date_of_birth: new Date().toISOString(), // API yêu cầu date_of_birth
      };

      console.log("Request body:", newUser);
      const response = await api.post(apiUrl, newUser);

      const createdUser = response.data;
      sessionStorage.setItem("SWD392_isLoggedIn", "true");
      sessionStorage.setItem("SWD392_username", createdUser.name || username);
      sessionStorage.setItem("SWD392_user_id", createdUser.id); // Lưu userId từ response

      if (createdUser.access_token) {
        sessionStorage.setItem("token", createdUser.access_token);
      }
      if (createdUser.refresh_token) {
        sessionStorage.setItem("refresh_token", createdUser.refresh_token);
      }

      setIsLoggedIn(true);
      setUsername(createdUser.name || username);
      setUserId(createdUser.id); // Cập nhật userId vào state
      return true;
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const updateTrades = (currentUser) => {
    const allTrades = JSON.parse(localStorage.getItem("SWD392_trades") || "[]");
    return allTrades.filter((trade) => trade.owner === currentUser);
  };

  const createTrade = (tradeData) => {
    const existingTrades = JSON.parse(
      localStorage.getItem("SWD392_trades") || "[]"
    );
    const updatedTrades = [...existingTrades, tradeData];
    localStorage.setItem("SWD392_trades", JSON.stringify(updatedTrades));
    return tradeData;
  };

  const handleDeleteTrade = (tradeId) => {
    try {
      const existingTrades = JSON.parse(
        localStorage.getItem("SWD392_trades") || "[]"
      );
      const updatedTrades = existingTrades.filter(
        (trade) => trade.id !== tradeId
      );
      localStorage.setItem("SWD392_trades", JSON.stringify(updatedTrades));
      return true;
    } catch (error) {
      console.error("Error deleting trade:", error);
      return false;
    }
  };

  const updateItems = (currentUser) => {
    const allItems = JSON.parse(localStorage.getItem("SWD392_items") || "[]");
    return allItems.filter((item) => item.owner === currentUser);
  };

  const createItem = (itemData) => {
    const existingItems = JSON.parse(
      localStorage.getItem("SWD392_items") || "[]"
    );
    const updatedItems = [...existingItems, itemData];
    localStorage.setItem("SWD392_items", JSON.stringify(updatedItems));
    return itemData;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userId, // Cung cấp userId qua context
        role,
        login,
        logout,
        register,
        updateTrades,
        createTrade,
        handleDeleteTrade,
        updateItems,
        createItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
