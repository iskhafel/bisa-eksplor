import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext } from "react";

export default function DetailPromoPage() {
  const { id } = useParams(); // Get promo ID from URL
  const [promo, setPromo] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch promo by ID from API
    axios
      .get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${id}`,
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      )
      .then((response) => setPromo(response.data.data))
      .catch((error) => console.error("Failed to fetch promo:", error));
  }, [id]);

  if (!promo) {
    return <p>Loading...</p>; // Display loading message while fetching
  }

  return (
    <>
      <Header user={user} />
      <div>
        <h1>{promo.title}</h1>
        <img src={promo.imageUrl} alt={promo.title} />
        <p>{promo.description}</p>
        {/* Additional promo details here */}
      </div>
    </>
  );
}
