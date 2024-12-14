/* eslint-disable react/prop-types */
import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUserProfile = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((response) => {
        console.log("User profile response:", response.data.data);
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, getUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
