import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { Card } from "flowbite-react";
import CustomFooter from "../../../components/CustomFooter";

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
      <div
        className="relative min-h-screen bg-slate-900 text-white flex justify-center items-center p-4"
        style={{
          backgroundImage: `url("/ashim-d-silva-pGcqw1ARGyg-unsplash.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay to reduce background brightness */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 max-w-lg w-full">
          <Card className="bg-white text-black rounded-lg shadow-lg">
            <img
              src={promo.imageUrl || "https://via.placeholder.com/150"}
              alt={promo.title}
              className="w-full h-64 object-cover rounded-t-lg"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/150")
              }
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {promo.title}
              </h2>
              <p className="text-sm text-gray-700 mb-4">{promo.description}</p>

              <div className="text-sm text-gray-500 mb-4">
                <p className="font-semibold mb-1">Terms and Conditions:</p>
                <div
                  dangerouslySetInnerHTML={{ __html: promo.terms_condition }}
                />
              </div>

              <div className="text-center text-lg font-semibold text-blue-600 mb-4">
                Promo Code: {promo.promo_code}
              </div>

              <div className="text-sm text-gray-500 space-y-2">
                <p>Discount Price: ${promo.promo_discount_price}</p>
                <p>Minimum Claim Price: ${promo.minimum_claim_price}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <CustomFooter />
    </>
  );
}
