import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";

const Promo = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    // Fetch promos from API
    const fetchPromos = () => {
      axios
        .get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        )
        .then((response) => {
          console.log("Promos response:", response.data.data);
          setPromos(response.data.data); // Assuming promos are in response.data.data
        })
        .catch((error) => console.error("Failed to fetch promos:", error));
    };

    fetchPromos();
  }, []);

  return (
    <div className="w-full py-8 bg-slate-800 text-white">
      {/* Promo Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Special Promo For You!</h2>
        <p className="text-lg">Exclusive Offers and Discounts</p>
      </div>

      {/* Promo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {promos.length > 0 ? (
          promos.map((promo) => (
            <Card
              key={promo.id}
              imgAlt={promo.title}
              imgSrc={promo.imageUrl}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {promo.title}
                </h3>
                <p className="text-slate-600">{promo.description}</p>
                {promo.promo_discount_price && (
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    {promo.promo_discount_price}% Off!
                  </p>
                )}
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
  );
};

export default Promo;
