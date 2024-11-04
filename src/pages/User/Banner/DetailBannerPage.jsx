import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext } from "react";
import { Card } from "flowbite-react";

export default function DetailBannerPage() {
  const { id } = useParams(); // Get banner ID from URL
  const [banner, setBanner] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch banner by ID from API
    axios
      .get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banner/${id}`,
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      )
      .then((response) => setBanner(response.data.data))
      .catch((error) => console.error("Failed to fetch banner:", error));
  }, [id]);

  if (!banner) {
    return <p>Loading...</p>; // Display loading message while fetching
  }

  return (
    <>
      <Header user={user} />
      <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center p-4">
        <Card className="max-w-lg bg-white text-black rounded-lg shadow-lg">
          <img
            src={banner.imageUrl || "https://via.placeholder.com/150"}
            alt={banner.title}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/150")
            }
          />
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{banner.name}</h2>
            <p className="text-sm text-gray-500">
              Created at: ${banner.createdAt}
            </p>
            <p className="text-sm text-gray-500">
              Updated at: ${banner.updatedAt}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
