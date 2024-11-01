import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem("JWT_TOKEN");

  useEffect(() => {
    if (token) {
      axios
        .get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        )
        .then((response) => {
          setIsAdmin(response.data.data.role === "admin");
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  // Show a loading message while waiting for the role check
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if the user is not authenticated or not an admin
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
