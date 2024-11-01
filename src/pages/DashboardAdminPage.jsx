import Header from "../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DashboardAdminPage() {
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
        setUser(response.data.data); // Set user data, including role
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      {/* Pass the fully loaded user object to Header */}
      <Header user={user} />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-700">
          Welcome, {user ? user.name : "Admin"}!
        </h1>

        {/* Profile Information */}
        {user && (
          <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Profile Information
            </h2>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Phone Number:</strong> {user.phoneNumber}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
