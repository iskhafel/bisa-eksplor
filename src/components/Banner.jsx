import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "flowbite-react";
import {
  FaUserCheck,
  FaWallet,
  FaHeadset,
  FaHandshake,
  FaShieldAlt,
  FaLeaf,
} from "react-icons/fa";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Fetch banners from API
    const fetchBanners = () => {
      axios
        .get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        )
        .then((response) => {
          console.log("Banners response:", response.data.data);
          setBanners(response.data.data); // Assuming the data is in response.data.data
        })
        .catch((error) => console.error("Failed to fetch banners:", error));
    };

    fetchBanners();
  }, []);

  return (
    <div className="w-full">
      {/* Banner Carousel */}
      <div className="w-full h-64">
        <Carousel>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative flex items-center justify-center h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            >
              <div className="justify-center items-center text-center pt-24 absolute inset-0 bg-black opacity-30">
                {banner.name}
              </div>
              <div className="relative z-10 text-white text-center p-4 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p>{banner.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Main Description Section */}
      <div className="bg-gray-100  text-center p-6 ">
        <h3 className="text-3xl font-bold mb-2 text-black">
          Why Choose BisaEksplor Travel?
        </h3>
        <p className="text-lg text-black xl:mx-40">
          With our quality travel packages, real-time support, and unique
          cultural explorations, we ensure that every journey becomes a
          cherished memory. Here’s why our customers choose us!
        </p>

        {/* Key Points Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto py-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaUserCheck className="text-blue-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              Personalized Experiences
            </h4>
            <p className="text-slate-600 mb-2">
              Tailored travel plans to match your unique preferences.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaWallet className="text-green-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              Affordable Packages
            </h4>
            <p className="text-slate-600 mb-2">
              Competitive pricing that makes travel accessible for everyone.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaHeadset className="text-purple-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              24/7 Customer Support
            </h4>
            <p className="text-slate-600 mb-2">
              Our team is here to assist you at any hour of the day.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaHandshake className="text-yellow-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              Trusted Partners
            </h4>
            <p className="text-slate-600 mb-2">
              Collaborations with reputable hotels and transport providers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaShieldAlt className="text-red-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              Safe and Secure
            </h4>
            <p className="text-slate-600 mb-2">
              Your safety is our top priority in every location.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaLeaf className="text-teal-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              Eco-Friendly Options
            </h4>
            <p className="text-slate-600 mb-2">
              Promoting sustainable travel and eco-conscious choices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
