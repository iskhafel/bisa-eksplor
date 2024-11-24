/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const Activity = ({ limit = 4 }) => {
  // Set a default limit of 4
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: `url("/rebe-adelaida-zunQwMy5B6M-unsplash.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  useEffect(() => {
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      )
      .then((response) => setActivities(response.data.data))
      .catch((error) => console.error("Failed to fetch activities:", error));
  }, []);

  const displayedActivities = activities.slice(0, limit);

  const handleDetailClick = (id) => {
    navigate(`/activity/${id}`);
  };

  return (
    <div className="py-8 bg-gray-900" style={backgroundStyle}>
      {" "}
      {/* Apply backgroundStyle here */}
      <div className="text-center py-2 bg-opacity-75">
        <h2 className="text-3xl font-bold mb-2 pt-4">
          Explore Activities By Categories!
        </h2>
        <p className="text-lg">Find your next adventure</p>
      </div>
      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 pt-8">
        {displayedActivities.map((activity) => (
          <Card
            key={activity.id}
            className="bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleDetailClick(activity.id)}
          >
            <img
              src={activity.imageUrls[0] || "https://via.placeholder.com/150"}
              alt={activity.title}
              className="w-full h-40 object-cover rounded-t-lg"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/150")
              }
            />
            <div className="p-4 text-center h-32 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {activity.address}
                </p>
                <p className="text-blue-600 font-bold">
                  {activity.price_discount
                    ? `$${activity.price_discount}`
                    : `$${activity.price}`}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activity;
