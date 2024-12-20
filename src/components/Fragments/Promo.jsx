/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const Promo = ({ limit }) => {
  const [promos, setPromos] = useState([]);
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/150";

  useEffect(() => {
    // Fetch promos from API
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      )
      .then((response) => {
        console.log("Promos response:", response.data.data);
        setPromos(response.data.data);
      })
      .catch((error) => console.error("Failed to fetch promos:", error));
  }, []);

  // Limit the displayed promos
  const displayedPromos = promos.slice(0, limit);

  const DetailPromo = (id) => {
    navigate(`/promo/${id}`);
  };

  return (
    <div
      className="relative w-full py-8 bg-slate-900 text-white mb-4"
      style={{
        backgroundImage: `url("/ashim-d-silva-pGcqw1ARGyg-unsplash.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay to reduce background brightness */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative">
        {/* Promo Title Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Special Promo For You!</h2>
          <p className="text-lg">Exclusive Offers and Discounts</p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {displayedPromos.length > 0 ? (
            displayedPromos.map((promo) => (
              <Card
                key={promo.id}
                className="bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => DetailPromo(promo.id)}
              >
                {/* Image Section with Cropping */}
                <img
                  src={promo.imageUrl || fallbackImage}
                  alt={promo.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <div className="p-4 text-center h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {promo.title}
                    </h3>
                    {promo.promo_discount_price && (
                      <p className="text-lg font-semibold text-blue-600 mt-2">
                        {promo.promo_discount_price}% Off!
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-white col-span-full">
              Loading promos...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promo;
