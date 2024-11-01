import Header from "../components/Header";
import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import axios from "axios";
import Promo from "../components/Promo";
import Category from "../components/Category";
import CustomFooter from "../components/CustomFooter";

export default function HomePage() {
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
    <div className="min-h-screen bg-slate-800 text-white">
      <Header user={user} />
      <Banner />
      <Promo />
      <Category />
      <CustomFooter />
    </div>
  );
}
