import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const loggedIn = sessionStorage.getItem("SWD392_isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          const storedUsername = sessionStorage.getItem("SWD392_username") || "";
          const storedUserId = sessionStorage.getItem("SWD392_user_id") || null;
          const storedRole = sessionStorage.getItem("SWD392_role");
          // const roleToSet = storedRole ? storedRole.toLowerCase().trim() : "user";
          const roleToSet = storedRole === "0" || storedRole === 0 ? "admin" : "user";
          setUsername(storedUsername);
          setUserId(storedUserId);
          setRole(roleToSet);
          console.log("Initial state from sessionStorage:", {
            isLoggedIn: loggedIn,
            username: storedUsername,
            userId: storedUserId,
            role: roleToSet,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false); // Set loading to false after initialization
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const loginUrl = "http://localhost:3000/user/login";
      const credentials = { email, password };

      console.log("Login request body:", credentials);
      const loginResponse = await api.post(loginUrl, credentials);

      const { message, user_id, access_token, refresh_token, role } = loginResponse.data;

      if (message === "Login Successfully") {
        const userDetailsUrl = `http://localhost:3000/user/${user_id}`;
        const userResponse = await api.get(userDetailsUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userDetails = userResponse.data;
        const username = userDetails.user.name;

        const userRole = role === 0 ? "admin" : "user";

        sessionStorage.setItem("token", access_token);
        sessionStorage.setItem("refresh_token", refresh_token);
        sessionStorage.setItem("SWD392_isLoggedIn", "true");
        sessionStorage.setItem("SWD392_username", username);
        sessionStorage.setItem("SWD392_user_id", user_id);
        sessionStorage.setItem("SWD392_role", userRole);

        setIsLoggedIn(true);
        setUsername(username);
        setUserId(user_id);
        setRole(userRole);

        console.log("State after login:", {
          isLoggedIn: true,
          username,
          userId: user_id,
          role: userRole,
        });

        navigate("/");
        return true;
      } else {
        console.log("Login failed:", message);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
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
    setUserId(null);
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
        date_of_birth: new Date().toISOString(),
      };

      console.log("Request body:", newUser);
      const response = await api.post(apiUrl, newUser);

      const createdUser = response.data;
      if (createdUser.message === "Register Successfully") {
        return true;
      } else {
        throw new Error(createdUser.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const updateTrades = (currentUser) => {
    const allTrades = JSON.parse(localStorage.getItem("SWD392_trades") || "[]");
    return allTrades.filter((trade) => trade.owner === currentUser);
  };

  const createTrade = (tradeData) => {
    const existingTrades = JSON.parse(localStorage.getItem("SWD392_trades") || "[]");
    const updatedTrades = [...existingTrades, tradeData];
    localStorage.setItem("SWD392_trades", JSON.stringify(updatedTrades));
    return tradeData;
  };

  const handleDeleteTrade = (tradeId) => {
    try {
      const existingTrades = JSON.parse(localStorage.getItem("SWD392_trades") || "[]");
      const updatedTrades = existingTrades.filter((trade) => trade.id !== tradeId);
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
    const existingItems = JSON.parse(localStorage.getItem("SWD392_items") || "[]");
    const updatedItems = [...existingItems, itemData];
    localStorage.setItem("SWD392_items", JSON.stringify(updatedItems));
    return itemData;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userId,
        role,
        login,
        logout,
        register,
        updateTrades,
        createTrade,
        handleDeleteTrade,
        updateItems,
        createItem,
        loading, // Expose the loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);