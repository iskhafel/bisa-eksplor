import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
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
          setIsLogin(true);
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
      setIsLogin(false);
    }
  }, [token]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (isLogin === true) {
    return <Outlet />;
  }

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
