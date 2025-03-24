import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";

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
    navigate("/authpage");
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

  const updateTrades = async (currentUser) => {
    try {
      const incomingTradesQuery = query(
        collection(db, "trades"),
        where("ownerId", "==", currentUser)
      );
      const incomingTradesSnapshot = await getDocs(incomingTradesQuery);
      const incomingTrades = incomingTradesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "incoming",
      }));

      const outgoingTradesQuery = query(
        collection(db, "trades"),
        where("senderId", "==", currentUser)
      );
      const outgoingTradesSnapshot = await getDocs(outgoingTradesQuery);
      const outgoingTrades = outgoingTradesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "outgoing",
      }));

      const allTrades = [...incomingTrades, ...outgoingTrades];
      return allTrades;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  };

  const createTrade = async (tradeData) => {
    try {
      const tradeRef = await addDoc(collection(db, "trades"), {
        ...tradeData,
        status: "pending",
        createdAt: new Date(),
      });
      console.log("Trade created with ID:", tradeRef.id);
      return tradeRef.id;
    } catch (error) {
      console.error("Error creating trade:", error);
      return false;
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteDoc(doc(db, "trades", tradeId));
      return true;
    } catch (error) {
      console.error("Error deleting trade:", error);
      return false;
    }
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
        handleDeleteTrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
