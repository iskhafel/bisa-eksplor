import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const ActivityPage = () => {
  const { user } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch categories and activities
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        );
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    fetchAllActivities();
  }, []);

  // Fetch all activities
  const fetchAllActivities = () => {
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      )
      .then((response) => {
        setActivities(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch all activities:", error);
      });
  };

  // Fetch activities by category
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities-by-category/${selectedCategory.id}`,
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        )
        .then((response) => {
          setActivities(response.data.data);
        })
        .catch((error) =>
          console.error("Failed to fetch activities by category:", error)
        );
    }
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleDetailClick = (activityId) => {
    navigate(`/activity/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <Header user={user} />

      <div className="text-center py-8 bg-gray-900">
        <h2 className="text-3xl font-bold mb-2 pt-4">
          Explore Activities By Categories!
        </h2>
        <p className="text-lg">Find your next adventure</p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-4 px-6 py-4 bg-gray-900">
        <button
          className={`px-4 py-2 rounded-full ${
            !selectedCategory ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => {
            setSelectedCategory(null);
            fetchAllActivities();
          }}
        >
          All Activities
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full ${
              selectedCategory?.id === category.id
                ? "bg-blue-500"
                : "bg-gray-700"
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {activities.map((activity) => (
          <Card
            key={activity.id}
            className="bg-white text-black rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 p-4"
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
            <div
              className="pt-4 h-36 flex flex-col justify-between"
              style={{ minHeight: "144px" }} // Ensures a fixed height for content area
            >
              <h3 className="text-lg font-semibold mb-1 line-clamp-1">
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
