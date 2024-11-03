/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaGlobe,
  FaMountain,
  FaUmbrellaBeach,
  FaCity,
  FaHistory,
  FaUtensils,
} from "react-icons/fa";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = () => {
      axios
        .get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        )
        .then((response) => {
          console.log("Categories response:", response.data.data);
          setCategories(response.data.data); // Assuming categories are in response.data.data
        })
        .catch((error) => console.error("Failed to fetch categories:", error));
    };

    fetchCategories();
  }, []);

  // Array of available icons for categories
  const icons = [
    <FaMountain className="text-4xl text-green-500" />,
    <FaUmbrellaBeach className="text-4xl text-blue-500" />,
    <FaCity className="text-4xl text-gray-500" />,
    <FaHistory className="text-4xl text-yellow-500" />,
    <FaUtensils className="text-4xl text-red-500" />,
    <FaGlobe className="text-4xl text-teal-500" />,
  ];

  // Helper function to get a random icon for each category
  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="w-full py-8 bg-gray-100 text-slate-800">
      {/* Category Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
        <p className="text-lg">
          Discover different types of experiences and destinations
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer relative flex flex-col items-center justify-center p-6 bg-cover bg-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-white"
              style={{
                backgroundImage: `url(${category.imageUrl})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>

              {/* Icon and Text Content */}
              <div className="relative z-10 flex flex-col items-center">
                {getRandomIcon()}
                <h4 className="text-xl font-bold mt-4">{category.name}</h4>
                <p className="text-center mt-2">{category.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">Loading categories...</p>
        )}
      </div>
    </div>
  );
};

export default Category;
