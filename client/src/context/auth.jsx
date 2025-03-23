import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

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

  //chỉnh sửa login
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

  // const login = async (email, password) => {
  //   try {
  //     const apiUrl = "http://localhost:3000/user/login";
  //     const credentials = {
  //       email,
  //       password,
  //     };
  
  //     console.log("Login request body:", credentials); // Log for debugging
  //     const response = await api.post(apiUrl, credentials);
  
  //     const { message, user_id, access_token, refresh_token, token } = response.data;
  
  //     if (message === "Login Successfully") {
  //       // Store the access token in localStorage (used by Axios interceptor)
  //       localStorage.setItem("token", access_token);
  
  //       // Optionally store refresh_token if your app supports token refresh
  //       localStorage.setItem("refresh_token", refresh_token);
  
  //       // Store user data in sessionStorage
  //       sessionStorage.setItem("SWD392_isLoggedIn", "true");
  //       sessionStorage.setItem("SWD392_username", email); // Use email as username for now; adjust if backend returns a username
  //       sessionStorage.setItem("SWD392_user_id", user_id); // Store user_id if needed
  //       sessionStorage.setItem("SWD392_role", "user"); // Set a default role; adjust if backend returns a role
  
  //       setIsLoggedIn(true);
  //       setUsername(email); // Use email as username; adjust if needed
  //       setRole("user"); // Adjust if backend returns a role
  
  //       console.log("State after login:", {
  //         isLoggedIn: true,
  //         username: email,
  //         role: "user",
  //         user_id,
  //       });
  
  //       navigate("/");
  //       return true;
  //     } else {
  //       console.log("Login failed:", message);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error.response?.data || error.message);
  //     throw new Error(error.response?.data?.message || "Login failed");
  //   }
  // };

  // const login = async (email, password) => {
  //   try {
  //     // Step 1: Call the login endpoint to authenticate the user
  //     const loginUrl = "http://localhost:3000/user/login";
  //     const credentials = {
  //       email,
  //       password,
  //     };
  
  //     console.log("Login request body:", credentials);
  //     const loginResponse = await api.post(loginUrl, credentials);
  
  //     const { message, user_id, access_token, refresh_token } = loginResponse.data;
  
  //     if (message === "Login Successfully") {
  //       // Step 2: Call the /user/{id} endpoint to fetch user details
  //       const userDetailsUrl = `http://localhost:3000/user/${user_id}`;
  //       const userResponse = await api.get(userDetailsUrl, {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`, // Include the access token in the request
  //         },
  //       });
  
  //       const userDetails = userResponse.data;
  //       const username = userDetails.name; // The endpoint returns "name" as the username
  
  //       // Step 3: Store tokens and user data in sessionStorage
  //       sessionStorage.setItem("token", access_token);
  //       sessionStorage.setItem("refresh_token", refresh_token);
  
  //       sessionStorage.setItem("SWD392_isLoggedIn", "true");
  //       sessionStorage.setItem("SWD392_username", username);
  //       sessionStorage.setItem("SWD392_user_id", user_id);
  //       sessionStorage.setItem("SWD392_role", "user"); // Adjust if the backend returns a role
  
  //       setIsLoggedIn(true);
  //       setUsername(username);
  //       setRole("user");
  
  //       console.log("State after login:", {
  //         isLoggedIn: true,
  //         username,
  //         role: "user",
  //         user_id,
  //       });
  
  //       navigate("/");
  //       return true;
  //     } else {
  //       console.log("Login failed:", message);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error.response?.data || error.message);
  //     throw new Error(error.response?.data?.message || "Login failed");
  //   }
  // };

  const logout = () => {
    sessionStorage.removeItem("SWD392_isLoggedIn");
    sessionStorage.removeItem("SWD392_username");
    sessionStorage.removeItem("SWD392_role");
    setIsLoggedIn(false);
    setUsername("");
    setRole("user");
    navigate("/login");
  };

  // const logout = () => {
  //   // Clear sessionStorage
  //   sessionStorage.removeItem("SWD392_isLoggedIn");
  //   sessionStorage.removeItem("SWD392_username");
  //   sessionStorage.removeItem("SWD392_user_id");
  //   sessionStorage.removeItem("SWD392_role");
  //   sessionStorage.removeItem("token");
  //   sessionStorage.removeItem("refresh_token");
  
  //   setIsLoggedIn(false);
  //   setUsername("");
  //   setRole("user");
  //   navigate("/login");
  // };

  // chỉnh sửa register
  const register = async (username, email, password) => {
    try {
      const apiUrl =
        "https://67c7faf7c19eb8753e7bae06.mockapi.io/api/huy/users";
        // "http://localhost:3000/user/register";
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

  // const register = async (username, email, password, confirmPassword) => {
  //   try {
  //     const apiUrl = "http://localhost:3000/user/register";
  //     const newUser = {
  //       name: username,
  //       email,
  //       password,
  //       confirmed_password: confirmPassword,
  //     };
  
  //     console.log("Request body:", newUser);
  //     const response = await api.post(apiUrl, newUser);
  
  //     const createdUser = response.data;
  //     sessionStorage.setItem("SWD392_isLoggedIn", "true");
  //     sessionStorage.setItem("SWD392_username", createdUser.name || username);
  
  //     // If the register endpoint returns tokens in the future, store them in sessionStorage
  //     if (createdUser.access_token) {
  //       sessionStorage.setItem("token", createdUser.access_token);
  //     }
  //     if (createdUser.refresh_token) {
  //       sessionStorage.setItem("refresh_token", createdUser.refresh_token);
  //     }
  
  //     setIsLoggedIn(true);
  //     setUsername(createdUser.name || username);
  //     return true;
  //   } catch (error) {
  //     console.error("Error during registration:", error.response?.data || error.message);
  //     throw new Error(error.response?.data?.message || "Registration failed");
  //   }
  // };

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