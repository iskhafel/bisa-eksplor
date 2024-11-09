import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import { Button, Card, Carousel } from "flowbite-react";
import CustomFooter from "../../../components/CustomFooter";

export default function DetailActivityPage() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  // Fetch activity details by ID
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        );
        setActivity(response.data.data);
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
      }
    };
    fetchActivity();
  }, [id]);

  // Handle adding activity to the cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId: activity.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      alert("Activity added to cart!");
    } catch (error) {
      console.error("Failed to add activity to cart:", error);
      alert("Failed to add activity to cart. Please try again.");
    }
  };

  return (
    <>
      <Header user={user} />
      <div
        className="relative min-h-screen bg-slate-900 text-white flex justify-center items-center p-4"
        style={{
          backgroundImage: `url("/rebe-adelaida-zunQwMy5B6M-unsplash.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 max-w-3xl w-full">
          {activity ? (
            <Card className="bg-white text-black rounded-lg shadow-lg">
              {/* Carousel for Activity Images */}
              <Carousel indicators={false} className="w-full h-80 rounded-t-lg">
                {activity.imageUrls.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl || "https://via.placeholder.com/150"}
                    alt={activity.title}
                    className="w-full h-80 object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "https://via.placeholder.com/150")
                    }
                  />
                ))}
              </Carousel>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {activity.title}
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  {activity.description}
                </p>
                <p className="text-lg font-semibold text-blue-600 mb-2">
                  Price: ${activity.price_discount || activity.price}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {activity.address}
                </p>
                <p className="text-sm text-gray-500">
                  Facilities: {activity.facilities}
                </p>
                <Button onClick={handleAddToCart} className="mt-6">
                  Add to Cart
                </Button>

                {/* Location Map */}
                {activity.location_maps && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Location Map</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: activity.location_maps,
                      }}
                      className="w-full h-64 rounded-lg overflow-hidden"
                    ></div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <p className="text-white text-lg">Loading activity details...</p>
          )}
        </div>
      </div>
      <CustomFooter />
    </>
  );
}
