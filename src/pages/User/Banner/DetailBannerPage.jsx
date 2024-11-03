import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext } from "react";

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
      <div>
        <h1>{banner.name}</h1>
        <img src={banner.imageUrl} alt={banner.name} />
        <p>{banner.createdAt}</p>
        <p>{banner.updatedAt}</p>
        {/* Additional banner details here */}
      </div>
    </>
  );
}
