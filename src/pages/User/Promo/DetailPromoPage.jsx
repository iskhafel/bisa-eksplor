import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { Card } from "flowbite-react";

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
      <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center p-4">
        <Card className="max-w-lg bg-white text-black rounded-lg shadow-lg">
          <img
            src={promo.imageUrl || "https://via.placeholder.com/150"}
            alt={promo.title}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/150")
            }
          />
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{promo.title}</h2>
            <p className="text-sm text-gray-700 mb-2 pt-2">
              {promo.description}
            </p>
            <p className="text-sm text-gray-500 py-2">
              Terms and Conditions:
              <span
                dangerouslySetInnerHTML={{ __html: promo.terms_condition }}
              />
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Promo Code: {promo.promo_code}
            </p>
            <p className="text-sm text-gray-500">
              Discount Price: ${promo.promo_discount_price}
            </p>
            <p className="text-sm text-gray-500">
              Minimum Claim Price: ${promo.minimum_claim_price}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
