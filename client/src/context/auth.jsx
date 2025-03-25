import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("SWD392_isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const storedUsername = sessionStorage.getItem("SWD392_username") || "";
      const storedRole = sessionStorage.getItem("SWD392_role");
      const roleToSet = storedRole ? storedRole.toLowerCase().trim() : "user";
      setUsername(storedUsername);
      setRole(roleToSet);
      console.log("Initial state from localStorage:", {
        isLoggedIn: loggedIn,
        username: storedUsername,
        role: roleToSet,
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const apiUrl =
        "https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const normalizedRole = user.role
          ? user.role.toLowerCase().trim()
          : "user";
        console.log("Logged in user:", user);
        sessionStorage.setItem("SWD392_userId", user.id);
        sessionStorage.setItem("SWD392_isLoggedIn", "true");
        sessionStorage.setItem("SWD392_username", user.username);
        sessionStorage.setItem("SWD392_role", normalizedRole);
        setIsLoggedIn(true);
        setUsername(user.username);
        setRole(normalizedRole);
        console.log("State after login:", {
          isLoggedIn: true,
          username: user.username,
          role: normalizedRole,
        });
        navigate("/");
        return true;
      } else {
        console.log("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("SWD392_isLoggedIn");
    sessionStorage.removeItem("SWD392_username");
    sessionStorage.removeItem("SWD392_role");
    setIsLoggedIn(false);
    setUsername("");
    setRole("user");
    navigate("/login");
  };

  const register = async (username, email, password) => {
    try {
      const apiUrl =
        "https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users";
      const checkResponse = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!checkResponse.ok) throw new Error("Failed to fetch users");
      const users = await checkResponse.json();
      const emailExists = users.some((user) => user.email === email);

      if (emailExists) {
        throw new Error("Email already registered");
      }

      const newUser = { username, email, password };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const createdUser = await response.json();
      sessionStorage.setItem("SWD392_isLoggedIn", "true");
      sessionStorage.setItem("SWD392_username", createdUser.username);
      setIsLoggedIn(true);
      setUsername(createdUser.username);
      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const updateTrades = (currentUser) => {
    const allTrades = JSON.parse(localStorage.getItem("SWD392_trades") || "[]");
    return allTrades.filter((trade) => trade.owner === currentUser);
  };

  const createTrade = (sender, offer, request, owner) => {
    const tradeRequest = {
      id: Date.now(),
      sender,
      offer,
      request,
      owner,
      status: "pending",
    };
    const existingTrades = JSON.parse(
      sessionStorage.getItem("SWD392_trades") || "[]"
    );
    const updatedTrades = [...existingTrades, tradeRequest];
    sessionStorage.setItem("SWD392_trades", JSON.stringify(updatedTrades));
    return tradeRequest;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        role,
        login,
        logout,
        register,
        updateTrades,
        createTrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
